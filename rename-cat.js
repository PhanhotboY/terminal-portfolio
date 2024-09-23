const { readdir, rename, existsSync } = require('fs');
const { promisify } = require('util');

const readdirAsync = promisify(readdir);
const renameAsync = promisify(rename);

const arr = [];
async function renameCat() {
  const files = await readdirAsync('./public/cats');
  console.log(files.length);

  let index = 0;
  for (const file of files) {
    let newFileName = `./public/cats/cat_${index}.jpeg`;

    // Ensure no overwriting by checking if the file already exists
    while (existsSync(newFileName)) {
      index++; // Increment index if the file exists
      newFileName = `./public/cats/cat_${index}.jpeg`;
    }

    const oldFileName = `./public/cats/${file}`;

    try {
      await renameAsync(oldFileName, newFileName);
      arr[index] = index;
      index++;
    } catch (error) {
      console.error(`Error renaming file ${file}:`, error);
    }
  }

  if (arr.length === files.length) {
    console.log('done');
  }
}

renameCat();
