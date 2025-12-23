// controller/cartcontroller.ts
// We will inject a broadcast function
let broadcastFn: ((data: any) => void) | null = null;
// Set the broadcast function
export function setBroadcast(fn: (data: any) => void) {
  broadcastFn = fn;
}

export interface CartItem {
  id: string;    // auto-generated ID
  data: any;     // store the actual item object (from frontend)
}
// Helper to broadcast cart changes
function broadcastCartChange(event: string, payload: any) {
  if (broadcastFn) {
    broadcastFn({ event, payload });
  }
}
let cart: CartItem[] = [];

// Update the entire cart with new items
export async function updateCart(items: any[]) {
  cart = items.map(item => ({
    id: Date.now().toString() + Math.random(),
    data: item
  }));
  broadcastCartChange("updateCart", cart);

  return {
    message: "Cart updated",
    cart
  };
}

// Add a single item to the cart
export async function addToCart(item: any) {
  const existingItem = cart.find(cartItem => cartItem.data.productId === item.productId);

  if (existingItem) {
    existingItem.data.quantity = (existingItem.data.quantity || 1) + (item.quantity || 1);
  } else {
    const newItem: CartItem = {
      id: item.productId,
      data: { ...item, quantity: item.quantity || 1 },
    };
    cart.push(newItem);
  }

  // Broadcast the **full cart** after add
  broadcastCartChange("updateCart", cart);

  return { message: "Cart updated", cart };
}


// Update quantity of an item by ID
export async function updateQuantity(id: string, quantity: number) {
  // Remove item if quantity <= 0
  if (quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== id);
    broadcastCartChange("updateCart", cart);
    return { message: "Item removed", cart };
  }

  // Otherwise, update quantity
  const item = cart.find(cartItem => cartItem.id === id);
  if (!item) return { message: "Item not found", success: false };

  item.data.quantity = quantity;

  broadcastCartChange("updateCart", cart);

  return { message: "Quantity updated", cart };
}


// Remove all items from the cart
export async function clearCart() {
  cart = [];

  broadcastCartChange("updateCart", cart);

  return { message: "Cart cleared", cart };
}


export function getCart() {
  return cart;
}
