const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ingredients', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Ingredient Schema
const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

// Seed Data (Optional: Uncomment this to populate the database initially)
// const seedIngredients = async () => {
//   await Ingredient.insertMany([
//     { name: 'Tomato' },
//     { name: 'Onion' },
//     { name: 'Garlic' },
//     { name: 'Basil' },
//     { name: 'Cheese' },
//     { name: 'Olive Oil' },
//   ]);
//   console.log('Ingredients seeded');
// };
// seedIngredients();

// API Route for searching ingredients
app.get('/api/ingredients', async (req, res) => {
  const query = req.query.q || '';
  if (!query) return res.json([]);
  
  try {
    const ingredients = await Ingredient.find({ name: new RegExp(query, 'i') }).limit(10); // Case-insensitive search
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ingredients', error });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
