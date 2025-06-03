import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = "hotel-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        console.log("Found cart in localStorage:", savedCart);
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    } else {
      console.warn("No cart found in localStorage after reload");
    }

    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addRoom = (room, checkIn, checkOut, userInfo) => {
    saveSnapshot();
    // Create a unique ID for this room booking using dates
    const id = `room-${room.id}-${checkIn}-${checkOut}`;

    // Check if this exact room with these dates is already in the cart
    const existingItemIndex = items.findIndex((item) => item.id === id);

    if (existingItemIndex >= 0) {
      // Update quantity if it already exists
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += 1;
      setItems(updatedItems);
    } else {
      // Add new room booking to cart
      setItems([
        ...items,
        {
          id,
          roomId: room.id,
          name: room.name,
          price: room.price,
          imageUrl: room.imageUrl,
          quantity: 1,
          checkIn,
          checkOut,
          type: "room",
          guestInfo: userInfo,
        },
      ]);
    }
  };

  const addService = (service, userInfo) => {
    saveSnapshot();
    const id = `service-${service.id}`;

    const existingItemIndex = items.findIndex((item) => item.id === id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += 1;
      setItems(updatedItems);
    } else {
      setItems([
        ...items,
        {
          id,
          serviceId: service.id,
          name: service.name,
          price: service.price,
          imageUrl: service.imageUrl,

          offeredDate: service.offeredDate,
          guestInfo: userInfo,
          quantity: 1,
          type: "service",
        },
      ]);
    }
  };

  const removeItem = (id) => {
    saveSnapshot();
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    const currentItem = items.find((item) => item.id === id);
    if (!currentItem || currentItem.quantity === quantity) return;
    saveSnapshot();
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    saveSnapshot();
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const saveSnapshot = () => {
    const current = JSON.stringify(items);
    const last = history[history.length - 1];
    if (current !== last) {
      setHistory([...history, current]); // chỉ lưu nếu khác
    }
  };

  const clearSnapshots = () => {
    setHistory([]);
  };

  // const undo = () => {
  //   if (history.length === 0) return false;

  //   const lastSnapshot = history[history.length - 1];
  //   const restored = JSON.parse(lastSnapshot);

  //   // Cập nhật items và đồng thời cập nhật history đúng thời điểm
  //   setItems(() => {
  //     setHistory((prev) => prev.slice(0, prev.length - 1));
  //     return restored;
  //   });

  //   return true;
  // };
  const undo = () => {
    if (history.length === 0) return false;

    const current = JSON.stringify(items);

    // Tìm snapshot khác hiện tại gần nhất
    let index = history.length - 1;
    while (index >= 0 && history[index] === current) {
      index--;
    }

    if (index < 0) return false;

    const restored = JSON.parse(history[index]);

    setItems(restored);
    setHistory((prev) => prev.slice(0, index)); // cắt bỏ hết các bản trùng

    return true;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addRoom,
        addService,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoaded,
        undo,
        clearSnapshots,
        saveSnapshot,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
