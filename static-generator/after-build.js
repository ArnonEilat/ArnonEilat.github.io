const minify = require('html-minifier').minify;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const CleanCSS = require('clean-css');

const log = (content) => console.log(chalk.blue('[build]'), content);
const readFile = (path) => fs.readFileSync(path, 'utf8');
const writeFile = (path, content) => fs.writeFileSync(path, content, 'utf8');

const minifyHtml = function (htmlInput) {
  if (typeof htmlInput !== 'string') {
    throw new TypeError("Bad arguments supply: 'htmlInput' should be string");
  }
  const options = {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  };

  const output = minify(htmlInput, options);
  return output;
};

log('Reading html content');
const indexHtmlPath = path.join(__dirname, '/../index.html');
const htmlContent = readFile(indexHtmlPath);
log('Minifying html');
const minifyedHtml = minifyHtml(htmlContent);
log('Writing html content to ' + indexHtmlPath);
writeFile(indexHtmlPath, minifyedHtml);

log('Removing unnecessary files');
const redundantfiles = [
  path.join(__dirname, '/../styles/bootstrap/.csscomb.json'),
  path.join(__dirname, '/../styles/bootstrap/.csslintrc'),
];
redundantfiles.forEach((filePath) => fs.unlink(filePath, () => {}));

const minifyCss = function minifyCss(path) {
  const cssContent = readFile(path);
  const output = new CleanCSS().minify(cssContent).styles;
  writeFile(path, output);
};

const cssFilesToClean = [
  path.join(__dirname, '/../styles/bootstrap/bootstrap.css'),
  path.join(__dirname, '/../styles/bootstrap/theme.css'),
  path.join(__dirname, '/../styles/print.css'),
  path.join(__dirname, '/../styles/style.css'),
];

log('Minifying css files');
cssFilesToClean.forEach((filePath) => minifyCss(filePath));
