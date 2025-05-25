import CustomerService from "./customerService.js";
import transporter from "../config/email.js";
import CustomerAccountService from "./customerAccountService.js";
import RoomTypeService from "./roomTypeService.js";
import ServiceService from "./serviceService.js";

class EmailService {
  static sendEmail = async (to, subject, html) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html
      });
      console.log("Email sent successfully!");
      return true;
    } catch (error) {
      console.error("Error sending email:", error.message);
      return false;
    }
  };

  static storeConfirmCode = async (email, verification) => {
    const expirationTime = new Date(Date.now() + 3 * 60 * 1000); // 3 phút từ thời điểm gửi mã
    return await CustomerAccountService.findByEmailAndUpdateVerificationCode(email, verification, expirationTime);
  };

  static sendEmailWithHTMLTemplate = async (to, subject, bookingData) => {
    try {
      // Lấy thông tin loại phòng và dịch vụ để hiển thị tên
      const roomTypePromises = bookingData.roomResults.map(async (result) => {
        if (result.roomTypeId) {
          const roomType = await RoomTypeService.getById(result.roomTypeId);
          return { ...result, TenLoaiPhong: roomType?.TenLoaiPhong || "Unknown" };
        }
        return result;
      });

      const servicePromises = bookingData.serviceResults.map(async (result) => {
        if (result.serviceId) {
          const service = await ServiceService.getById(result.serviceId);
          return { ...result, TenDV: service?.TenDV || "Unknown", Gia: service?.Gia || 0 };
        }
        return result;
      });

      const enrichedRoomResults = await Promise.all(roomTypePromises);
      const enrichedServiceResults = await Promise.all(servicePromises);

      // Tính tổng tiền
      const totalRoomMoney = enrichedRoomResults.reduce((sum, result) => {
        return (
          sum +
          result.bookings.reduce((roomSum, booking) => {
            return roomSum + (booking.TienPhong || 0);
          }, 0)
        );
      }, 0);

      const totalServiceMoney = enrichedServiceResults.reduce((sum, result) => {
        return sum + (result.totalMoney || 0);
      }, 0);

      const totalMoney = totalRoomMoney + totalServiceMoney;

      // Tạo template HTML
      const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>The Royal Hotel</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #6b3fa4; color: white; }
            .purple-text { color: #6b3fa4; }
            h1, h2 { color: #333; }
            .failed { color: red; }
          </style>
        </head>
        <body>
          <div>
            <h1>THE ROYAL HOTEL</h1>
            <p>The Royal Hotel Hồ Chí Minh</p>
            <p>11 Đ. Sư Vạn Hạnh, Phường 12, Quận 10, Hồ Chí Minh</p>
          </div>

          <h1 class="purple-text">XÁC NHẬN ĐẶT PHÒNG VÀ DỊCH VỤ</h1>

          <h2>Thông tin khách hàng</h2>
          <table>
            <tr><th>Họ tên</th><td>${bookingData.fullName}</td></tr>
            <tr><th>Email</th><td>${to}</td></tr>
            <tr><th>Số điện thoại</th><td>${bookingData.phone}</td></tr>
          </table>

          <h2>Chi tiết đặt phòng</h2>
          ${enrichedRoomResults.length > 0
          ? `
          <table>
            <tr>
              <th>Loại phòng</th>
              <th>Số phòng</th>
              <th>Ngày nhận phòng</th>
              <th>Ngày trả phòng</th>
              <th>Thành tiền (VND)</th>
              <th>Trạng thái</th>
            </tr>
            ${enrichedRoomResults
            .map(
              (result) => `
                <tr>
                  <td>${result.TenLoaiPhong || "Không xác định"}</td>
                  <td>${result.bookedRooms} / ${result.requestedRooms}</td>
                  <td>${result.startDay || "N/A"}</td>
                  <td>${result.endDay || "N/A"}</td>
                  <td>${result.bookings.reduce((sum, booking) => sum + (booking.TienPhong || 0), 0).toLocaleString("vi-VN")
                }</td>
                  <td>${result.bookedRooms > 0 ? "Thành công" : `<span class="failed">Thất bại</span>`}</td>
                </tr>
                ${result.failedRooms > 0 ? `<tr><td colspan="6" class="failed">${result.message}</td></tr>` : ""}
              `
            )
            .join("")}
          </table>
          `
          : "<p>Không có đặt phòng nào.</p>"
        }

          <h2>Chi tiết đặt dịch vụ</h2>
          ${enrichedServiceResults.length > 0
          ? `
          <table>
            <tr>
              <th>Dịch vụ</th>
              <th>Số lượng</th>
              <th>Ngày áp dụng</th>
              <th>Thành tiền (VND)</th>
              <th>Trạng thái</th>
            </tr>
            ${enrichedServiceResults
            .map(
              (result) => `
                <tr>
                  <td>${result.TenDV || "Không xác định"}</td>
                  <td>${result.bookedServices} / ${result.requestedServices}</td>
                  <td>${result.offeredDate || "N/A"}</td>
                  <td>${(result.totalMoney || 0).toLocaleString("vi-VN")}</td>
                  <td>${result.bookedServices > 0 ? "Thành công" : `<span class="failed">Thất bại</span>`}</td>
                </tr>
                ${result.failedServices > 0 ? `<tr><td colspan="5" class="failed">${result.message}</td></tr>` : ""}
              `
            )
            .join("")}
          </table>
          `
          : "<p>Không có đặt dịch vụ nào.</p>"
        }

          <h2>Tổng tiền: ${totalMoney.toLocaleString("vi-VN")} VND</h2>

          <p>
            Cảm ơn Quý khách đã đặt phòng tại The Royal Hotel. Chúc Quý khách một kỳ nghỉ vui vẻ!
          </p>
        </body>
      </html>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlTemplate,
      });

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };
}

export default EmailService;