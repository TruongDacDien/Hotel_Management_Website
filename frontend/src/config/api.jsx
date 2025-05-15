import axios from "./axios_custom";

// export const callLogin = async (data) => {
//   return axios.post("/auth/user/sign-in", { ...data });
// };

export const callSignUp = async (data) => {
  return axios.post("/customerAccounts", { ...data });
};

// export const callAccount = async () => {
//   return axios.get("/auth/user/account");
// };

// export const callSignOut = async (data) => {
//   return axios.get("/auth/user/sign-out", { ...data });
// };

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
  totalPrice,
  filmShowId = null,
  seatSelections = null,
  promotionIDs = null,
  ticketSelections = null,
  additionalItemSelections = null,
  pointUsage = null,
}) => {
  return await axios.post(`/payment`, {
    totalPrice,
    filmShowId,
    seatSelections,
    promotionIDs,
    ticketSelections,
    additionalItemSelections,
    pointUsage,
  });
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
