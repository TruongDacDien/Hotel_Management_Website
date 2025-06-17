import axios from "./axios_custom";

export const callLogin = async (data) => {
  return axios.post("/auth/customer/sign-in", { ...data });
};

export const callSignUp = async (data) => {
  return axios.post("/auth/customer/sign-up", { ...data });
};

export const callAccount = async () => {
  return axios.get("/auth/customer/account");
};

export const callSignOut = async (data) => {
  return axios.get("/auth/customer/sign-out", { ...data });
};

export const sendCode = async (email) => {
  return axios.post("/email/send-confirm-code", { email });
};
export const checkCode = async (email, verificationCode) => {
  return axios.post("/email/check-confirm-code", {
    email,
    verificationCode,
  });
};
export const sendResetPass = async (email) => {
  return axios.post("/email/send-reset-password", { email });
};

export const getAllRatingRoom = async () => {
  return axios.get("/ratingRoomTypes");
};

export const getRatingByRoomId = async (ratingId) => {
  return axios.get(`/ratingRoomTypes/${ratingId}`);
};

export const createRatingByRoom = async (data) => {
  return axios.post("/ratingRoomTypes", { ...data });
};

export const getAllRatingService = async () => {
  return axios.get("/ratingServices");
};

export const getRatingByServiceId = async (ratingId) => {
  return axios.get(`/ratingServices/${ratingId}`);
};

export const createRatingByService = async (data) => {
  return axios.post("/ratingServices", { ...data });
};

export const getCustomerAccountById = async (Id) => {
  return axios.get(`/customerAccounts/${Id}`);
};

export const updateCustomerAccountById = async (Id, data) => {
  data.forEach((value, key) => {
    console.log(`${key}:`, value);
  });
  return axios.put(`/customerAccounts/${Id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCustomerById = async (Id) => {
  return axios.get(`/customers/${Id}`);
};

export const createOrder = async (data) => {
  return axios.post("/bookings/customerOrder", data);
};

export const sendBookingToEmail = async (data) => {
  return axios.post("/email/send-booking-confirmation", data);
};

export const getHistoryBookingByCustomerId = async (customerId) => {
  return axios.get("/bookings/history", {
    params: { customerId },
  });
};

// export const updateUser = async (id, updateData) => {
//   return axios.put(`/user/user/${id}`, { ...updateData });
// };

// export const changePasword = async (id, updateData) => {
//   return axios.post(`/user/user/change-password/${id}`, { ...updateData });
// };

//room
export const getAllRooms = async () => {
  return await axios.get(`rooms`);
};

export const getRoomById = async (roomId) => {
  return await axios.get(`rooms/${roomId}`);
};

//roomType
export const getAllRoomTypes = async () => {
  return await axios.get(`roomTypes`);
};

export const getRoomTypeById = async (roomTypeId) => {
  return await axios.get(`roomTypes/${roomTypeId}`);
};

//Service
export const getAllServices = async () => {
  return await axios.get(`services`);
};

export const getServiceById = async (serviceId) => {
  return await axios.get(`services/${serviceId}`);
};

//ServiceType
export const getAllServiceTypes = async () => {
  return await axios.get(`serviceTypes`);
};

export const getServiceTypeById = async (serviceTypeId) => {
  return await axios.get(`serviceTypes/${serviceTypeId}`);
};

//Amentities in Room
export const getAmentitesRoomDetails = async () => {
  return await axios.get(`amenityDetails`);
};

export const createPayment = async ({
  isOnline = null,
  fullName = null,
  email = null,
  phone = null,
  roomRequests = [],
  serviceRequests = [],
  totalPrice = null,
}) => {
  return await axios.post(`/payment/create`, {
    isOnline,
    fullName,
    email,
    phone,
    roomRequests,
    serviceRequests,
    totalPrice,
  });
};

export const deletePendingBooking = async (orderCode) => {
  return axios.delete(`/payment/${orderCode}`);
};

export const createPromotion = async (formData) => {
  return await axios.post(`/promotion`, { ...formData });
};
export const getCurrentPro = async (date) => {
  return await axios.get(`/promotion`, { params: { date } });
};
export const updatePro = async (id) => {
  return await axios.patch(`/promotion/${id}`);
};
export const deletePro = async (id) => {
  return await axios.delete(`/promotion/${id}`);
};

export const getProById = async (id) => {
  return await axios.get(`/promotion/${id}`);
};

export const getAllOrderByUserId = async () => {
  return await axios.get(`/orders/all-order-by-userId`);
};

export const getAllPromotion = async () => {
  return await axios.get(`/promotion/active`);
};

// point

export const getCurrentPoint = async () => {
  return await axios.get(`/loyalpoint`);
};

export const getParam = async () => {
  return await axios.get(`/param`);
};
