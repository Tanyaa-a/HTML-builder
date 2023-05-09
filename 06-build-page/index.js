const fs = require('fs').promises;
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const outputDir = path.join(__dirname, 'project-dist');

async function createDirectoryIfNotExists(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir);
    }
}

async function copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDirectory(srcPath, destPath) :
            await fs.copyFile(srcPath, destPath);
    }
}

async function buildProject() {
    try {
        await createDirectoryIfNotExists(outputDir);

        // Замена шаблонных тегов 
        const template = await fs.readFile(templatePath, 'utf-8');
        const componentFiles = await fs.readdir(componentsDir);
        let newHtml = template;

        for (let file of componentFiles) {
            const filePath = path.join(componentsDir, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');

            newHtml = newHtml.replace(`{{${path.basename(file, '.html')}}}`, fileContent);
        }

        await fs.writeFile(path.join(outputDir, 'index.html'), newHtml);

        // Сборка стилей в единый файл
        const styleFiles = await fs.readdir(stylesDir);
        const styles = [];

        for (let file of styleFiles) {
            const filePath = path.join(stylesDir, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');

            styles.push(fileContent);
        }

        await fs.writeFile(path.join(outputDir, 'style.css'), styles.join('\n'));

        // Копирование папки assets
        await copyDirectory(assetsDir, path.join(outputDir, 'assets'));

        console.log('Проект успешно собран');
    } catch (err) {
        console.error(`Ошибка сборки проекта: ${err}`);
    }
}

buildProject();
