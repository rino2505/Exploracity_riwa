const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

// Multer za upload slike
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MySQL konekcija
const db = mysql.createPool({
    host: "ucka.veleri.hr",
    user: "pkarlovic",
    password: "11",
    database: "pkarlovic"
});

// GET – popis događaja
app.get("/dogadaji", (req, res) => {
    db.query("SELECT ID_dogadaja, Naziv_dogadaja FROM Dogadaj", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// GET – vraća sliku događaja
app.get("/dogadaj/:id/slika", (req, res) => {
    const id = req.params.id;

    db.query(
        "SELECT Slika_dogadaja FROM Dogadaj WHERE ID_dogadaja = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err); // 500 znači internal server error vjerojatno nije spojilo na bazu
            if (!result.length || !result[0].Slika_dogadaja) // ovo gleda jel opce ima slike ako nema vraca da nema slike
                return res.status(404).send("Nema slike");

            res.contentType("image/jpeg");
            res.send(result[0].Slika_dogadaja); // salje sliku kao odgovor
        }
    );
});

// POST – upload slike i zapis u bazu
app.post("/dogadaj/:id/upload", upload.single("slika"), (req, res) => {
    const id = req.params.id; // id događaja iz URL parametra
    const slika = req.file.buffer; // byte code od slike koju smo uploadali i biti ce stavljena u medium blob

    db.query(
        "UPDATE Dogadaj SET Slika_dogadaja = ? WHERE ID_dogadaja = ?", // postavlja bytecode slike u bazu podataka prepared statement
        [slika, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send({ message: "Slika uspješno spremljena!" });
        }
    );
});

app.listen(3000, () =>
    console.log("Server radi na http://localhost:3000")
);
