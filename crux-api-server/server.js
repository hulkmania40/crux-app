import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3001;
const apiKey = 'AIzaSyCEhMOt4oW1Pe5uAxLO-ZKzGWWWkb8ZRM0';

app.use(cors());
app.use(bodyParser.json());

app.post('/api/query', async (req, res) => {
  const requestBody = req.body;
  const endpointUrl = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';

  try {
    const response = await fetch(`${endpointUrl}?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error.message);
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
