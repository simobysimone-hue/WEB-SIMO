/**
 * SIMO · Recibir en la hoja de Google las telas elegidas en la web (telas.html).
 *
 * Se añade al Apps Script que ya tienes (el de "Elige tus telas") y se vuelve a implementar:
 *   Implementar → Gestionar implementaciones → editar → Nueva versión.
 * La URL /exec de esa implementación va en Netlify como TELAS_SHEET_URL,
 * y la palabra secreta (la misma que pongas abajo en Propiedades del script) como TELAS_SHEET_SECRET.
 *
 * Propiedades del script (Configuración del proyecto → Propiedades del script):
 *   TELAS_SECRETO = <la misma palabra que TELAS_SHEET_SECRET en Netlify>
 *
 * Escribe una fila por bolso en la pestaña "Telas web" (se crea sola si no existe).
 * PROVISIONAL: si tu script ya guarda en otra pestaña con otras columnas, pásame su código y lo adapto.
 */
function doPost(e) {
  var datos;
  try { datos = JSON.parse(e.postData.contents); } catch (err) { return respuesta({ ok: false, error: 'JSON' }); }

  var secreto = PropertiesService.getScriptProperties().getProperty('TELAS_SECRETO') || '';
  if (!secreto || datos.secreto !== secreto) return respuesta({ ok: false, error: 'NO_AUTORIZADO' });

  var hoja = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('HOJA_ID'));
  var pestana = hoja.getSheetByName('Telas web') || hoja.insertSheet('Telas web');
  if (pestana.getLastRow() === 0) {
    pestana.appendRow(['Recibido', 'Fecha taller', 'Taller', 'Horario', 'Nombre', 'Email', 'Bolso', 'Tapa', 'Base', 'Notas', 'ID pago']);
  }
  (datos.bolsos || []).forEach(function (b) {
    pestana.appendRow([new Date(), datos.taller, datos.modalidad, datos.horario, datos.nombre, datos.email,
      b.bolso, b.tapa, b.base, b.notas || '', datos.pago]);
  });
  return respuesta({ ok: true });
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
