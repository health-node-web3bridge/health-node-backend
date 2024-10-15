const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/predict', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:5000/predict', {
            features: req.body.features
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error predicting liver cirrhosis');
    }
});

app.get('/api/health-history', (req, res) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'health_data.csv'))
        .pipe(csv())
        .on('data', (data) => {
            // In a real app, you'd filter by the authenticated user's ID
            if (data.userId === 'testUser123') {
                results.push(data);
            }
        })
        .on('end', () => {
            res.json(results);
        })
        .on('error', (error) => {
            console.error('Error reading CSV:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
