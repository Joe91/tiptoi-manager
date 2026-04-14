const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const language = req.query.language || 'de_DE';
    const response = await axios.get(`https://ttapiv2.ravensburger.com/api/v2/catalog/${language}`, {
      headers: {
        'Authorization': 'Bearer ' + await getToken(),
        'User-Agent': 'tiptoi-manager/1.0'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Catalog API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch catalog' });
  }
};

async function getToken() {
  try {
    const response = await axios.post('https://oauth.ravensburger.com/oauth/token', {
      grant_type: 'client_credentials'
    }, {
      auth: {
        username: 'tiptoi-manager-v2',
        password: 'CYmWkYyhY3traWuGd5cHcNV'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to get access token');
  }
}