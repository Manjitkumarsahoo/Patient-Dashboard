const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

// Initialize with sample data if file doesn't exist
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({
    users: [
      {
        id: '1',
        username: 'patient1',
        password: 'password123', // In real app, store hashed passwords
        name: 'John Doe',
        goalWeight: 180,
        currentWeight: 220,
        height: 72, // inches
        medication: 'Semaglutide',
        dosage: '0.5mg'
      }
    ],
    weightEntries: [
      { id: '1', userId: '1', date: '2023-01-01', weight: 220 },
      { id: '2', userId: '1', date: '2023-02-01', weight: 215 },
      { id: '3', userId: '1', date: '2023-03-01', weight: 210 }
    ],
    shipments: [
      {
        id: '1',
        userId: '1',
        medication: 'Semaglutide',
        dosage: '0.5mg',
        status: 'delivered',
        estimatedDelivery: '2023-03-15',
        actualDelivery: '2023-03-14'
      },
      {
        id: '2',
        userId: '1',
        medication: 'Semaglutide',
        dosage: '0.75mg',
        status: 'shipped',
        estimatedDelivery: '2023-04-15',
        trackingNumber: 'UPS123456789'
      }
    ]
  }, null, 2));
}

function getData() {
  return JSON.parse(fs.readFileSync(dataPath));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = { getData, saveData };