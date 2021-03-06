const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const notFoundPage = fs.readFileSync(`${__dirname}/../hosted/404.html`);

// gets text
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// gets the css
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// bundle for es5 conversion
const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(bundle);
  response.end();
};

// page not found
const notFound = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(notFoundPage);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBundle,
  notFound,
};
