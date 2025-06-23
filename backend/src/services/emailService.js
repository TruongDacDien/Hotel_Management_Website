import CustomerService from "./customerService.js";
import transporter from "../config/email.js";
import CustomerAccountService from "./customerAccountService.js";
import RoomTypeService from "./roomTypeService.js";
import ServiceService from "./serviceService.js";
import RoomService from "./roomService.js";
import BookingService from "./bookingService.js";

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

  static sendBookingConfirmationByData = async (bookingData) => {
    // Validate
    if (
      !bookingData.fullName ||
      !bookingData.email ||
      !bookingData.phone ||
      (bookingData.roomRequests.length === 0 && bookingData.serviceRequests.length === 0)
    ) {
      throw new Error("Thiếu thông tin khách hàng hoặc yêu cầu đặt phòng/dịch vụ.");
    }

    const result = await BookingService.customerOrder(bookingData);

    const emailSent = await EmailService.sendEmailWithHTMLTemplate(
      bookingData.email,
      "Xác nhận đặt phòng và dịch vụ - The Royal Hotel",
      { ...bookingData, ...result }
    );

    if (!emailSent) {
      throw new Error("Gửi email xác nhận thất bại.");
    }

    return result;
  };

  static sendEmailWithHTMLTemplate = async (to, subject, bookingData) => {
    try {
      // Lấy thông tin loại phòng và dịch vụ để làm giàu dữ liệu
      const roomTypePromises = (bookingData.roomResults || []).map(async (result) => {
        if (result.roomTypeId) {
          const roomType = await RoomTypeService.getById(result.roomTypeId);
          return {
            ...result,
            TenLoaiPhong: roomType?.TenLoaiPhong || "Unknown",
          };
        }
        return result;
      });

      const servicePromises = (bookingData.serviceResults || []).map(async (result) => {
        if (result.serviceId) {
          const service = await ServiceService.getServiceById(result.serviceId);
          return {
            ...result,
            TenDV: service?.TenDV || "Unknown",
            Gia: service?.Gia || 0,
          };
        }
        return result;
      });

      const enrichedRoomResults = await Promise.all(roomTypePromises);
      const enrichedServiceResults = await Promise.all(servicePromises);

      // Tính tổng tiền
      const totalRoomMoney = (enrichedRoomResults || []).reduce((sum, result) => {
        return (
          sum +
          result.bookings.reduce((roomSum, booking) => {
            return roomSum + (parseFloat(booking.bookingDetail?.TienPhong) || 0);
          }, 0)
        );
      }, 0);

      const totalRoomTax = (totalRoomMoney * 10) / 100;

      const totalServiceMoney = (enrichedServiceResults || []).reduce((sum, result) => {
        return sum + (result.totalMoney || 0);
      }, 0);

      const totalServiceTax = (totalServiceMoney * 10) / 100;

      const totalMoney = totalRoomMoney + totalRoomTax + totalServiceMoney + totalServiceTax;

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
                <th>Mã phiếu thuê</th>
                <th>Loại phòng</th>
                <th>Phòng</th>
                <th>Ngày nhận phòng</th>
                <th>Ngày trả phòng</th>
                <th>Giá ngày (VND)</th>
                <th>Thành tiền (VND)</th>
              </tr>
              ${enrichedRoomResults
            .map((result) =>
              result.bookings
                .map(
                  (booking) => `
                      <tr>
                        <td>${booking.bookingDetail?.MaPhieuThue || "N/A"}</td>
                        <td>${result.TenLoaiPhong || "N/A"}</td>
                        <td>${booking.bookingDetail?.SoPhong || "N/A"}</td>
                        <td>${booking.bookingDetail?.NgayBD ? new Date(booking.bookingDetail?.NgayBD).toLocaleDateString("vi-VN") : "N/A"}</td>
                        <td>${booking.bookingDetail?.NgayKT ? new Date(booking.bookingDetail?.NgayKT).toLocaleDateString("vi-VN") : "N/A"}</td>
                        <td>${parseFloat(booking.bookingDetail?.GiaNgay || 0).toLocaleString("vi-VN")}</td>
                        <td>${parseFloat(booking.bookingDetail?.TienPhong || 0).toLocaleString("vi-VN")}</td>
                      </tr>
                    `
                )
                .join("")
            )
            .join("")}
              ${enrichedRoomResults.some((result) => result.failedRooms > 0)
            ? `<tr><td colspan="7" class="failed">${enrichedRoomResults.find((result) => result.failedRooms > 0).message
            }</td></tr>`
            : ""}
            <tr style="background-color: #6b3fa4; color: white">
              <td colspan="6">THUẾ VAT (VND): 10%</td>
              <td>${totalRoomTax.toLocaleString("vi-VN")}</td>
            </tr>
            <tr style="background-color: #6b3fa4; color: white">
              <td colspan="6">TỔNG TIỀN THUÊ PHÒNG (VND)</td>
              <td>${(totalRoomMoney + totalRoomTax).toLocaleString("vi-VN")}</td>
            </tr>
            </table>
            `
          : "<p>Không có đặt phòng nào.</p>"
        }

          <h2>Chi tiết đặt dịch vụ</h2>
          ${enrichedServiceResults.length > 0
          ? `
            <table>
              <tr>
                <th>Mã đặt dịch vụ</th>
                <th>Dịch vụ</th>
                <th>Ngày áp dụng</th>
                <th>Số lượng</th>
                <th>Đơn giá (VND)</th>   
                <th>Thành tiền (VND)</th>
              </tr>
              ${enrichedServiceResults
            .map(
              (result) => `
                    <tr>
                      <td>${result.services && Array.isArray(result.services) ? result.services.map(s => s.MaCTSDDV).join(", ") : "N/A"}</td>
                      <td>${result.TenDV || "N/A"}</td>
                      <td>${result.offeredDate ? new Date(result.offeredDate).toLocaleDateString("vi-VN") : "N/A"}</td>
                      <td>${result.bookedServices}</td>
                      <td>${parseFloat(result.Gia || 0).toLocaleString("vi-VN")}</td>
                      <td>${(result.totalMoney || 0).toLocaleString("vi-VN")}</td>
                    </tr>
                    ${result.failedServices > 0 ? `<tr><td colspan="6" class="failed">${result.message}</td></tr>` : ""}
                  `
            )
            .join("")}
            <tr style="background-color: #6b3fa4; color: white">
              <td colspan="5">THUẾ VAT (VND): 10%</td>
              <td>${totalServiceTax.toLocaleString("vi-VN")}</td>
            </tr>
            <tr style="background-color: #6b3fa4; color: white">
              <td colspan="5">TỔNG TIỀN DỊCH VỤ (VND)</td>
              <td>${(totalServiceMoney + totalServiceTax).toLocaleString("vi-VN")}</td>
            </tr>
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

  static sendCancelBookingEmailWithHTMLTemplate = async (subject, customerData, bookingDetail) => {
    try {
      const room = await RoomService.getById(bookingDetail.SoPhong);
      const roomType = await RoomTypeService.getById(room.MaLoaiPhong);
      // Tính tiền và thuế dựa trên hình thức thanh toán và trạng thái thanh toán
      let refundAmount = 0;
      let vatAmount = 0;

      if (bookingDetail.HinhThucThanhToan === "Online" && bookingDetail.DaThanhToan === 1) {
        refundAmount = bookingDetail.TienPhong * 1.1;
        vatAmount = bookingDetail.TienPhong * 0.1;
      }
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

          <h1 class="purple-text">XÁC NHẬN HỦY ĐẶT PHÒNG</h1>

          <h2>Thông tin khách hàng</h2>
          <table>
            <tr><th>Họ tên</th><td>${customerData.fullname}</td></tr>
            <tr><th>Email</th><td>${customerData.email}</td></tr>
            <tr><th>Số điện thoại</th><td>${customerData.phone}</td></tr>
          </table>

          <h2>Chi tiết hủy đặt phòng</h2>
          
          <table>
            <tr>
              <th>Mã phiếu thuê</th>
              <th>Loại phòng</th>
              <th>Phòng</th>
              <th>Ngày nhận phòng</th>
              <th>Ngày trả phòng</th>
              <th>Giá ngày (VND)</th>
              <th>Thành tiền (VND)</th>
            </tr>

            <tr>
              <td>${bookingDetail.MaPhieuThue || "N/A"}</td>
              <td>${roomType.TenLoaiPhong || "N/A"}</td>
              <td>${bookingDetail.SoPhong || "N/A"}</td>
              <td>${bookingDetail.NgayBD ? new Date(bookingDetail.NgayBD).toLocaleDateString("vi-VN") : "N/A"}</td>
              <td>${bookingDetail.NgayKT ? new Date(bookingDetail.NgayKT).toLocaleDateString("vi-VN") : "N/A"}</td>
              <td>${parseFloat(roomType.GiaNgay || 0).toLocaleString("vi-VN")}</td>
              <td>${parseFloat(bookingDetail.TienPhong || 0).toLocaleString("vi-VN")}</td>
            </tr>
                   
            <tr style="background-color: #6b3fa4; color: white">
              <td colspan="6">THUẾ VAT (VND): 10%</td>
              <td>${(vatAmount).toLocaleString("vi-VN")}</td>
            </tr>
            <tr style="background-color: #6b3fa4; color: white">
              <td colspan="6">TỔNG TIỀN HOÀN THUÊ PHÒNG (VND)</td>
              <td>${(refundAmount).toLocaleString("vi-VN")}</td>
            </tr>
          </table>

          <p>
            Cảm ơn Quý khách đã sử dụng dịch vụ tại The Royal Hotel. Chúc Quý khách một kỳ nghỉ vui vẻ!
          </p>
        </body>
      </html>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerData.email,
        subject: subject,
        html: htmlTemplate,
      });

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };

  static sendCancelServiceEmailWithHTMLTemplate = async (subject, customerData, serviceDetail) => {
    try {
      const service = await ServiceService.getServiceById(serviceDetail.MaDV);
      // Tính tiền và thuế dựa trên hình thức thanh toán và trạng thái thanh toán
      let refundAmount = 0;
      let vatAmount = 0;

      if (serviceDetail.HinhThucThanhToan === "Online" && serviceDetail.DaThanhToan === 1) {
        refundAmount = serviceDetail.ThanhTien * 1.1;
        vatAmount = serviceDetail.ThanhTien * 0.1;
      }
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

        <h1 class="purple-text">XÁC NHẬN HỦY ĐẶT DỊCH VỤ</h1>

        <h2>Thông tin khách hàng</h2>
        <table>
          <tr><th>Họ tên</th><td>${customerData.fullname}</td></tr>
          <tr><th>Email</th><td>${customerData.email}</td></tr>
          <tr><th>Số điện thoại</th><td>${customerData.phone}</td></tr>
        </table>

        <h2>Chi tiết hủy đặt dịch vụ</h2>

        <table>
          <tr>
            <th>Mã đặt dịch vụ</th>
            <th>Dịch vụ</th>
            <th>Ngày áp dụng</th>
            <th>Số lượng</th>
            <th>Đơn giá (VND)</th>   
            <th>Thành tiền (VND)</th>
          </tr> 

          <tr>
            <td>${serviceDetail.MaCTSDDV || "N/A"}</td>
            <td>${service.TenDV || "N/A"}</td>
            <td>${serviceDetail.NgayApDung ? new Date(serviceDetail.NgayApDung).toLocaleDateString("vi-VN") : "N/A"}</td>
            <td>${serviceDetail.SL || "N/A"}</td>
            <td>${parseFloat(service.Gia || 0).toLocaleString("vi-VN")}</td>
            <td>${(serviceDetail.ThanhTien || 0).toLocaleString("vi-VN")}</td>
          </tr> 

          <tr style="background-color: #6b3fa4; color: white">
            <td colspan="5">THUẾ VAT (VND): 10%</td>
            <td>${(vatAmount).toLocaleString("vi-VN")}</td>
          </tr>
          <tr style="background-color: #6b3fa4; color: white">
            <td colspan="5">TỔNG TIỀN HOÀN DỊCH VỤ (VND)</td>
            <td>${(refundAmount).toLocaleString("vi-VN")}</td>
          </tr>
        </table>

        <p>
          Cảm ơn Quý khách đã sử dụng dịch vụ tại The Royal Hotel. Chúc Quý khách một kỳ nghỉ vui vẻ!
        </p>
      </body>
    </html>
    `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerData.email,
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