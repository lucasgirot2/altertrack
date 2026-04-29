module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const CLIENT_ID = 'TON_CLIENT_ID';
  const CLIENT_SECRET = 'TA_CLE_SECRETE';
  const rad = req.query.radius || '20';

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('scope', 'api_offresdemploiv2');

    const tokenRes = await fetch(
      'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire',
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params }
    );

    if (!tokenRes.ok) throw new Error(`Token ${tokenRes.status}`);
    const { access_token } = await tokenRes.json();

    const searchRes = await fetch(
      `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?motsCles=chef+de+projet+digital&commune=95088&rayon=${rad}&typeContrat=CIE,CA&range=0-49`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }
    );

    if (!searchRes.ok) {
      const txt = await searchRes.text();
      throw new Error(`Search ${searchRes.status}: ${txt}`);
    }

    const data = await searchRes.json();
    return res.status(200).json({ source: 'francetravail', data });

  } catch (err) {
    console.error('Erreur:', err.message);
    return res.status(500).json({ error: err.message });
  }
};