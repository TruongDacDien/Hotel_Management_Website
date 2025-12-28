import google.generativeai as genai
import os
from dotenv import load_dotenv
from db import get_db_connection
from collections import defaultdict
from typing import Any, Dict, List, Optional

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")


def _safe_join(lines: List[str], max_chars: int) -> str:
    out, total = [], 0
    for ln in lines:
        if not ln:
            continue
        ln = str(ln).strip()
        if not ln:
            continue
        if total + len(ln) + 1 > max_chars:
            break
        out.append(ln)
        total += len(ln) + 1
    return "\n".join(out) if out else "(Không có dữ liệu.)"


def _format_history(rows: List[Dict[str, Any]], max_lines: int = 12) -> str:
    if not rows:
        return "(Chưa có lịch sử hội thoại trong phiên này.)"

    rows = rows[: max_lines * 2]
    rows = list(reversed(rows))  # old -> new

    lines = []
    for r in rows:
        sender = (r.get("NguoiGui") or "").strip()
        ts = r.get("ThoiGianGui")
        msg = (r.get("NoiDung") or "").strip()
        if not msg:
            continue
        lines.append(f"{sender} ({ts}): {msg}")
        if len(lines) >= max_lines:
            break

    return _safe_join(lines, max_chars=5000)


def _kw(q: str, kws: List[str]) -> bool:
    q = (q or "").lower()
    return any(k in q for k in kws)


def _map_stats_by_key(rows: List[Dict[str, Any]], key: str) -> Dict[Any, Dict[str, Any]]:
    out: Dict[Any, Dict[str, Any]] = {}
    for r in rows or []:
        k = r.get(key)
        if k is None:
            continue
        out[k] = r
    return out


def _fmt_rating(stat: Optional[Dict[str, Any]]) -> str:
    if not stat:
        return "chưa có đánh giá"
    try:
        avg = float(stat.get("DiemTB")) if stat.get("DiemTB") is not None else None
    except Exception:
        avg = None
    cnt = int(stat.get("SoLuot") or 0)
    if avg is None or cnt == 0:
        return "chưa có đánh giá"
    return f"{avg:.1f}/5 ({cnt} lượt)"


def _format_room_types(room_types: List[Dict[str, Any]],
                       room_inventory: Dict[Any, int],
                       rating_by_type: Dict[Any, Dict[str, Any]]) -> str:
    if not room_types:
        return "(Không có dữ liệu loại phòng.)"
    lines = []
    for r in room_types:
        mid = r.get("MaLoaiPhong")
        total_rooms = room_inventory.get(mid)
        rating = _fmt_rating(rating_by_type.get(mid))
        total_txt = f", Tổng phòng: {total_rooms}" if total_rooms is not None else ""
        lines.append(
            f"- {r.get('TenLoaiPhong')}: Giá ngày {r.get('GiaNgay')} VND, Giá giờ {r.get('GiaGio')} VND, "
            f"Tối đa {r.get('SoNguoiToiDa')} người, Đánh giá: {rating}{total_txt}. "
            f"Mô tả: {r.get('MoTa')}"
        )
    return _safe_join(lines, max_chars=4500)


def _format_amenities(room_types: List[Dict[str, Any]],
                      amenities: Dict[Any, List[Dict[str, Any]]]) -> str:
    if not room_types:
        return "(Không có dữ liệu tiện nghi.)"
    lines = []
    for r in room_types:
        items = amenities.get(r.get("MaLoaiPhong"), []) or []
        if not items:
            continue
        tn = ", ".join([f"{a.get('TenTN')} (SL: {a.get('SL')})" for a in items if a.get("TenTN")])
        if tn:
            lines.append(f"- {r.get('TenLoaiPhong')}: {tn}")
    return _safe_join(lines, max_chars=3500)


