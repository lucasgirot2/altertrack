module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const rad = req.query.radius || '20';

  try {
    const CLIENT_ID = process.env.FT_CLIENT_ID;
    const CLIENT_SECRET = process.env.FT_CLIENT_SECRET;

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('scope', 'api_offresdemploiv2');

    const tokenRes = await fetch(
      'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire',
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params }
    );

    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      throw new Error(`Token ${tokenRes.status}: ${txt}`);
    }

    const { access_token } = await tokenRes.json();

    const keywords = ['chef de projet digital', 'chef de projet IA', 'product owner', 'automatisation'];
    const allJobs = [];

    const results = await Promise.all(
  keywords.map(kw =>
    fetch(`https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?motsCles=${encodeURIComponent(kw)}&departement=75,92,93,94,95,78,91,77&range=0-14`, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${access_token}` }
    }).then(r => r.ok ? r.json() : { resultats: [] }).catch(() => ({ resultats: [] }))
  )
);

results.forEach(d => { if (d.resultats) allJobs.push(...d.resultats); });

    const unique = Array.from(new Map(allJobs.map(j => [j.id, j])).values());
    return res.status(200).json({ source: 'francetravail', resultats: unique });

  } catch (err) {
    console.error('Erreur:', err.message);
    return res.status(500).json({ error: err.message });
  }
};