# Capture des courriels du guide → Google Sheet

La section « Le guide de jeu » envoie chaque courriel (avec la langue et la
date) à un Google Apps Script qui l'ajoute à un Google Sheet. Voici comment
le brancher en 5 minutes.

## 1. Créer le Google Sheet
1. Va sur https://sheets.new
2. Nomme-le « PurInstinct — Guides téléchargés »
3. Dans la ligne 1, mets les entêtes : `Date` | `Nom` | `Organisation` | `Courriel` | `Langue`

## 2. Ajouter le script
1. Menu **Extensions → Apps Script**
2. Efface tout, colle ce code :

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      new Date(data.date || new Date()),
      data.name || '',
      data.org || '',
      data.email || '',
      data.lang || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Enregistre** (icône disquette)

## 3. Déployer en Web App
1. Bouton **Déployer → Nouveau déploiement**
2. Type : **Application Web**
3. Exécuter en tant que : **Moi**
4. Qui a accès : **Tout le monde**
5. **Déployer**, autorise les permissions
6. Copie l'**URL de l'application Web** (se termine par `/exec`)

## 4. Donner l'URL au site
Donne-moi l'URL `/exec` — je l'ajoute comme variable d'environnement
`NEXT_PUBLIC_SHEET_ENDPOINT` sur Vercel. (Ou ajoute-la toi-même dans
Vercel → Settings → Environment Variables, puis redéploie.)

C'est tout. Chaque téléchargement ajoute une ligne au Sheet en temps réel.
