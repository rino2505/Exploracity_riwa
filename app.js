const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;

const db = mysql.createConnection({
  host: 'student.veleri.hr',
  user: 'pkarlovic',
  password: '11',
  database: 'pkarlovic'
})

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err)
    return
  }
  console.log('Uspješno povezano na bazu')
})


app.get('/', (req, res) => {
  const sql = 'SELECT ID_dogadaja, Naziv_dogadaja FROM Dogadaj'; 

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results); 
  });
});

const sendMessage = async () => {
  if (!upit.value || !selectedEvent.value) {
    alert('Molimo odaberite događaj i unesite pitanje.');
    return;
  }

  try {
    const payload = {
      question: upit.value,
      eventId: selectedEvent.value.ID_dogadaja,       
      eventName: selectedEvent.value.Naziv_dogadaja   
    };

    const response = await axios.post('http://localhost:8000/', payload);
    console.log('Message sent:', response.data);

    upit.value = '';
    selectedEvent.value = null;
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
    

app.use(cors())
app.use(express.json()) 

app.post('/', (req, res) => {
  const { question, eventId, eventName } = req.body;

  if (!question || !eventId || !eventName) {
    return res.status(400).json({ error: 'Pitanje i događaj su obavezni' });
  }

  const sql = `INSERT INTO Pitanje_za_dogadaj (Sadrzaj_pitanja, ID_korisnika, ID_dogadaja, Naziv_dogadaja) VALUES (?, ?, ?, ?)`;


  const values = [question, null, eventId, eventName]; 

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: 'Greška pri spremanju u bazu' });
    }

    res.json({ status: 'success', insertedId: result.insertId });
  });
});

app.get('/questions', (req, res) => {
  const { eventId } = req.query;

  let sql = `SELECT ID_pitanja, Sadrzaj_pitanja, ID_dogadaja, Naziv_dogadaja FROM Pitanje_za_dogadaj`;

  const params = [];

  if (eventId) {
    sql += ' WHERE ID_dogadaja = ? ';
    params.push(eventId);
  }

  sql += ' ORDER BY ID_pitanja DESC ';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Database read error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})


