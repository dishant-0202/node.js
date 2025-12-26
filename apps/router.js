const express = require("express");
const connection = require("./db");
const router = express.Router()
router.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




router.post("/signup", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
        connection.query(sql, [email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error or user already exists"
                });
            }

            // Generate JWT token immediately after signup
            const token = jwt.sign({
                    id: result.insertId,
                    email
                }, // payload
                "12454215475ewdfw", // secret key (change to strong secret)
                {
                    expiresIn: "1h"
                } // token valid for 1 hour
            );

            // Send response with token
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                token: token,
                user: {
                    id: result.insertId,
                    email: email
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






router.post("/signin", (req, res) => {
    const {
        email,
        password
    } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    // Check user in database
    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        // User not found
        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result[0];

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign({
                id: user.id,
                email: user.email
            }, // payload
            process.env.JWT_SECRET || "YOUR_SECRET_KEY", // secret key
            {
                expiresIn: "1h"
            } // token valid for 1 hour
        );

        // Send success response with token
        res.status(200).json({
            success: true,
            message: "Signin successful",
            token: token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    });
});


router.post("/logout", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});




// export router
module.exports = router;