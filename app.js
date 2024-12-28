const Item = require('./models/Item');

// Create an item
app.post('/items', async (req, res) => {
    const item = new Item(req.body);
    try {
        await item.save();
        res.status(201).send(item);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all items
app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.send(items);
});

// Add more routes for update and delete as needed...