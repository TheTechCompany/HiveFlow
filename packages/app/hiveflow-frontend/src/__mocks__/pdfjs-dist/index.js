// Re-export real pdfjs-dist for react-pdf compatibility in single-spa
// Bypass webpack alias by using a relative path to the real node_modules
// eslint-disable-next-line
const pdfjs = eval('require')('pdfjs-dist/build/pdf.js');
module.exports = pdfjs;
