module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const tokenRes = await fetch('https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials&client_id=PAR_altertrack_a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5&client_secret=demo&scope=api_offresdemploiv2'
    });

    const { radius } = req.query;
    const rad = radius || '20';

    const searchRes = await fetch(
      `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?motsCles=chef+de+projet+digital+alternance&commune=95088&rayon=${rad}&typeContrat=CIE,CA&range=0-49`,
      { headers: { 'Accept': 'application/json' } }
    );

    if (!searchRes.ok) throw new Error(`France Travail: ${searchRes.status}`);
    const data = await searchRes.json();
    return res.status(200).json({ source: 'francetravail', data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};