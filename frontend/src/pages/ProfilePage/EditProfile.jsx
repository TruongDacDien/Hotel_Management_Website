import React, { useState } from "react";

export default function EditProfileModal({ open, userData, onClose, onSave }) {
  if (!open) return null;
  const [form, setForm] = useState({
    fullName: userData.TenKH || "",
    phone: userData.SDT || "",
    identification: userData.CCCD || "",
    address: userData.DiaChi || "",
    email: userData.Email || "",
    sex: userData.GioiTinh || "Chưa xác định",
    country: userData.QuocTich || "Việt Nam",
    avatarId: userData.AvatarId || "",
    avatarURL: userData.AvatarURL || "",
    avatarFile: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        avatarFile: file,
      });
    }
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-center">Chỉnh sửa hồ sơ</h2>

        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Họ và tên"
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Số điện thoại"
          className="w-full p-2 border rounded"
        />
        <input
          name="identification"
          value={form.identification}
          onChange={handleChange}
          placeholder="Số CCCD"
          className="w-full p-2 border rounded"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Địa chỉ"
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />

        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Chưa xác định">Chưa xác định</option>
        </select>

        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Quốc tịch"
          className="w-full p-2 border rounded"
        />

        {form.avatarURL && form.avatarFile && (
          <div className="flex justify-center">
            <img
              src={
                form.avatarURL
                  ? URL.createObjectURL(form.avatarFile)
                  : form.avatarURL
              }
              alt="Avatar"
              className="w-24 h-24 object-cover rounded-full border"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple={false}
          onChange={handleFileChange}
          className="w-full"
        />

        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="px-4 py-1 border rounded">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
