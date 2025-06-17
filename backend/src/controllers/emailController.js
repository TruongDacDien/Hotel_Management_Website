import expressAsyncHandler from "express-async-handler";
import EmailService from "../services/emailService.js";
import CustomerAccountService from "../services/customerAccountService.js";
import BookingService from "../services/bookingService.js";
import bcrypt from "bcrypt";

class EmailController {
  sendConfirmCode = expressAsyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await CustomerAccountService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        success: false,
      });
    }

    const randomVerificationCode = () => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }
      return code;
    };

    const verificationCode = randomVerificationCode();
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>The confirmation code is only valid for 3 minutes.</p>
      </body>
      </html>
      `;

    await EmailService.sendEmail(email, "Verification Code", content);
    await EmailService.storeConfirmCode(email, verificationCode);

    return res.status(200).json({
      msg: "Verification code sent successfully!",
      success: true,
    });
  });

  sendResetPassword = expressAsyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Tìm user theo email
    const user = await CustomerAccountService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        success: false,
      });
    }

    // Hàm tạo mật khẩu ngẫu nhiên
    const generateRandomPassword = () => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      return password;
    };

    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Cập nhật mật khẩu mới
    const update = await CustomerAccountService.findByIdAndUpdatePassword(
      user.MaTKKH,
      hashedPassword
    );

    // Gửi email reset password
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <p>Your new password is: ${newPassword}</strong></p>
        <p>Please log in and change your password to protect your account.</p>
      </body>
      </html>
      `;
    await EmailService.sendEmail(email, "Reset Password", content);

    return res.status(200).json({
      msg: "Password reset successfully. Please check your email for the new password.",
      success: true,
    });
  });

  checkConfirmCode = expressAsyncHandler(async (req, res, next) => {
    const { email, verificationCode } = req.body;

    const user = await CustomerAccountService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        msg: "User not found!",
        success: false,
      });
    }

    if (
      user.MaXacNhan !== verificationCode ||
      user.ThoiGianHetHan < new Date()
    ) {
      return res.status(404).json({
        msg: "Invalid verification code!",
        success: false,
      });
    }

    return res.status(200).json({
      msg: "Confirmed successfully!",
      success: true,
    });
  });

  sendBookingConfirmation = expressAsyncHandler(async (req, res) => {
    const bookingData = {
      ...req.body,
      roomRequests: req.body.roomRequests || [],
      serviceRequests: req.body.serviceRequests || [],
    };

    const result = await EmailService.sendBookingConfirmationByData(bookingData);
    return res.status(200).json({
      success: true,
      msg: "Đặt phòng và dịch vụ thành công - Email xác nhận đã được gửi.",
      data: result,
    });
  });
}

export default new EmailController();
