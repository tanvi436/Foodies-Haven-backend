const express = require('express');
const app = express();
const port = 5000;

// Sample data for demonstration purposes
const ingredients = [
  { id: 1, name: 'Pasta' },
  { id: 2, name: 'Salad' },
  { id: 3, name: 'Pizza' },
  { id: 4, name: 'Burger' },
  { id: 5, name: 'Fries' },
];

// Endpoint to handle search queries
app.get('/api/ingredients', (req, res) => {
  const query = req.query.q.toLowerCase();
  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(query)
  );
  res.json(filteredIngredients);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
