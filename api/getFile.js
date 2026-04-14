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

  const url = req.query.url;

  if (!url) {
    res.status(400).send('ERROR: url not specified');
    return;
  }

  // Validate URL - allow ravensburger domains
  const validUrlRegex = /^https:\/\/(cdn\.)?ravensburger\.(cloud|de)\//;
  if (!validUrlRegex.test(url)) {
    res.status(400).send('ERROR: invalid url');
    return;
  }

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 30000,
      headers: {
        'User-Agent': 'tiptoi-manager/1.0'
      }
    });

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${url.split('/').pop()}"`);

    // Pipe the response
    response.data.pipe(res);
  } catch (error) {
    console.error('File download error:', error.message);
    res.status(500).send('Failed to fetch the .gme file');
  }
};