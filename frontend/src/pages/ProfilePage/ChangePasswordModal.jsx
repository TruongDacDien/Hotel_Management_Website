import React, { useMemo, useState } from "react";

export default function ChangePasswordModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const error = useMemo(() => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) return "";
    if (form.newPassword.length < 6) return "Mật khẩu mới phải có ít nhất 6 ký tự";
    if (form.newPassword !== form.confirmPassword) return "Xác nhận mật khẩu không khớp";
    if (form.newPassword === form.currentPassword) return "Mật khẩu mới phải khác mật khẩu hiện tại";
    return "";
  }, [form]);

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (error) return;
    onSubmit({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-center">Đổi mật khẩu</h2>

        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Mật khẩu hiện tại"
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="Mật khẩu mới"
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Xác nhận mật khẩu mới"
          className="w-full p-2 border rounded"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="px-4 py-1 border rounded">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!!error || !form.currentPassword || !form.newPassword || !form.confirmPassword}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}
