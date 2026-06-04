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
  
  // Kreiraj tablice ako ne postoje
  const createOdgovorNaPitanjeSQL = `
    CREATE TABLE IF NOT EXISTS Odgovor_na_pitanje (
      ID_odgovora INT AUTO_INCREMENT PRIMARY KEY,
      Sadrzaj_odgovora LONGTEXT NOT NULL,
      ID_pitanja INT NOT NULL,
      ID_organizatora INT NOT NULL,
      Datum_odgovora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ID_pitanja) REFERENCES Pitanje_za_dogadaj(ID_pitanja),
      FOREIGN KEY (ID_organizatora) REFERENCES Organizator(ID_organizatora)
    )
  `;
  
  connection.query(createOdgovorNaPitanjeSQL, (err) => {
    if (err) {
      console.error("Greška pri kreiranju tablice Odgovor_na_pitanje:", err);
    } else {
      console.log("Tablica Odgovor_na_pitanje je spremna!");
    }
  });
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

// REGISTRACIJA ORGANIZATORA
app.post("/signuporganizatora", (req, res) => {
    console.log("SIGNUP ORGANIZATOR:", req.body);

    const { Ime_organizatora, Prezime_organizatora, Email_organizatora, Lozinka_organizatora } = req.body;

    // Validacija
    if (!Ime_organizatora || !Prezime_organizatora || !Email_organizatora || !Lozinka_organizatora) {
        return res.status(400).json({ error: "Svi podaci su obavezni" });
    }

    // Provjera postoji li već organizator s tim emailom
    const checkSql = "SELECT * FROM Organizator WHERE Email_organizatora = ?";
    connection.query(checkSql, [Email_organizatora], (err, results) => {
        if (err) return res.status(500).json({ error: "Greška pri provjeri emaila" });

        if (results.length > 0) {
            return res.status(409).json({ error: "Email već postoji" });
        }

        // Unos novog organizatora
        const insertSql = `
            INSERT INTO Organizator (Ime_organizatora, Prezime_organizatora, Email_organizatora, Lozinka_organizatora)
            VALUES (?, ?, ?, ?)
        `;

        connection.query(insertSql, [Ime_organizatora, Prezime_organizatora, Email_organizatora, Lozinka_organizatora], (err, result) => {
            if (err) {
                console.error("Greška pri registraciji organizatora:", err);
                return res.status(500).json({ error: "Greška pri registraciji" });
            }

            res.json({
                ID_organizatora: result.insertId,
                ime: Ime_organizatora,
                prezime: Prezime_organizatora,
                uloga: "admin",
                message: "Uspješno ste se registrirali"
            });
        });
    });
});

// REGISTRACIJA POSJETITELJA
app.post("/signupposjetitelja", (req, res) => {
    console.log("SIGNUP POSJETITELJ:", req.body);

    const { Ime_posjetitelja, Prezime_posjetitelja, Email_posjetitelja, Lozinka_posjetitelja } = req.body;

    // Validacija
    if (!Ime_posjetitelja || !Prezime_posjetitelja || !Email_posjetitelja || !Lozinka_posjetitelja) {
        return res.status(400).json({ error: "Svi podaci su obavezni" });
    }

    // Provjera postoji li već posjetitelj s tim emailom
    const checkSql = "SELECT * FROM Posjetitelj WHERE Email_posjetitelja = ?";
    connection.query(checkSql, [Email_posjetitelja], (err, results) => {
        if (err) return res.status(500).json({ error: "Greška pri provjeri emaila" });

        if (results.length > 0) {
            return res.status(409).json({ error: "Email već postoji" });
        }

        // Unos novog posjetitelja
        const insertSql = `
            INSERT INTO Posjetitelj (Ime_posjetitelja, Prezime_posjetitelja, Email_posjetitelja, Lozinka_posjetitelja)
            VALUES (?, ?, ?, ?)
        `;

        connection.query(insertSql, [Ime_posjetitelja, Prezime_posjetitelja, Email_posjetitelja, Lozinka_posjetitelja], (err, result) => {
            if (err) {
                console.error("Greška pri registraciji posjetitelja:", err);
                return res.status(500).json({ error: "Greška pri registraciji" });
            }

            res.json({
                ID_posjetitelja: result.insertId,
                ime: Ime_posjetitelja,
                prezime: Prezime_posjetitelja,
                uloga: "posjetitelj",
                message: "Uspješno ste se registrirali"
            });
        });
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
        (Sadrzaj_pitanja, ID_posjetitelja, ID_dogadaja, Datum_unosa_p)
        VALUES (?, ?, ?, NOW())
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
      p.Datum_unosa_p, 
      p.ID_posjetitelja,
      ps.Ime_posjetitelja,
      o.Sadrzaj_odgovora,
      org.Ime_organizatora
    FROM Pitanje_za_dogadaj p 
    LEFT JOIN Posjetitelj ps ON p.ID_posjetitelja = ps.ID_posjetitelja
    LEFT JOIN Odgovor_na_pitanje o ON p.ID_pitanja = o.ID_pitanja
    LEFT JOIN Organizator org ON o.ID_organizatora = org.ID_organizatora
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

// POST ruta za unos događaja
app.post("/novidogadaj", (req, res) => {
  const { naziv, lokacija, datum, vrijeme, opis } = req.body;
  const ID_organizatora = req.session.korisnik.ID_organizatora;
  console.log("Organizator iz sessiona:", ID_organizatora);
  const sql = `INSERT INTO Dogadaj (Naziv_dogadaja, Lokacija_dogadaja, Datum_i_vrijeme_dogadaja, Opis_dogadaja, ID_organizatora) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(sql, [naziv, lokacija, datum, vrijeme, opis, ID_organizatora]);
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