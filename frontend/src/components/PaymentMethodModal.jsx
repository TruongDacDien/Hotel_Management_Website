import React from "react";
import { Button } from "./ui/button";

function PaymentMethodModal({ open, onClose, onDirect, onPayOS, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4 text-center">
          Chọn phương thức thanh toán
        </h2>
        <div className="flex flex-col gap-3">
          <Button
            className="w-full"
            variant="custom"
            disabled={loading}
            onClick={onDirect}
          >
            Thanh toán trực tiếp tại khách sạn
          </Button>
          <Button
            className="w-full"
            variant="outline"
            disabled={loading}
            onClick={onPayOS}
          >
            Thanh toán qua PayOS
          </Button>
        </div>
        <Button className="w-full mt-4" variant="ghost" onClick={onClose}>
          Hủy
        </Button>
      </div>
    </div>
  );
}

export default PaymentMethodModal;
