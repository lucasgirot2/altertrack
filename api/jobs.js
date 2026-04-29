module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const CLIENT_ID = 'PAR_altertrack_aa4922c1549db67b92b4305c82fac9e804ccbb79908fa054abc9b0f529d1c995';
  const CLIENT_SECRET = 'd779d51244a1725524e56b6c531d52930b9f613735758317912e02fafba5b376';
  const rad = req.query.radius || '20';

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('scope', 'api_offresdemploiv2 application_PAR_altertrack_aa4922c1549db67b92b4305c82fac9e804ccbb79908fa054abc9b0f529d1c995');

    const tokenRes = await fetch(
      'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire',
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params }
    );

    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      throw new Error(`Token ${tokenRes.status}: ${txt}`);
    }

    const { access_token } = await tokenRes.json();

    const searchUrl = new URL('https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search');
    searchUrl.searchParams.set('motsCles', 'chef de projet digital alternance');
    searchUrl.searchParams.set('commune', '95088');
    searchUrl.searchParams.set('rayon', rad);
    searchUrl.searchParams.set('typeContrat', 'CIE,CA');
    searchUrl.searchParams.set('range', '0-49');

    const searchRes = await fetch(searchUrl.toString(), {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${access_token}` }
    });

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