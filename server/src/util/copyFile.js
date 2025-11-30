import fs from 'fs';

function copyFile(src, dest) {
  const readStrem = fs.createReadStream(src);
  readStrem.once('error', (err) => err);
  readStrem.once('end', () => {

  });
  readStrem.pipe(fs.createWriteStream(dest));
}

export default copyFile;
