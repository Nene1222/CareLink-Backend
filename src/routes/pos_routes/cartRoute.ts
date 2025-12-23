import { Router } from "express";
import { addToCart, updateCart, clearCart, updateQuantity } from "../../controllers/pos_controllers/cartController";

const router = Router();

// // Get all cart items
// router.get("/", async (req, res) => {
//   res.json({ cart: cart }); // You can expose cart from controller if needed
// });

// Add a new item to the cart
router.post("/add", async (req, res) => {
  try {
    console.log("Request body:", req.body);  // <--- add this
    const item = req.body;
    const result = await addToCart(item);
    res.json(result);
  } catch (err: any) {
    console.error("Error adding item to cart:", err);
    res.status(500).json({ error: err.message });
  }
});


// Update the quantity of an item by ID
router.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const result = await updateQuantity(id, quantity);
  res.json(result);
});

// Replace the entire cart
router.put("/update", async (req, res) => {
  const { items } = req.body; // Frontend sends array of items
  const result = await updateCart(items);
  res.json(result);
});

// Clear all items in the cart
router.delete("/", async (req, res) => {
  const result = await clearCart();
  res.json(result);
});

export default router;
