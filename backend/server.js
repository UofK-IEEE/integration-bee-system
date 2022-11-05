const express = require("express");
const app = express();
const connectDB = require("./config/db");

// Connecting with database...
connectDB();

//Middleware
app.use(express.json({ extended: false }));

// Testing the server
app.get("/", (req, res) => res.send("Server running!"));

app.use("/api/users", require("./api/routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
