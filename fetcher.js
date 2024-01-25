const fs = require('fs');
const request = require('request');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// fetch a url and downloads its content
const fetcher = (url, pathFile) => {
  // request the url provided
  request(url, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log(`Error: ${error}`);
    }

    // checks if the file already exist
    fs.access(pathFile, fs.constants.W_OK, (err) => {
      // file does exists
      if (!err) {
        rl.question(`File ${pathFile} already exist. Do you want to overwrite it? (Y/N) `, (answer) => {
          if (answer.toLowerCase() !== 'y') {
            console.log(`Canceled.`);
            rl.close();
            return;
          }

          fs.writeFile(pathFile, body, (writeErr) => {
            if (writeErr) {
              console.error(`Error writing to the file: ${error}`);
            } else {
              // used for getting the filesize
              fs.stat(pathFile, (statErr, stats) => {
                if (statErr) {
                  console.error(`Error getting file stats: ${statErr}`);
                  return;
                }
                
                const fileSize = stats.size;
                console.log(`Downloaded and saved ${fileSize} bytes to ${pathFile}`);
                rl.close();
              });
            }
          });
        });
      } else {
        // file does not exists
        fs.writeFile(pathFile, body, (writeErr) => {
          if (writeErr) {
            console.error(`Error writing to the file: ${error}`);
            process.exit(1);
          }
          // used for getting the filesize
          fs.stat(pathFile, (statErr, stats) => {
            if (statErr) {
              console.error(`Error getting file stats: ${statErr}`);
              return;
            }
            const fileSize = stats.size;
            console.log(`Downloaded and saved ${fileSize} bytes to ${pathFile}`);
            rl.close();
          });
        });
      }
    });
  });
};

const url = 'http://www.example.edu/';
const pathFile = './index.html';
fetcher(url, pathFile);