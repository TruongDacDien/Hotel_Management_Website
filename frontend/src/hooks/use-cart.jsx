import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = "elysian_retreat_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addRoom = (room, checkIn, checkOut) => {
    // Create a unique ID for this room booking using dates
    const id = `room-${room.id}-${checkIn}-${checkOut}`;
    
    // Check if this exact room with these dates is already in the cart
    const existingItemIndex = items.findIndex(item => item.id === id);
    
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
          type: "room"
        }
      ]);
    }
  };

  const addService = (service) => {
    const id = `service-${service.id}`;
    
    const existingItemIndex = items.findIndex(item => item.id === id);
    
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
          quantity: 1,
          type: "service"
        }
      ]);
    }
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(
      items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

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
        totalPrice 
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