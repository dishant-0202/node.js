const express = require("express");
const connection = require("./db");
const router = express.Router();
router.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
        connection.query(sql, [email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error or user already exists"
                });
            }

            const token = jwt.sign(
                { id: result.insertId, email },
                "12454215475ewdfw",
                { expiresIn: "1h" }
            );

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                token,
                user: {
                    id: result.insertId,
                    email
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ================= SIGNIN =================
router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            "12454215475ewdfw",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Signin successful",
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    });
});


// ================= LOGOUT =================
router.post("/logout", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});


// ================= EXPORT =================
module.exports = router;
