const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const multer = require("multer");

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer za upload slike
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// MySQL konekcija
const connection = mysql.createConnection({
    host: "student.veleri.hr",
    user: "pkarlovic",
    password: "11",
    database: "pkarlovic",
});

connection.connect(function(err) {
    if (err) {
        console.error("Greška pri povezivanju na bazu:", err);
        return;
    }
    console.log("Uspješno povezano na bazu!");
});


app.post("/login", (req, res) => {
    const username = req.body.Username_organizatora;
    const lozinka = req.body.Lozinka_organizatora;

    const sql = "SELECT * FROM Organizator WHERE Username_organizatora=? AND Lozinka_organizatora=?";
    
    connection.query(sql, [username, lozinka], (error, results) => {
        if (error) return res.status(500).send("Greška na serveru");

        if (results.length === 1) {
            const organizator = {
                "ID_organizatora": results[0].ID_organizatora,
                "korime": results[0].Username_organizatora,
                "ime": results[0].Ime_organizatora,
                "uloga": "admin" 
            };
            res.status(200).send(organizator);
        } else {
            res.status(401).send("Pogrešno korisničko ime ili lozinka");
        }
    });
});

// GET – popis događaja
app.get("/dogadaji", (req, res) => {
    connection.query("SELECT ID_dogadaja, Naziv_dogadaja FROM Dogadaj", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// GET – vraća sliku događaja
app.get("/dogadaj/:id/slika", (req, res) => {
    const id = req.params.id;

    connection.query(
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

    connection.query(
        "UPDATE Dogadaj SET Slika_dogadaja = ? WHERE ID_dogadaja = ?", // postavlja bytecode slike u bazu podataka prepared statement
        [slika, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send({ message: "Slika uspješno spremljena!" });
        }
    );
});




app.get('/api/popis-dogadaja', (req, res) => {
  const sql = 'SELECT ID_dogadaja, Naziv_dogadaja FROM Dogadaj'; 
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results); 
  });
});


app.get("/api/prikazidogadaje", (req, res) => {
    connection.query("SELECT * FROM Dogadaj", (error, results) => {
        if (error) return res.status(500).send("Greška pri dohvatu");
        res.send(results);
    });
});


app.post('/unosdogadaja', (req, res) => {
    const { naziv, lokacija, datum, vrijeme, opis, slika } = req.body;
    const sql = `INSERT INTO Dogadaj (Naziv_dogadaja, Lokacija_dogadaja, Datum_dogadaja, Vrijeme_dogadaja, Opis_dogadaja, Slika_dogadaja) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [naziv, lokacija, datum, vrijeme, opis, slika], (err, result) => {
        if (err) return res.status(500).json({ message: "Greška pri unosu" });
        res.json({ message: "Događaj uspješno spremljen", id: result.insertId });
    });
});


app.post('/api/pitanja', (req, res) => {
  const { question, eventId, eventName } = req.body;

  const sql = `INSERT INTO Pitanje_za_dogadaj (Sadrzaj_pitanja, ID_korisnika, ID_dogadaja, Naziv_dogadaja) VALUES (?, ?, ?, ?)`;
  const values = [question, null, eventId, eventName]; 

  connection.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Greška pri spremanju pitanja' });
    res.json({ status: 'success', insertedId: result.insertId });
  });
});


app.get('/api/questions', (req, res) => {
  const { eventId } = req.query;
  let sql = `SELECT ID_pitanja, Sadrzaj_pitanja, ID_dogadaja, Naziv_dogadaja FROM Pitanje_za_dogadaj`;
  const params = [];

  if (eventId) {
    sql += ' WHERE ID_dogadaja = ? ';
    params.push(eventId);
  }
  sql += ' ORDER BY ID_pitanja DESC ';

  connection.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.listen(port, () => {
    console.log(`Server pokrenut na http://localhost:${port}`);
});



app.get('/api/admin/pitanja-bez-odgovora', (req, res) => {
  const { idOrganizatora } = req.query; 

  const sql = `
    SELECT p.*, d.Naziv_dogadaja 
    FROM Pitanje_za_dogadaj p
    JOIN Dogadaj d ON p.ID_dogadaja = d.ID_dogadaja
    LEFT JOIN Odgovor_na_pitanje o ON p.ID_pitanja = o.ID_pitanja
    WHERE o.ID_odgovora_p IS NULL AND d.ID_organizatora = ?
  `;
  
  connection.query(sql, [idOrganizatora], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Greška pri dohvatu podataka s baze' });
    }
    res.json(results);
  });
});


app.post('/api/admin/odgovori', (req, res) => {
  const { sadrzaj, idPitanja, idOrganizatora } = req.body;
  
  
  const sql = `INSERT INTO Odgovor_na_pitanje (Sadrzaj_odgovora, ID_pitanja, ID_organizatora) VALUES (?, ?, ?)`;

  connection.query(sql, [sadrzaj, idPitanja, idOrganizatora], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Greška pri spremanju odgovora' });
    }
    res.json({ status: 'success' });
  });
});