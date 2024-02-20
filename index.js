const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Load initial data from the JSON file
let data = require("./data.json");

// Routes
// Get all items
app.get("/", (req, res) => {
  res.json(data.items);
});

// Get an item by ID
app.get("/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = data.items.find((item) => item.id === itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
});

// Create a new item
app.post("/", (req, res) => {
  const newItem = req.body;
  data.items.push(newItem);
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
  res.status(201).json(newItem);
});

// Update an existing item
app.put("/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  const index = data.items.findIndex((item) => item.id === itemId);
  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }
  data.items[index] = { ...data.items[index], ...updatedItem };
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
  res.json(data.items[index]);
});

// Delete an item
app.delete("/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const index = data.items.findIndex((item) => item.id === itemId);
  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }
  const deletedItem = data.items.splice(index, 1);
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
  res.json(deletedItem[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express API
module.exports = app;