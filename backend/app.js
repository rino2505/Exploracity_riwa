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
  host: "ucka.veleri.hr",
  user: "akozul",
  password: "11",
  database: "akozul",
});

connection.connect(function (err) {
  if (err) {
    console.error("Greška pri povezivanju na bazu:", err);
    return;
  }
  console.log("Uspješno povezano na bazu!");
});

app.post("/loginorganizatora", (req, res) => {
     console.log("BODY ORGANIZATOR:", req.body); 

    const email = req.body.Email_organizatora || req.body.email;
    const lozinka = req.body.Lozinka_organizatora || req.body.password;

    const sql = `
        SELECT * FROM Organizator
        WHERE Email_organizatora = ? AND Lozinka_organizatora = ?
    `;

    connection.query(sql, [email, lozinka], (err, results) => {
        if (err) return res.status(500).send("Greška");

        if (results.length === 1) {
            res.json({
                ID_organizatora: results[0].ID_organizatora,
                ime: results[0].Ime_organizatora,
                prezime: results[0].Prezime_organizatora,
                uloga: "admin"
            });
        } else {
            res.status(401).send("Krivi login");
        }
    });
});

app.post("/loginposjetitelja", (req, res) => {
     console.log("BODY POSJETITELJ:", req.body); ;

    const email = req.body.Email_posjetitelja || req.body.email;
    const lozinka = req.body.Lozinka_posjetitelja || req.body.password;

    const sql = `
        SELECT * FROM Posjetitelj
        WHERE Email_posjetitelja = ? AND Lozinka_posjetitelja = ?
    `;

    connection.query(sql, [email, lozinka], (err, results) => {
        if (err) return res.status(500).send("Greška");

        if (results.length === 1) {
            res.json({
                ID_posjetitelja: results[0].ID_posjetitelja,
                ime: results[0].Ime_posjetitelja,
                prezime: results[0].Prezime_posjetitelja,
                uloga: "posjetitelj"
            });
        } else {
            res.status(401).send("Krivi login");
        }
    });
});


