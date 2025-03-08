const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: "postgresql://postgres:Codex@@db.kzgsxxkdleyychlmwlne.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
});

// ✅ API to Save or Update Notes
app.post('/save', async (req, res) => {
    const { access_code, content } = req.body;

    if (!access_code || access_code.length < 5 || access_code.length > 15) {
        return res.status(400).json({ success: false, message: "Invalid access code length" });
    }

    try {
        // 🔍 Check if the note already exists
        const checkQuery = "SELECT * FROM notes WHERE access_code = $1";
        const checkResult = await pool.query(checkQuery, [access_code]);

        if (checkResult.rows.length > 0) {
            // 📝 Update existing note
            await pool.query(
                "UPDATE notes SET content = $1 WHERE access_code = $2",
                [content, access_code]
            );
        } else {
            // 🆕 Insert new note
            await pool.query(
                "INSERT INTO notes (access_code, content) VALUES ($1, $2)", 
                [access_code, content]
            );
        }

        res.json({ success: true, message: "Note saved successfully!" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ success: false, message: "Failed to save note" });
    }
});

// ✅ API to Retrieve Notes
app.get("/getNote", async (req, res) => {
    const accessCode = req.query.accessCode;

    if (!accessCode || accessCode.length < 5 || accessCode.length > 15) {
        return res.json({ success: false, message: "Invalid access code length" });
    }

    try {
        const query = "SELECT content FROM notes WHERE access_code = $1;";
        const result = await pool.query(query, [accessCode]);

        if (result.rows.length > 0) {
            res.json({ success: true, content: result.rows[0].content });
        } else {
            res.json({ success: false, message: "No note found" });
        }
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
