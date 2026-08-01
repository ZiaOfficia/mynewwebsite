/* HiBrands — Google Apps Script web app
   Receives form submissions from the site and appends them to Google Sheets.

   formType values sent by the site:
     'getStarted' → BookingModal    → "Get Started" sheet
     'enquiry'    → EnquirePanel    → "Enquiry" sheet
     'contact'    → ContactPage     → "Contact" sheet   (default)
*/

const FORMS = {
  getStarted: {
    sheetName: 'Get Started',
    headers: ['Timestamp', 'Preferred Time', 'Full Name', 'Phone Number', 'Email'],
    row: (d) => [
      new Date(),
      d.freeTime || '',
      d.fullName || '',
      d.phone    || '',
      d.email    || '',
    ],
  },

  enquiry: {
    sheetName: 'Enquiry',
    headers: ['Timestamp', 'Full Name', 'Email', 'Phone', 'Service', 'Budget', 'Timeline', 'Message'],
    row: (d) => [
      new Date(),
      d.fullName || '',
      d.email    || '',
      d.phone    || '',
      d.service  || '',
      d.budget   || '',
      d.timeline || '',
      d.message  || '',
    ],
  },

  contact: {
    sheetName: 'Contact',
    headers: ['Timestamp', 'Full Name', 'Email', 'Phone', 'Company', 'Service', 'Monthly Budget', 'Message'],
    row: (d) => [
      new Date(),
      d.fullName || '',
      d.email    || '',
      d.phone    || '',
      d.company  || '',
      d.service  || '',
      d.budget   || '',
      d.message  || '',
    ],
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);

    const ss   = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);

    const form = FORMS[data.formType] || FORMS.contact;

    let sheet = ss.getSheetByName(form.sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(form.sheetName);
      sheet.appendRow(form.headers);
      sheet.getRange(1, 1, 1, form.headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    } else if (sheet.getLastRow() === 0) {
      /* Sheet exists but is empty (e.g. created by hand) — add the headers */
      sheet.appendRow(form.headers);
      sheet.getRange(1, 1, 1, form.headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(form.row(data));

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: true,
          message: 'Form submitted successfully.'
        })
      )
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          message: err.toString()
        })
      )
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
