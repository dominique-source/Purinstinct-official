/**
 * PürInstinct — Guide interactif → Google Sheets
 * ================================================
 * Crée un onglet "Guide - Débloquages" dans ton Google Sheet.
 * Chaque ligne = un déblocage ou un téléchargement PDF.
 *
 * SETUP :
 * 1. Ouvre ton Google Sheet existant (ou crée-en un nouveau)
 * 2. Extensions → Apps Script → coller ce code
 * 3. Deploy → New deployment → Web app
 *    Execute as: Me  /  Who has access: Anyone
 * 4. Copier l'URL /exec → mettre dans .env.local :
 *    NEXT_PUBLIC_GUIDE_SHEET_ENDPOINT=https://script.google.com/macros/s/...../exec
 *
 * Colonnes créées automatiquement :
 *   Date | Prénom | Email | Langue interface | PDF voulu | PDF téléchargé | Source
 */

var GUIDE_SHEET = "Guide - Débloquages";
var GUIDE_HEADERS = ["Date", "Prénom", "Email", "Langue interface", "PDF voulu", "PDF téléchargé", "Source"];

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    var sheet = ss.getSheetByName(GUIDE_SHEET) || ss.insertSheet(GUIDE_SHEET);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(GUIDE_HEADERS);
      sheet.getRange(1, 1, 1, GUIDE_HEADERS.length)
           .setFontWeight("bold").setBackground("#CCFF00").setFontColor("#0A0A0A");
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 160);
      sheet.setColumnWidth(3, 220);
    }

    sheet.appendRow([
      new Date(),
      data.name        || "",
      data.email       || "",
      data.lang        || "",
      data.wantPdf     || "",
      data.pdfLang     || "",
      data.source      || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("PurInstinct Guide endpoint OK");
}