def _format_available_rooms(available_rooms: List[Dict[str, Any]]) -> str:
    if not available_rooms:
        return "(Chưa có dữ liệu phòng trống cho khoảng thời gian này.)"
    grouped = defaultdict(list)
    for r in available_rooms:
        grouped[r.get("TenLoaiPhong")].append(r.get("SoPhong"))
    lines = []
    for t, nums in grouped.items():
        nums = [n for n in nums if n]
        preview = ", ".join(nums[:8])
        more = "..." if len(nums) > 8 else ""
        lines.append(f"- {t}: {len(nums)} phòng trống ({preview}{more})")
    return _safe_join(lines, max_chars=2500)


def _format_services(services: List[Dict[str, Any]],
                     rating_by_service: Dict[Any, Dict[str, Any]],
                     user_question: str) -> str:
    if not services:
        return "(Không có dữ liệu dịch vụ.)"

    q = (user_question or "").lower()
    focus_keys = []
    for k in [
        "spa", "massage", "giặt", "laundry", "ăn", "bữa sáng",
        "đưa đón", "sân bay", "gym", "hồ bơi", "tour",
        "thuê xe", "phòng họp", "meeting", "late", "check-out",
    ]:
        if k in q:
            focus_keys.append(k)

    def match(s: Dict[str, Any]) -> bool:
        if not focus_keys:
            return True
        text = f"{s.get('TenDV','')} {s.get('MoTa','')} {s.get('TenLoaiDV','')}".lower()
        return any(k in text for k in focus_keys)

    filtered = [s for s in services if match(s)]
    if not filtered:
        filtered = services

    grouped = defaultdict(list)
    for s in filtered[:40]:
        grouped[s.get("TenLoaiDV") or "Khác"].append(s)

    lines = []
    for cat, items in grouped.items():
        lines.append(f"[{cat}]")
        for it in items:
            rating = _fmt_rating(rating_by_service.get(it.get("MaDV")))
            lines.append(f"- {it.get('TenDV')}: {it.get('Gia')} VND — {rating} — {it.get('MoTa')}")
    return _safe_join(lines, max_chars=4500)


def _format_locations(locations: List[Dict[str, Any]]) -> str:
    if not locations:
        return "(Không có dữ liệu địa điểm xung quanh.)"
    lines = []
    for l in locations[:15]:
        lines.append(
            f"- {l.get('TenDD')} ({l.get('LoaiDD')}): {l.get('DiaChi')}, "
            f"Đánh giá: {l.get('DanhGia')}, Khoảng cách: {l.get('KhoangCach')}m"
        )
    return _safe_join(lines, max_chars=2500)


