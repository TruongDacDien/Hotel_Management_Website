from flask import Flask, request, jsonify
from flask_cors import CORS
from db import (
    get_db_connection,
    get_available_room_types,
    get_room_amenities,
    get_nearby_locations,
    close_chat_session,
    get_available_rooms
)
from db import cleanup_expired_sessions
from chatbot import ask_gemini
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("message", "")
    customer_id = data.get("customer_id")  # Optional: for registered users
    temp_user_id = data.get("temp_user_id")  # Optional: for temporary users
    session_id = data.get("session_id")  # Thêm để tiếp tục phiên chat

    if not question:
        return jsonify({"error": "Câu hỏi không được để trống."}), 400

    # Generate temp_user_id if not provided and not a registered user
    if not customer_id and not temp_user_id:
        temp_user_id = str(uuid.uuid4())[:8]

    # Clean up expired sessions
    cleanup_expired_sessions()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)  # Sử dụng dictionary để nhất quán

    try:
        # Bắt đầu transaction
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
                    session_id = str(uuid.uuid4())
                    cursor.execute(
                        """
                        INSERT INTO PhienChat (MaPC, NguoiGuiTamThoi, ThoiGianBD, TrangThai)
                        VALUES (%s, %s, %s, 'Đang hoạt động')
                        """,
                        (session_id, temp_user_id, datetime.now()),
                    )
                else:
                    session_id = session.get("MaPC")
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
                    session_id = str(uuid.uuid4())[:8]
                    cursor.execute(
                        """
                        INSERT INTO PhienChat (MaPC, MaTKKH, ThoiGianBD, TrangThai)
                        VALUES (%s, %s, %s, 'Đang hoạt động')
                        """,
                        (session_id, customer_id, datetime.now()),
                    )
                else:
                    session_id = session.get("MaPC")
        else:
            # Kiểm tra xem session_id có hợp lệ không
            cursor.execute(
                """
                SELECT MaPC FROM PhienChat 
                WHERE MaPC = %s AND TrangThai = 'Đang hoạt động'
                AND (ThoiGianHetHan IS NULL OR ThoiGianHetHan > %s)
                """,
                (session_id, datetime.now()),
            )
            if not cursor.fetchone():
                raise ValueError("Phiên chat không hợp lệ hoặc đã kết thúc.")

        # Get room types and related data
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        room_types = get_available_room_types(start_date, end_date, conn, cursor)
        available_rooms = get_available_rooms(start_date, end_date, conn, cursor)
        amenities = {
            rt["MaLoaiPhong"]: get_room_amenities(rt["MaLoaiPhong"], conn, cursor)
            for rt in room_types
        }
        locations = get_nearby_locations(conn, cursor)

        # Get response from Gemini with session context
        answer = ask_gemini(room_types, amenities, locations, available_rooms, question, session_id)

        # Save chat message
        sender = customer_id if customer_id else temp_user_id

        # Lưu tin nhắn của khách hàng và lấy MaLSC vừa tạo
        cursor.execute(
            """
            INSERT INTO LichSuChat (MaPC, NguoiGui, NoiDung, ThoiGianGui)
            VALUES (%s, %s, %s, %s)
            """,
            (session_id, sender, question, datetime.now()),
        )
        # Lấy MaLSC của tin nhắn khách hàng vừa chèn
        cursor.execute("SELECT LAST_INSERT_ID() as MaLSC")
        ma_lsc = cursor.fetchone()["MaLSC"]

        # Lưu tin nhắn của Bot với MaLSTruocDo tham chiếu đến MaLSC của tin nhắn khách hàng
        cursor.execute(
            """
            INSERT INTO LichSuChat (MaPC, NguoiGui, NoiDung, ThoiGianGui, MaLSTruocDo)
            VALUES (%s, 'Bot', %s, %s, %s)
            """,
            (session_id, answer, datetime.now(), ma_lsc),
        )

        # Commit transaction
        conn.commit()

        return jsonify(
            {"reply": answer, "session_id": session_id, "temp_user_id": temp_user_id}
        )

    except Exception as e:
        # Rollback transaction nếu có lỗi
        conn.rollback()
        return jsonify({"error": f"Lỗi trong quá trình xử lý: {str(e)}"}), 500
    finally:
        conn.close()


@app.route("/close_session", methods=["POST"])
def close_session():
    data = request.json
    session_id = data.get("session_id")

    if not session_id:
        return jsonify({"error": "Session ID is required."}), 400

    close_chat_session(session_id)
    return jsonify({"message": "Chat session closed successfully."})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
