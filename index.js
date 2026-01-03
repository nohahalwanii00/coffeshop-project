import express from "express";
import mysql from "mysql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
 

const app = express();

const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASS || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,
});

db.connect((err) => {
  if (err) console.log(" MySQL error", err);
  else console.log("MySQL connected");
});
function isValidJSON(text) {
  if (typeof text !== "string") {
    return false; 
  }
  try {
    JSON.parse(text);
    return true; 
  } catch (e) {
    return false; 
  }
}

app.post("/register", async (req, res) => {
    if (!req.body) {
    return res.status(400).json({ error: "Request body is missing." });
  }

  if (!isValidJSON(JSON.stringify(req.body))) {
    return res.status(400).json({ error: "Invalid JSON format." });
  }
  const { name, email, password } = req.body;
 
  const errors = [];
  if (!name) {
    errors.push("username is required.");
  }
  if (!email) {
    errors.push("Email is required.");
  }
  if (!password) {
    errors.push("Password is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
  }
  if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
  if (name.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters" });
    }
    

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const q = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(q, [name, email, hash], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: err.sqlMessage });
        }
        return res.status(500).json(err);
      }
      res.status(201).json({ message: "User registered successfully" });
    });

  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const q = "SELECT * FROM users WHERE email=?";
  db.query(q, [email], async (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(401).json({ error: "Wrong email or password" });

    const user = data[0];

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Wrong email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Access denied" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}


app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