def ask_gemini(
    room_types,
    amenities,
    locations,
    available_rooms,
    services,
    room_inventory_rows,
    room_type_rating_rows,
    service_rating_rows,
    user_question,
    session_id,
    start_date=None,
    end_date=None,
):
    q_lower = (user_question or "").lower().strip()

    # Guard: tài khoản/mật khẩu -> từ chối ngay
    if _kw(q_lower, ["mật khẩu", "password", "tài khoản", "đăng nhập", "otp", "email đăng nhập"]):
        return (
            "Mình không thể hỗ trợ các thông tin liên quan tài khoản/mật khẩu. "
            "Bạn vui lòng liên hệ quầy lễ tân hoặc bộ phận hỗ trợ để được trợ giúp nhé."
        )

    # Lịch sử chat
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT NguoiGui, NoiDung, ThoiGianGui
        FROM LichSuChat
        WHERE MaPC = %s
        ORDER BY ThoiGianGui DESC
        LIMIT 20
        """,
        (session_id,),
    )
    history_rows = cursor.fetchall()
    conn.close()

    history_text = _format_history(history_rows, max_lines=12)

    room_inventory = {
        r["MaLoaiPhong"]: int(r.get("TongSoPhong") or 0)
        for r in (room_inventory_rows or [])
        if r.get("MaLoaiPhong") is not None
    }
    rating_by_type = _map_stats_by_key(room_type_rating_rows or [], "MaLoaiPhong")
    rating_by_service = _map_stats_by_key(service_rating_rows or [], "MaDV")

    want_rooms = _kw(q_lower, ["phòng", "loại phòng", "giá", "giá phòng", "đặt phòng", "trống", "available"])
    want_amenities = _kw(q_lower, ["tiện nghi", "có gì", "gồm", "wifi", "tv", "máy lạnh", "điều hòa"])
    want_services = _kw(q_lower, ["dịch vụ", "spa", "massage", "giặt", "bữa sáng", "đưa đón", "sân bay", "gym", "hồ bơi", "tour", "thuê xe", "phòng họp"])
    want_reviews = _kw(q_lower, ["đánh giá", "review", "sao", "tốt không", "feedback", "phản hồi"])
    want_nearby = _kw(q_lower, ["xung quanh", "gần đây", "địa điểm", "tham quan", "ăn uống", "quán", "cafe", "nhà hàng"])

    asking_availability = _kw(q_lower, ["phòng trống", "còn phòng", "đặt phòng", "available", "trống không"])
    missing_dates = asking_availability and (not start_date or not end_date)

    sections: List[str] = []
    sections.append(
        "Bạn là trợ lý ảo của khách sạn The Loyal Hotel.\n"
        "Bạn trả lời tự nhiên như chatbot online, thân thiện, rõ ràng.\n"
        "Quy tắc:\n"
        "1) Nếu câu hỏi liên quan khách sạn: chỉ dựa trên dữ liệu cung cấp; không bịa.\n"
        "2) Nếu câu hỏi ngoài phạm vi khách sạn: vẫn trả lời kiến thức chung ngắn gọn.\n"
        "3) Không tiết lộ dữ liệu nhạy cảm (tài khoản, mật khẩu, thông tin đăng nhập...).\n"
        "4) Khi thiếu thông tin để xác nhận (ví dụ thiếu ngày nhận/trả khi hỏi phòng trống), hãy hỏi lại.\n"
    )

    sections.append(f"Lịch sử hội thoại (gần nhất):\n{history_text}\n")

    if start_date and end_date:
        sections.append(f"Khoảng thời gian khách đang quan tâm: {start_date} → {end_date}\n")

    if want_rooms or want_reviews or not (want_services or want_nearby or want_amenities):
        sections.append(
            "Dữ liệu loại phòng (LoaiPhong) + đánh giá (DanhGiaLP) + tổng phòng (Phong):\n"
            + _format_room_types(room_types, room_inventory, rating_by_type)
            + "\n"
        )

    if want_amenities or _kw(q_lower, ["phòng", "loại phòng"]):
        sections.append(
            "Tiện nghi theo loại phòng (CT_TienNghi, TienNghi):\n"
            + _format_amenities(room_types, amenities)
            + "\n"
        )

    if want_rooms and (start_date and end_date):
        sections.append(
            "Phòng trống theo khoảng thời gian (Phong):\n"
            + _format_available_rooms(available_rooms)
            + "\n"
        )

    if want_services or _kw(q_lower, ["dịch vụ", "spa", "massage", "giặt", "bữa sáng"]):
        sections.append(
            "Dịch vụ (LoaiDV, DichVu) + đánh giá (DanhGiaDV):\n"
            + _format_services(services, rating_by_service, user_question)
            + "\n"
        )

    if want_nearby:
        sections.append("Địa điểm xung quanh:\n" + _format_locations(locations) + "\n")

    if missing_dates:
        sections.append(
            "Gợi ý quan trọng: Khách đang hỏi phòng trống/đặt phòng nhưng chưa cung cấp ngày nhận/trả.\n"
            "Hãy hỏi lại lịch sự: ngày nhận phòng và ngày trả phòng (vd: 2026-01-02 đến 2026-01-04).\n"
        )

    sections.append(f"Câu hỏi của khách: {user_question}\n")
    sections.append("Hãy trả lời ngắn gọn, đúng trọng tâm. Nếu cần hỏi lại, chỉ hỏi 1-2 câu rõ ràng.\n")

    prompt = "\n".join(sections)
    response = model.generate_content(prompt)
    return response.text
