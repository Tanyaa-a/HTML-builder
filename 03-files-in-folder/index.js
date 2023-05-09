const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  console.log('\nFiles in secret-folder:');
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(secretFolderPath, file.name);
        const fileExtension = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, `.${fileExtension}`);

        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            const fileSize = (stats.size / 1024).toFixed(3);
            console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
          }
        });
      }
    });
  }
});
