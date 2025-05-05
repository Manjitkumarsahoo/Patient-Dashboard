const express = require('express');
const cors = require('cors');
const { getData, saveData } = require('./data');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Authentication endpoints
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const data = getData();
  
  const user = data.users.find(u => 
    u.username === username && u.password === password
  );
  
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Dashboard data endpoints
app.get('/api/dashboard/:userId', (req, res) => {
  const { userId } = req.params;
  const data = getData();
  
  const user = data.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const weightEntries = data.weightEntries.filter(e => e.userId === userId);
  const shipments = data.shipments.filter(s => s.userId === userId);
  
  res.json({
    user,
    weightEntries,
    shipments
  });
});

// Weight entry endpoints
app.post('/api/weight', (req, res) => {
  const { userId, date, weight } = req.body;
  const data = getData();
  
  const newEntry = {
    id: Date.now().toString(),
    userId,
    date,
    weight: Number(weight)
  };
  
  data.weightEntries.push(newEntry);
  saveData(data);
  
  res.json(newEntry);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});