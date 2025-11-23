const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

/*
  Ein Server auf localhost:8000 wird gestartet, er wartet nur auf eine
  Client, dann holt er die Zip-Datei und speichert sie im Serververzeichnis unter downloads.
*/
const server = http.createServer((req, res) => {
  try {
    // Überprüfen der Art der ankommenden Anfrage
    if (req.method === 'POST' && req.url === '/download') {
      const contentDisposition = req.headers['content-disposition'];
      var fileName="s.zip"
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+)/);
        if (match && match[1]) {
          fileName = match[1].trim(); 
        }
      }

      // übernommen(Zeile 25-29) von https://blog.logrocket.com/5-ways-to-make-http-requests-in-node-js/
      const chunks = [];

      req.on('data', chunk => {
        chunks.push(chunk);
      });

      // Ab hier von mir geschrieben
      req.on('end', () => {
        try {
          const zipBuffer = Buffer.concat(chunks);

          const downloadsFolderPath = path.join(__dirname, 'downloads');
          if (!fs.existsSync(downloadsFolderPath)) {
            fs.mkdirSync(downloadsFolderPath);
          }

          const zipFilePath = path.join(downloadsFolderPath, fileName);

          fs.writeFileSync(zipFilePath, zipBuffer);

          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('File uploaded and saved.');
        } 
        catch (error) {
          console.error('Error writing file:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        }
      });
    } 
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } 
  catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.on('error', error => {
  console.error('Server error:', error);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



