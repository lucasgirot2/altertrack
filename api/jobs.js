const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { latitude, longitude, radius, romes } = req.query;

  const lat = latitude || '48.9224';
  const lng = longitude || '2.2121';
  const rad = radius || '20';
  const romesParam = romes
    ? romes.split(',').map(r => `romes=${r.trim()}`).join('&')
    : 'romes=M1705&romes=M1706&romes=M1803&romes=M1402';

  const apiUrl = `https://labonnealternance.apprentissage.beta.gouv.fr/api/v2/jobs/search?${romesParam}&latitude=${lat}&longitude=${lng}&radius=${rad}&target_diploma_level=5`;

  try {
    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `API error ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Erreur:', error.message);
    return res.status(500).json({ error: error.message });
  }
};