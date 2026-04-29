// api/jobs.js — Vercel Serverless Function
// Proxy vers l'API La Bonne Alternance pour éviter les erreurs CORS

export default async function handler(req, res) {
  // Autoriser les requêtes depuis n'importe quelle origine (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { latitude, longitude, radius, romes } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'latitude et longitude sont requis' });
  }

  try {
    // Construction de l'URL vers l'API officielle
    const romesParam = romes
      ? romes.split(',').map(r => `romes=${r.trim()}`).join('&')
      : 'romes=M1705&romes=M1706&romes=M1803&romes=M1402';

    const apiUrl = `https://labonnealternance.apprentissage.beta.gouv.fr/api/v2/jobs/search?${romesParam}&latitude=${latitude}&longitude=${longitude}&radius=${radius || 20}&target_diploma_level=5`;

    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`API répondu avec ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Erreur proxy LBA:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
