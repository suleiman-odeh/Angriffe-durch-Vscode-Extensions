const { execSync } = require('child_process');
const path = require('path');


/**
 *   Hier wird execsync beim Aktivieren der Extension aufgerufen, 
 * sodass der Windows Taschenrechner automatisch gestartet wird.
 */
function activate() {

    // Pfad für den Taschenrechner normalisieren
    const calcPath = path.normalize("C:\\Windows\\System32");
    try {
        // Der Taschenrechner starten
        execSync("start calc.exe", { cwd: calcPath});
        console.log("Prozess gestartet");
    } catch (err) {
        console.error("Fehler beim Starten des Prozesses: " + err);
    }
}

/**
 * Diese wurde bereits bei der Erstellung der Erweiterung zur Verfügung gestellt.
 */
module.exports = {
    activate
}
