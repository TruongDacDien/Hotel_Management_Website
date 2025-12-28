from flask import Flask, request, jsonify
from flask_cors import CORS
from db import (
    get_db_connection,
    get_available_room_types,
    get_room_amenities,
    get_nearby_locations,
    close_chat_session,
    get_available_rooms,
    get_services,
    get_room_inventory,
    get_room_type_rating_stats,
    get_service_rating_stats,
    cleanup_expired_sessions,
)
from chatbot import ask_gemini
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)


def get_mapc_max_len(cursor, fallback: int = 8) -> int:
    """
    Đọc độ dài cột PhienChat.MaPC để tạo/chuẩn hóa session_id đúng chuẩn -> tránh FK lỗi.
    """
    try:
        cursor.execute(
            """
            SELECT CHARACTER_MAXIMUM_LENGTH AS L
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'PhienChat'
              AND COLUMN_NAME = 'MaPC'
            """
        )
        row = cursor.fetchone()
        L = row.get("L") if row else None
        if L:
            return int(L)
    except Exception:
        pass
    return fallback


def new_session_id(n: int) -> str:
    """
    Tạo session id đúng độ dài n (an toàn cho CHAR/VARCHAR ngắn).
    """
    raw = uuid.uuid4().hex  # 32 chars
    if n <= len(raw):
        return raw[:n]
    # nếu n > 32 (hiếm), nối thêm uuid cho đủ
    while len(raw) < n:
        raw += uuid.uuid4().hex
    return raw[:n]


def normalize_session_id(s: str, n: int) -> str:
    if not s:
        return ""
    s = str(s).strip()
    return s[:n] if n > 0 else s


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json or {}
    question = data.get("message", "")
    customer_id = data.get("customer_id")
    temp_user_id = data.get("temp_user_id")
    session_id = data.get("session_id")

    if not question:
        return jsonify({"error": "Câu hỏi không được để trống."}), 400

    if not customer_id and not temp_user_id:
        temp_user_id = uuid.uuid4().hex[:8]

    cleanup_expired_sessions()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # đọc độ dài MaPC để chuẩn hóa session_id
        mapc_len = get_mapc_max_len(cursor, fallback=8)
        if session_id:
            session_id = normalize_session_id(session_id, mapc_len)

        conn.start_transaction()

        # Get or create chat session
        if not session_id:
            if temp_user_id:
                cursor.execute(
                    """
                    SELECT MaPC FROM PhienChat 
                    WHERE NguoiGuiTamThoi = %s AND TrangThai = 'Đang hoạt động'
                      AND (ThoiGianHetHan IS NULL OR ThoiGianHetHan > %s)
                    """,
                    (temp_user_id, datetime.now()),
                )
                session = cursor.fetchone()
                if not session:
                    session_id = new_session_id(mapc_len)
                    cursor.execute(
                        """
                        INSERT INTO PhienChat (MaPC, NguoiGuiTamThoi, ThoiGianBD, TrangThai)
                        VALUES (%s, %s, %s, 'Đang hoạt động')
                        """,
                        (session_id, temp_user_id, datetime.now()),
                    )
                else:
                    session_id = normalize_session_id(session.get("MaPC"), mapc_len)

            elif customer_id:
                cursor.execute(
                    """
                    SELECT MaPC FROM PhienChat 
                    WHERE MaTKKH = %s AND TrangThai = 'Đang hoạt động'
                      AND (ThoiGianHetHan IS NULL OR ThoiGianHetHan > %s)
                    """,
                    (customer_id, datetime.now()),
                )
                session = cursor.fetchone()
                if not session:
                    session_id = new_session_id(mapc_len)
                    cursor.execute(
                        """
                        INSERT INTO PhienChat (MaPC, MaTKKH, ThoiGianBD, TrangThai)
                        VALUES (%s, %s, %s, 'Đang hoạt động')
                        """,
                        (session_id, customer_id, datetime.now()),
                    )
                else:
                    session_id = normalize_session_id(session.get("MaPC"), mapc_len)
        else:
            # Validate session_id exists
            cursor.execute(
                """
                SELECT MaPC FROM PhienChat 
                WHERE MaPC = %s AND TrangThai = 'Đang hoạt động'
                  AND (ThoiGianHetHan IS NULL OR ThoiGianHetHan > %s)
                """,
                (session_id, datetime.now()),
            )
            if not cursor.fetchone():
                # session_id client gửi lên không hợp lệ/đã hết hạn -> tạo session mới thay vì để FK fail
                session_id = new_session_id(mapc_len)
                if temp_user_id:
                    cursor.execute(
                        """
                        INSERT INTO PhienChat (MaPC, NguoiGuiTamThoi, ThoiGianBD, TrangThai)
                        VALUES (%s, %s, %s, 'Đang hoạt động')
                        """,
                        (session_id, temp_user_id, datetime.now()),
                    )
                elif customer_id:
                    cursor.execute(
                        """
                        INSERT INTO PhienChat (MaPC, MaTKKH, ThoiGianBD, TrangThai)
                        VALUES (%s, %s, %s, 'Đang hoạt động')
                        """,
                        (session_id, customer_id, datetime.now()),
                    )

        # Optional dates
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        # Load hotel data
        room_types = get_available_room_types(start_date, end_date, conn, cursor)
        available_rooms = get_available_rooms(start_date, end_date, conn, cursor)

        amenities = {
            rt["MaLoaiPhong"]: get_room_amenities(rt["MaLoaiPhong"], conn, cursor)
            for rt in room_types
        }

        locations = get_nearby_locations(conn, cursor)

        # Extra tables you requested
        services = get_services(conn=conn, cursor=cursor)
        room_inventory_rows = get_room_inventory(conn=conn, cursor=cursor)
        room_type_rating_rows = get_room_type_rating_stats(conn=conn, cursor=cursor)
        service_rating_rows = get_service_rating_stats(conn=conn, cursor=cursor)

        # Ask Gemini
        answer = ask_gemini(
            room_types=room_types,
            amenities=amenities,
            locations=locations,
            available_rooms=available_rooms,
            services=services,
            room_inventory_rows=room_inventory_rows,
            room_type_rating_rows=room_type_rating_rows,
            service_rating_rows=service_rating_rows,
            user_question=question,
            session_id=session_id,
            start_date=start_date,
            end_date=end_date,
        )

        sender = customer_id if customer_id else temp_user_id

        # Save customer message (FK safe because session_id is normalized & exists)
        cursor.execute(
            """
            INSERT INTO LichSuChat (MaPC, NguoiGui, NoiDung, ThoiGianGui)
            VALUES (%s, %s, %s, %s)
            """,
            (session_id, sender, question, datetime.now()),
        )
        cursor.execute("SELECT LAST_INSERT_ID() as MaLSC")
        ma_lsc = cursor.fetchone()["MaLSC"]

        # Save bot message linked to previous
        cursor.execute(
            """
            INSERT INTO LichSuChat (MaPC, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo)
            VALUES (%s, 'Bot', %s, %s, %s)
            """,
            (session_id, answer, datetime.now(), ma_lsc),
        )

        conn.commit()
        return jsonify({"reply": answer, "session_id": session_id, "temp_user_id": temp_user_id})

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/close_session", methods=["POST"])
def close_session():
    data = request.json or {}
    session_id = data.get("session_id")
    if not session_id:
        return jsonify({"error": "Session ID is required."}), 400

    # vẫn đóng như cũ
    close_chat_session(session_id)
    return jsonify({"message": "Chat session closed successfully."})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
