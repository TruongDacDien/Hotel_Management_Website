import mysql.connector
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import uuid

load_dotenv()


def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )

def get_available_room_types(start_date=None, end_date=None, conn=None, cursor=None):
    if conn is None or cursor is None:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        close_conn = True
    else:
        close_conn = False

    query = """
    SELECT lp.MaLoaiPhong, lp.TenLoaiPhong, lp.GiaNgay, lp.GiaGio, lp.SoNguoiToiDa, lp.MoTa
    FROM LoaiPhong lp
    WHERE lp.IsDeleted = 0
    """

    if start_date and end_date:
        query += """
        AND lp.MaLoaiPhong IN (
            SELECT p.MaLoaiPhong
            FROM Phong p
            WHERE p.IsDeleted = 0
            AND p.SoPhong NOT IN (
                SELECT ct.SoPhong
                FROM CT_PhieuThue ct
                WHERE ct.NgayBD < %s AND ct.NgayKT > %s
                AND ct.TinhTrangThue IN ('Phòng đang thuê', 'Phòng đã đặt')
            )
        )
        """
        cursor.execute(query, (end_date, start_date))
    else:
        cursor.execute(query)

    room_types = cursor.fetchall()
    if close_conn:
        conn.close()
    return room_types

def get_available_rooms(start_date, end_date, conn=None, cursor=None):
    if conn is None or cursor is None:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        close_conn = True
    else:
        close_conn = False

    query = """
    SELECT p.SoPhong, p.MaLoaiPhong, lp.TenLoaiPhong, lp.GiaNgay, lp.GiaGio, lp.SoNguoiToiDa, lp.MoTa
    FROM Phong p
    JOIN LoaiPhong lp ON p.MaLoaiPhong = lp.MaLoaiPhong
    WHERE p.IsDeleted = 0 AND lp.IsDeleted = 0
    AND p.SoPhong NOT IN (
        SELECT ct.SoPhong
        FROM CT_PhieuThue ct
        WHERE ct.NgayBD < %s AND ct.NgayKT > %s
        AND ct.TinhTrangThue IN ('Phòng đang thuê', 'Phòng đã đặt')
    )
    ORDER BY lp.MaLoaiPhong, p.SoPhong
    """
    cursor.execute(query, (end_date, start_date))
    available_rooms = cursor.fetchall()

    if close_conn:
        conn.close()
    return available_rooms


def get_room_amenities(room_type_id, conn=None, cursor=None):
    if conn is None or cursor is None:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        close_conn = True
    else:
        close_conn = False

    query = """
    SELECT tn.TenTN, cttn.SL
    FROM CT_TienNghi cttn
    JOIN TienNghi tn ON cttn.MaTN = tn.MaTN
    WHERE cttn.MaLoaiPhong = %s
    """
    cursor.execute(query, (room_type_id,))
    amenities = cursor.fetchall()
    if close_conn:
        conn.close()
    return amenities


def get_nearby_locations(conn=None, cursor=None):
    if conn is None or cursor is None:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        close_conn = True
    else:
        close_conn = False

    query = """
    SELECT TenDD, LoaiDD, DiaChi, DanhGia, KhoangCach, ThoiGianDiChuyen
    FROM DiaDiemXungQuanh
    WHERE MaCN = 1 AND ThoiGianCapNhat <= %s
    """
    cursor.execute(query, (datetime.now(),))
    locations = cursor.fetchall()
    if close_conn:
        conn.close()
    return locations


def close_chat_session(session_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    expiry_time = datetime.now() + timedelta(hours=1)
    cursor.execute(
        """
        UPDATE PhienChat 
        SET TrangThai = 'Đã kết thúc', ThoiGianKT = %s, ThoiGianHetHan = %s
        WHERE MaPC = %s
        """,
        (datetime.now(), expiry_time, session_id),
    )
    conn.commit()
    conn.close()


def cleanup_expired_sessions():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM LichSuChat 
        WHERE MaPC IN (
            SELECT MaPC FROM PhienChat 
            WHERE ThoiGianHetHan < %s 
            AND TrangThai = 'Đã kết thúc'
            AND NguoiGuiTamThoi IS NOT NULL
        )
        """,
        (datetime.now(),),
    )

    cursor.execute(
        """
        DELETE FROM PhienChat 
        WHERE ThoiGianHetHan < %s 
        AND TrangThai = 'Đã kết thúc'
        AND NguoiGuiTamThoi IS NOT NULL
        """,
        (datetime.now(),),
    )

    conn.commit()
    conn.close()
