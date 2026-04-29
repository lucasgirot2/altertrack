# 🚀 Guide de déploiement — AlterTrack

## Ce que tu as dans ce dossier

```
altertrack/
├── api/
│   └── jobs.js          ← Backend (proxy vers La Bonne Alternance)
├── public/
│   └── index.html       ← Frontend (toute l'application)
├── vercel.json          ← Configuration Vercel
└── package.json         ← Infos du projet
```

---

## Étape 1 — Créer un compte Vercel (gratuit)

1. Va sur **https://vercel.com**
2. Clique **Sign Up**
3. Connecte-toi avec ton compte **GitHub** (le plus simple)

---

## Étape 2 — Installer les outils sur ton ordi

Ouvre un terminal (PowerShell sur Windows, Terminal sur Mac) et tape :

```bash
# Installer Node.js si pas déjà fait → https://nodejs.org (prends la version LTS)

# Installer Vercel CLI
npm install -g vercel
```

---

## Étape 3 — Mettre le projet sur GitHub

1. Va sur **https://github.com** → **New repository**
2. Nomme-le `altertrack` → **Create repository**
3. Dans ton terminal :

```bash
cd altertrack          # entre dans le dossier du projet
git init
git add .
git commit -m "AlterTrack v1 - tracker alternance"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/altertrack.git
git push -u origin main
```

---

## Étape 4 — Déployer sur Vercel

### Option A — Via l'interface web (recommandé)

1. Va sur **https://vercel.com/new**
2. Clique **Import Git Repository**
3. Sélectionne ton repo `altertrack`
4. Clique **Deploy** — c'est tout !

Vercel te donne une URL du type : `https://altertrack-xxx.vercel.app`

### Option B — Via le terminal

```bash
cd altertrack
vercel login        # se connecter à ton compte
vercel              # déployer (réponds aux questions)
```

---

## Étape 5 — Tester en local (avant de déployer)

```bash
cd altertrack
npm install -g vercel   # si pas encore fait
vercel dev              # lance le serveur local

# Ouvre http://localhost:3000 dans ton navigateur
```

---

## Résultat final

Ton app sera accessible à une URL publique, partageable avec des recruteurs.

**Ce que tu peux dire en entretien :**
> "J'ai développé une application web de tracking de candidatures qui consomme l'API officielle La Bonne Alternance, avec un backend serverless déployé sur Vercel pour gérer les contraintes CORS."

---

## Problèmes fréquents

| Problème | Solution |
|---|---|
| `vercel` non reconnu | Relance le terminal après `npm install -g vercel` |
| Erreur 500 sur `/api/jobs` | Vérifie les logs dans le dashboard Vercel |
| Aucune offre affichée | L'API LBA peut renvoyer 0 résultat selon les codes ROME — essaie d'augmenter le rayon |
| Page blanche | Inspecte la console du navigateur (F12) |

---

## Pour aller plus loin (V2)

- [ ] Ajouter un export Google Sheets via l'API Google
- [ ] Score de matching avec ton CV (Claude API)
- [ ] Génération de lettre de motivation automatique
- [ ] Notifications email de relance (via Resend ou Nodemailer)
