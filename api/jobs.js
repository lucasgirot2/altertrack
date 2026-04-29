module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ⬇️ REMPLACE ICI avec tes vraies clés France Travail
  const CLIENT_ID = 'PAR_altertrack_aa4922c1549db67b92b4305c82fac9e804ccbb79908fa054abc9b0f529d1c995';
  const CLIENT_SECRET = 'd779d51244a1725524e56b6c531d52930b9f613735758317912e02fafba5b376';
  // ⬆️ NE PARTAGE JAMAIS CES VALEURS

  const { radius } = req.query;
  const rad = radius || '20';

  try {
    const tokenRes = await fetch(
      'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=api_offresdemploiv2`
      }
    );

    if (!tokenRes.ok) throw new Error(`Token error: ${tokenRes.status}`);
    const { access_token } = await tokenRes.json();

    const searchRes = await fetch(
      `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?motsCles=chef+de+projet+digital+alternance&commune=95088&rayon=${rad}&typeContrat=CIE,CA&range=0-49`,
      { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${access_token}` } }
    );

    if (!searchRes.ok) throw new Error(`Search error: ${searchRes.status}`);
    const data = await searchRes.json();
    return res.status(200).json({ source: 'francetravail', data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};