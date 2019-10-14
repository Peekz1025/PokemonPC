const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// URL Struct to handle the responces
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
    '/getUsers': jsonHandler.getUsers,
    notFound: htmlHandler.notFound,
  },
  HEAD: {
    '/pokemon': jsonHandler.getPokemonMeta,
  },
  POST: {
    '/addUser': jsonHandler.addUser,
  },
};


// function to handle requests
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  // if trying to add a new team
  if (parsedUrl.pathname === '/addUser') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(request, res, bodyParams);
    });
  } else if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response, params);
  } else {
    // goes to 404 page if page not found
    urlStruct[request.method].notFound(request, response);
  }
};


http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
