const users = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};


const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};


const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  respondJSON(request, response, 200, responseJSON);
};


const getUsersMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};


const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Team Name and 6 Pokemon are required',
  };

  if (!body.name || !body.pokemon1 || !body.pokemon2 || !body.pokemon3 || !body.pokemon4 || !body.pokemon5 || !body.pokemon6) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  //check for duplicate team names
  let i;
  for(i = 0; i < users.length; i++){
    if (users[i].name === users[body.name].name) {
      responseJSON.id = 'missingParams duplicate name';
      return respondJSON(request, response, 400, responseJSON);
    }
  }
  

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].pokemon1 = body.pokemon1;
  users[body.name].pokemon2 = body.pokemon2;
  users[body.name].pokemon3 = body.pokemon3;
  users[body.name].pokemon4 = body.pokemon4;
  users[body.name].pokemon5 = body.pokemon5;
  users[body.name].pokemon6 = body.pokemon6;

  if (responseCode === 201) {
    responseJSON.message = 'Team Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};


const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};


const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};


module.exports = {
  getUsersMeta,
  notFoundMeta,
  getUsers,
  addUser,
  notFound,
};
