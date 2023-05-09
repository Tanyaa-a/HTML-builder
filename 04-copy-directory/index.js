const fs = require("fs");
const path = require("path");

const fsPromises = fs.promises;

async function copyRecursive(src, dest) {
  try {
    const stats = await fsPromises.stat(src);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
      await fsPromises.mkdir(dest, { recursive: true });
      const children = await fsPromises.readdir(src);
      for (const childItemName of children) {
        await copyRecursive(
          path.join(src, childItemName),
          path.join(dest, childItemName)
        );
      }
    } else {
      await fsPromises.copyFile(src, dest);
    }
  } catch (err) {
    console.error("Ошибка при копировании:", err);
  }
}


const src = path.join(__dirname, "files");
const dest = path.join(__dirname, "files-copy");
copyRecursive(src, dest).then(() => {
  console.log("Копирование завершено успешно");
});
