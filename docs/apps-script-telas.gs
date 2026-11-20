/**
 * SIMO · Recibir en la hoja "ASISTENCIA TALLERES SIMO" las telas elegidas en la web (telas.html).
 *
 * CÓMO SE INSTALA (una sola vez):
 * 1. En el Apps Script de la hoja (Extensiones > Apps Script), pega TODO este bloque al final
 *    del archivo Código.gs, debajo de lo que ya hay. Usa HOJA_ID, PESTANA_TELAS, ZONA,
 *    TELAS_VALIDAS, pestanaTelas() y sinFormula() que ya tienes ahí.
 * 2. Configuración del proyecto (rueda dentada) > Propiedades del script > Añadir:
 *       TELAS_SECRETO = una palabra larga inventada (la misma que pondrás en Netlify).
 * 3. Implementar > Gestionar implementaciones > lápiz > Versión: "Nueva versión" > Implementar.
 *    La URL /exec no cambia.
 * 4. En Netlify (Site configuration > Environment variables):
 *       TELAS_SHEET_URL    = la URL /exec de este Apps Script
 *       TELAS_SHEET_SECRET = la misma palabra que TELAS_SECRETO
 *
 * IMPORTANTE (20/11/2026): la web llama «Roja oscura» a la que antes era «Rosa oscura».
 * En TELAS_VALIDAS añade 'Roja oscura' (puedes dejar también 'Rosa oscura' para la página antigua):
 *   const TELAS_VALIDAS = ['Negra', 'Turquesa', 'Marrón', 'Beige', 'Rosa oscura', 'Roja oscura', 'Plateada',
 *     'Serpiente dorada', 'Serpiente', 'Vaca'];
 *
 * QUÉ HACE: la web (después de comprobar el pago en Stripe) envía las telas y aquí se escribe
 * una fila por bolso en la pestaña TELAS, con las mismas columnas que la página antigua
 * (Fecha de respuesta, Taller, Nombre, Email, Tapa, Base, Comentario) y cuatro más al final:
 * Tipo de taller, Horario, Origen ("web") e ID de pago.
 */
function doPost(e) {
  let d;
  try { d = JSON.parse((e && e.postData && e.postData.contents) || '{}'); }
  catch (err) { return respuestaJson({ ok: false, error: 'JSON' }); }

  const secreto = PropertiesService.getScriptProperties().getProperty('TELAS_SECRETO') || '';
  if (!secreto || d.secreto !== secreto) return respuestaJson({ ok: false, error: 'NO_AUTORIZADO' });

  const taller = String(d.taller || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(taller)) return respuestaJson({ ok: false, error: 'TALLER' });
  const bolsos = Array.isArray(d.bolsos) ? d.bolsos : [];
  if (!bolsos.length) return respuestaJson({ ok: false, error: 'SIN_BOLSOS' });
  for (let i = 0; i < bolsos.length; i++) {
    if (TELAS_VALIDAS.indexOf(String(bolsos[i].tapa)) === -1 || TELAS_VALIDAS.indexOf(String(bolsos[i].base)) === -1) {
      return respuestaJson({ ok: false, error: 'TELAS' });
    }
  }

  const corto = function (v, n) { return sinFormula(String(v == null ? '' : v).trim().slice(0, n)); };
  const fechaTaller = Utilities.parseDate(taller, ZONA, 'yyyy-MM-dd');
  const total = bolsos.length;

  const bloqueo = LockService.getScriptLock();
  bloqueo.waitLock(10000);
  try {
    const hoja = pestanaTelas();
    // Cabeceras de las columnas nuevas (H a K), solo si están vacías.
    const cab = hoja.getRange(1, 8, 1, 4);
    if (cab.getValues()[0].join('') === '') cab.setValues([['Tipo de taller', 'Horario', 'Origen', 'ID de pago']]);

    bolsos.forEach(function (b, i) {
      const notas = corto(b.notas, 1000);
      const comentario = total > 1 ? ('Bolso ' + (i + 1) + ' de ' + total + (notas ? ' · ' + notas : '')) : notas;
      hoja.appendRow([
        new Date(),
        fechaTaller,
        corto(d.nombre, 80),
        corto(d.email, 120),
        String(b.tapa),
        String(b.base),
        comentario,
        corto(d.modalidad, 40),
        corto(d.horario, 20),
        'web',
        corto(d.pago, 60)
      ]);
    });
  } finally {
    bloqueo.releaseLock();
  }
  return respuestaJson({ ok: true });
}

function respuestaJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
