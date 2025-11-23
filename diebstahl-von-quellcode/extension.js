const vscode = require('vscode');
const fs = require('fs');
const http = require('http');
const path = require('path');
const admz = require('adm-zip');


  /*
Diese Funktion wird aktiviert, wenn ein Quellcode in Python, C, PHP oder JavaScript gespeichert wird.
  */
function activate(context) {

  // Es wird auf das Event onDidChangeTextDocument gewartet.
  let disposable = vscode.workspace.onDidSaveTextDocument((savedsource) => {

    // Überprüfung der Programmiersprache
    if (savedsource.languageId !== "python" && savedsource.languageId !== "c" && savedsource.languageId !== "php" && savedsource.languageId !== "javascript") {
        console.error("is not source-code")
        return  
    }
  
    
    try {

        // Pfad für den gespeicherten Quellcode
        const Folderpath = path.dirname(savedsource.uri.fsPath)

        // Name des Verzeichnis
        const foldername=path.basename(Folderpath)

        // Zipfile aus dem Verzeichniss erzeugen
        const zip_file = createZip(Folderpath);

        // Zipfile an den Server schicken
        sendZipToServer(zip_file,foldername);
    } 
    catch (error) {
        console.error('Error occurred: ' + error.message);
    }

  });

  // Diese Zeile (Nummer 44) wurde bereits von der Erweiterung nach der Erstellung zur Verfügung gestellt.
  context.subscriptions.push(disposable);
}


/*
Zip-Datei aus dem Verzeichnis des gespeicherten Quellcodes erzeugen.
*/
function createZip(Folderpath) {
  try {

    // leere Zip-Datei erzeugen
    const zp = new admz();

    // Inhalt des Verzeichnisses in die Zip-Datei einfügen    
    addFilesToZip(zp, Folderpath);

    return zp;
  } 
  catch (error) {
    console.error('Error creating zip file: ' + error.message);
    return null;
  }
}
/**
* Diese Funktion fügt den Inhalt des Verzeichnisses in die Zip-Datei ein.
 * 
 */
function addFilesToZip(zip, Folderpath) {

  // Das Verzeichniss wird gelesen.
  const items = fs.readdirSync(Folderpath);

  // jede Elemnt in der Verzeichniss wird in der Zipd-Datei eingefügt.
  items.forEach(item => {
      const itemPath = path.join(Folderpath, item);

      // wenn das Elemnt eine Unterordner dann einfügen.
      if(fs.statSync(path.join(Folderpath, item)).isDirectory()) {
         zip.addLocalFolder(path.resolve(Folderpath, item), item)
       } 

       // wenn nicht
       else {
         zip.addLocalFile(itemPath)
       }
  });
}

/*
Die Zipdatei an der Server schicken
*/
function sendZipToServer(zip_file,foldername) {
  try {

    // Optionen für die Http-Anfrage
    //Die Art und Weise für diese Options(zeile 100) wird https://www.memberstack.com/blog/node-http-request verwendet.
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/download',
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${foldername}.zip`,
        'Content-Length': zip_file.toBuffer().length
      }
    };

    // Http POST request erstellen
    const req = http.request(options, res => {


      //übernommen(Zeile 117-126) von https://www.memberstack.com/blog/node-http-request
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('Server response:', data);
      });
    });

    // Ab hier von mir geschriben
    req.on('error', error => {
      console.error('Error:', error.message);
    });

    req.on('timeout', () => {
      console.error('Request timed out.');
    });

    req.on('close', () => {
      console.log('Request closed.');
    });

    // Die Zip-Datei als einem Buffer an den Server schicken
    req.write(zip_file.toBuffer());
    console.log("file sent")
    req.end();
  } 
  catch (error) {
    console.error('Error sending zip file to server: ' + error.message);
  }
}

/**
* Diese wurde nach der Erstellung der Erweiterung zur Verfügung gestellt.
 */
module.exports = {
	activate
}
