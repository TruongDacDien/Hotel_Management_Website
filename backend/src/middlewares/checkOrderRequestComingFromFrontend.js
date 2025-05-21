import expressAsyncHandler from "express-async-handler";

export const checkOrderRequestComingFromFrontend = expressAsyncHandler(async (req, res, next) => {
    const { roomUsed, serviceUsed, totalPrice} = req.body;
    
    next();
});