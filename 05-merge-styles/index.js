const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = 'bundle.css';

async function createDirectoryIfNotExists(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir);
    }
}

async function readStyles() {
    try {
        await createDirectoryIfNotExists(outputDir);

        const files = await fs.readdir(stylesDir, { withFileTypes: true });

        const stylePromises = files
            .filter(file => file.isFile() && path.extname(file.name) === '.css')
            .map(file => {
                const filePath = path.join(stylesDir, file.name);
                return fs.readFile(filePath, 'utf-8');
            });

        const styles = await Promise.all(stylePromises);

        await fs.writeFile(path.join(outputDir, outputFile), styles.join('\n'));

    } catch (err) {
        console.error(`Ошибка: ${err}`);
    }
}

readStyles();
