// app.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL konekcija
const connection = mysql.createConnection({
    host: "ucka.veleri.hr",
    user: "pkarlovic",
    password: "11",
    port: 3306,
    database: "pkarlovic",
});

connection.connect((err) => {
    if (err) {
        console.error("Greška pri povezivanju na bazu:", err);
        return;
    }
    console.log("Uspješno povezano na bazu!");
});

// ===================== DOGAĐAJI =====================

// GET svi događaji (za frontend dropdown)
app.get("/", (req, res) => {
    connection.query(
        "SELECT ID_dogadaja, Naziv_dogadaja FROM Dogadaj",
        (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(results);
        }
    );
});

// POST novi događaj
app.post("/unosdogadaja", (req, res) => {
    const { naziv, lokacija, datum, vrijeme, opis, slika } = req.body;

    const sql = `
        INSERT INTO Dogadaj
        (Naziv_dogadaja, Lokacija_dogadaja, Datum_dogadaja, Vrijeme_dogadaja, Opis_dogadaja, Slika_dogadaja)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [naziv, lokacija, datum, vrijeme, opis, slika],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Događaj spremljen", id: result.insertId });
        }
    );
});

// ===================== KOMENTARI =====================

// GET komentari po događaju
app.get("/comments", (req, res) => {
    const { eventId } = req.query;
    let sql =
        "SELECT ID_komentara, Sadrzaj_komentara, ID_korisnika, ID_dogadaja, Datum_unosa FROM Komentar";
    const params = [];

    if (eventId) {
        sql += " WHERE ID_dogadaja = ?";
        params.push(eventId);
    }

    sql += " ORDER BY ID_komentara DESC";

    connection.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// POST novi komentar
app.post("/comments", (req, res) => {
    const { comment, eventId, userId } = req.body;

    if (!comment || !eventId)
        return res
            .status(400)
            .json({ error: "Komentar i ID događaja su obavezni" });

    const sql =
        "INSERT INTO Komentar (Sadrzaj_komentara, ID_korisnika, ID_dogadaja) VALUES (?, ?, ?)";
    const values = [comment, userId || null, eventId];

    connection.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ status: "success", insertedId: result.insertId });
    });
});

// ===================== POKRETANJE SERVERA =====================
app.listen(port, () => {
    console.log(`Server radi na http://localhost:${port}`);
});


