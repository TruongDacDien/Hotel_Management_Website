import google.generativeai as genai
import os
from dotenv import load_dotenv
from db import get_db_connection

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")


def ask_gemini(room_types, amenities, locations, user_question, session_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Lấy tin nhắn mới nhất từ khách hàng (NguoiGui khác "Bot") trong phiên chat
    cursor.execute(
        """
        SELECT NguoiGui, NoiDung, ThoiGianGui
        FROM LichSuChat
        WHERE MaPC = %s AND NguoiGui != 'Bot'
        ORDER BY ThoiGianGui DESC
        LIMIT 1
        """,
        (session_id,),
    )
    last_user_message = cursor.fetchone()
    conn.close()

    # Format tin nhắn cuối cùng của khách hàng, xử lý trường hợp không có tin nhắn
    history_text = (
        f"{last_user_message['NguoiGui']} ({last_user_message['ThoiGianGui']}): {last_user_message['NoiDung']}"
        if last_user_message
        else "Không có tin nhắn nào từ khách hàng."
    )

    # Format dữ liệu phòng và địa điểm
    rooms_text = "\n".join(
        [
            f"- {r['TenLoaiPhong']}: {r['MoTa']}, Giá ngày: {r['GiaNgay']} VND, Giá giờ: {r['GiaGio']} VND, Số người tối đa: {r['SoNguoiToiDa']}"
            for r in room_types
        ]
    )
    amenities_text = "\n".join(
        [
            f"- Phòng {r['TenLoaiPhong']}: "
            + ", ".join(
                [
                    f"{a['TenTN']} (Số lượng: {a['SL']})"
                    for a in amenities.get(r["MaLoaiPhong"], [])
                ]
            )
            for r in room_types
        ]
    )
    locations_text = "\n".join(
        [
            f"- {l['TenDD']} ({l['LoaiDD']}): {l['DiaChi']}, Đánh giá: {l['DanhGia']}, Khoảng cách: {l['KhoangCach']}m, Thời gian di chuyển: {l['ThoiGianDiChuyen']}"
            for l in locations
        ]
    )

    # Tạo prompt với tin nhắn cuối cùng của khách hàng
    prompt = f"""
Tin nhắn gần nhất của khách hàng:
{history_text}

Dữ liệu các loại phòng khách sạn:
{rooms_text}

Tiện nghi của các loại phòng:
{amenities_text}

Các địa điểm du lịch xung quanh:
{locations_text}

Câu hỏi khách hàng: "{user_question}"

Vui lòng trả lời một cách thân thiện, rõ ràng và chính xác dựa vào thông tin trên, bao gồm cả ngữ cảnh từ tin nhắn gần nhất của khách hàng (không cần trích dẫn lại và chỉ tập trung câu hỏi hiện tại). Nếu câu hỏi liên quan đến phòng trống trong khoảng thời gian cụ thể, hãy trả lời dựa trên dữ liệu phòng trống. Nếu không có thông tin phù hợp, hãy trả lời lịch sự rằng không có thông tin.
"""
    response = model.generate_content(prompt)
    return response.text