// GET – popis događaja
app.get("/dogadaji", (req, res) => {
  connection.query(
    "SELECT ID_dogadaja, Naziv_dogadaja, Opis_dogadaja FROM Dogadaj",
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    }
  );
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

app.get("/api/popis-dogadaja", (req, res) => {
  const sql = "SELECT ID_dogadaja, Naziv_dogadaja FROM Dogadaj";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// RUTA ZA ADMINA - vidi samo svoje događaje
app.get("/api/admin/moji-dogadaji", (req, res) => {
    const { idOrganizatora } = req.query;

    if (!idOrganizatora) {
        return res.status(400).json({ error: "Nedostaje ID organizatora" });
    }

    const sql = "SELECT ID_dogadaja, Naziv_dogadaja FROM Dogadaj WHERE ID_organizatora = ?";
    
    connection.query(sql, [idOrganizatora], (err, results) => {
        if (err) {
            console.error("Greška pri dohvatu:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

app.get("/api/prikazidogadaje", (req, res) => {
  connection.query("SELECT * FROM Dogadaj", (error, results) => {
    if (error) return res.status(500).send("Greška pri dohvatu");
    res.send(results);
  });
});

app.post("/unosdogadaja", (req, res) => {
  const {
    naziv,
    lokacija,
    datumvrijeme,
    opis
  } = req.body;

  const status = 'aktivan'; 

  const sql = `
    INSERT INTO Dogadaj
    (Naziv_dogadaja,
     Lokacija_dogadaja,
     Datum_i_vrijeme_dogadaja,
     Opis_dogadaja,
     Status_dogadaja,
     ID_organizatora)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [
      naziv,
      lokacija,
      datumvrijeme,
      opis,
      status,
      1
    ],
    (err, result) => {
      if (err) {
        console.log("MYSQL ERROR:", err); 
        return res.status(500).json({ message: "Greška pri unosu" });
      }

      res.json({ id: result.insertId });
    }
  );
});

app.post("/api/pitanja", (req, res) => {
    const { sadrzaj, idPosjetitelja, idDogadaja } = req.body;

    const sql = `
        INSERT INTO Pitanje_za_dogadaj
        (Sadrzaj_pitanja, ID_posjetitelja, ID_dogadaja)
        VALUES (?, ?, ?)
    `;

    connection.query(sql,
        [sadrzaj, idPosjetitelja, idDogadaja],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

app.get("/api/questions", (req, res) => {
  const { eventId } = req.query;
  
  // Koristimo LEFT JOIN da dohvatimo pitanje čak i ako odgovor još ne postoji
  let sql = `
    SELECT 
      p.ID_pitanja, 
      p.Sadrzaj_pitanja, 
      p.Datum_unosa_p AS Vrijeme_postavljana, 
      o.Sadrzaj_odgovora 
    FROM Pitanje_za_dogadaj p 
    LEFT JOIN Odgovor_na_pitanje o ON p.ID_pitanja = o.ID_pitanja
    WHERE p.ID_dogadaja = ?
    ORDER BY p.ID_pitanja DESC
  `;

  connection.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error("Greška pri dohvatu pitanja:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/api/admin/pitanja-bez-odgovora", (req, res) => {
  const { idOrganizatora } = req.query;
  const sql = `SELECT p.*, d.Naziv_dogadaja FROM Pitanje_za_dogadaj p JOIN Dogadaj d ON p.ID_dogadaja = d.ID_dogadaja LEFT JOIN Odgovor_na_pitanje o ON p.ID_pitanja = o.ID_pitanja WHERE o.ID_odgovora_p IS NULL AND d.ID_organizatora = ?`;
  connection.query(sql, [idOrganizatora], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Greška pri dohvatu podataka s baze" });
    }
    res.json(results);
  });
});

// ========================================================
// ADMIN: DOHVAT PITANJA S FILTEROM (ODGOVORENA / NEODGOVORENA)
// ========================================================
app.get("/api/admin/pitanja-filtrirano", (req, res) => {
  const { idOrganizatora, eventId, status } = req.query;

  if (!idOrganizatora) {
    return res.status(400).json({ error: "Nedostaje ID organizatora" });
  }

  let sql = `
    SELECT 
      p.ID_pitanja,
      p.Sadrzaj_pitanja,
      p.Datum_unosa_p,
      p.ID_dogadaja,
      d.Naziv_dogadaja,
      o.Sadrzaj_odgovora
    FROM Pitanje_za_dogadaj p
    JOIN Dogadaj d ON p.ID_dogadaja = d.ID_dogadaja
    LEFT JOIN Odgovor_na_pitanje o ON p.ID_pitanja = o.ID_pitanja
    WHERE d.ID_organizatora = ?
  `;

  const params = [idOrganizatora];

  if (eventId) {
    sql += " AND p.ID_dogadaja = ? ";
    params.push(eventId);
  }

  if (status === "answered") {
    sql += " AND o.ID_odgovora IS NOT NULL ";
  } else if (status === "unanswered") {
    sql += " AND o.ID_odgovora IS NULL ";
  }

  sql += " ORDER BY p.ID_pitanja DESC ";

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Greška u SQL filteru:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.post("/api/admin/odgovori", (req, res) => {
  const { sadrzaj, idPitanja, idOrganizatora } = req.body;
  const sql = `INSERT INTO Odgovor_na_pitanje (Sadrzaj_odgovora, ID_pitanja, ID_organizatora) VALUES (?, ?, ?)`;
  connection.query(sql, [sadrzaj, idPitanja, idOrganizatora], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Greška pri spremanju odgovora" });
    }
    res.json({ status: "success" });
  });
});

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
    const { sadrzaj, ocjena, idPosjetitelja, idDogadaja } = req.body;

    const sql = `
        INSERT INTO Komentar
        (Sadrzaj_komentara, Broj_zvjezdica, ID_posjetitelja, ID_dogadaja)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(sql,
        [sadrzaj, ocjena, idPosjetitelja, idDogadaja],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

app.get("/api/comments", (req, res) => {
  const sql = "SELECT ID_dogadaja, Naziv_dogadaja FROM Dogadaj";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// POST ruta za unos događaja
app.post("/novidogadaj", (req, res) => {
  const { naziv, lokacija, datum, vrijeme, opis } = req.body;
  const ID_organizatora = req.session.korisnik.ID_organizatora;
  console.log("Organizator iz sessiona:", ID_organizatora);
  const sql = `INSERT INTO Dogadaj (Naziv_dogadaja, Lokacija_dogadaja, Datum_i_vrijeme_dogadaja, Opis_dogadaja, ID_organizatora) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(sql, [naziv, lokacija, datum, vrijeme, opis, ID_organizatora]);
});

app.get("/api/admin/komentari-bez-odgovora", (req, res) => {
  const { idOrganizatora } = req.query;

  const sql = `
    SELECT 
      k.ID_komentara,
      k.Sadrzaj_komentara,
      k.Datum_unosa_k,
      k.ID_dogadaja,
      d.Naziv_dogadaja
    FROM Komentar k
    JOIN Dogadaj d ON k.ID_dogadaja = d.ID_dogadaja
    WHERE d.ID_organizatora = ?
    ORDER BY k.ID_komentara DESC
  `;

  connection.query(sql, [idOrganizatora], (err, results) => {
    if (err) {
      console.error("Greška pri dohvaćanju komentara:", err);
      return res.status(500).json({ error: "Greška pri dohvatu komentara" });
    }
    res.json(results);
  });
});

app.delete("/api/admin/pitanja/:id", (req, res) => {
  const idPitanja = req.params.id;
  const sql = "DELETE FROM Pitanje_za_dogadaj WHERE ID_pitanja = ?";
  connection.query(sql, [idPitanja], (err, result) => {
    if (err) {
      console.error("Greška pri brisanju pitanja:", err);
      return res.status(500).json({ error: "Greška na serveru pri brisanju pitanja" });
    }
    res.status(200).json({ status: "success", message: "Uspješno obrisano" });
  });
});

app.post("/api/admin/odgovori-na-komentar", (req, res) => {
  const { sadrzaj, idKomentara, idOrganizatora } = req.body;
  if (!sadrzaj || !idKomentara || !idOrganizatora) {
    return res
      .status(400)
      .json({ error: "Nedostaju podaci (sadrzaj, idKomentara, idOrganizatora)" });
  }
  const sql = `INSERT INTO Odgovor_na_komentar (Sadrzaj_odgovora, ID_komentara, ID_organizatora) VALUES (?, ?, ?)`;
  connection.query(sql, [sadrzaj, idKomentara, idOrganizatora], (err) => {
    if (err) {
      console.error("Greška pri spremanju odgovora na komentar:", err);
      return res.status(500).json({ error: "Greška pri spremanju odgovora" });
    }
    res.json({ status: "success" });
  });
});

// ================= PLAN IZLASKA =================
app.post("/plan", (req, res) => {
    const { idDogadaja, idPosjetitelja, biljeska } = req.body;

    const sql = `
        INSERT INTO Plan_izlaska
        (ID_dogadaja, ID_posjetitelja, Biljeska)
        VALUES (?, ?, ?)
    `;

    connection.query(sql,
        [idDogadaja, idPosjetitelja, biljeska],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});


// ================= PREGLED =================
app.post("/pregled", (req, res) => {
    const { idDogadaja, idPosjetitelja } = req.body;

    connection.query(
        "INSERT INTO Pregled (ID_dogadaja, ID_posjetitelja) VALUES (?, ?)",
        [idDogadaja, idPosjetitelja],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

app.listen(port, () => {
  console.log(`Server pokrenut na http://localhost:${port}`);
});