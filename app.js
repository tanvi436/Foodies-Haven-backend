const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

// Hardcoded configuration
const mongoURI = "mongodb://localhost:27017/foodies-haven";
const jwtSecret = "your_jwt_secret_key";

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Enable basic CORS handling
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Foodies' Haven Backend!");
});

// User model (for MongoDB integration)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  favoriteCuisine: { type: String, default: "Not specified" },
  membershipLevel: { type: String, default: "Basic" },
});
const User = mongoose.model("User", UserSchema);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Token required" });

  const bearerToken = token.split(" ")[1]; // Extract token from "Bearer <token>"

  jwt.verify(bearerToken, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // Store user details in request
    next();
  });
};

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // Database lookup for user
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Password comparison using bcrypt
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { username: user.username, id: user._id },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Signup Route (Optional for new user registration)
app.post("/signup", async (req, res) => {
  try {
    const { username, password, email, favoriteCuisine, membershipLevel } = req.body;

    // Basic validation
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, password, and email are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists." });
    }

    // Hash password before saving to database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      favoriteCuisine,
      membershipLevel,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Profile Route
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      name: user.username,
      email: user.email,
      favoriteCuisine: user.favoriteCuisine,
      membershipLevel: user.membershipLevel,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
