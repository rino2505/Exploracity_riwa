const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: "ucka.veleri.hr",
    user: "pkarlovic",
    password: "11",
    port: 3306,
    database: "pkarlovic",
});

app.use(express.urlencoded({ extended: true }));

connection.connect(function(err) {
    if (err) throw err;
    console.log("Uspješno povezano na bazu!");
});

app.post('/unosdogadaja', (req, res) => {
  const {
    naziv,
    lokacija,
    datum,
    vrijeme,
    opis,
    slika
  } = req.body;

  const sql = `
    INSERT INTO Dogadaj
    (Naziv_dogadaja, Lokacija_dogadaja, Datum_dogadaja, Vrijeme_dogadaja, Opis_dogadaja, Slika_dogadaja)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [naziv, lokacija, datum, vrijeme, opis, slika],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Greška pri unosu' });
      }

      res.json({
        message: 'Događaj spremljen',
        id: result.insertId
      });
    }
  );
});



app.listen(port, () => {
  console.log(`Server radi na portu ${port}`);
});
