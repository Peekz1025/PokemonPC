const users = {};

// handles JSON
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// JSON meta
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.end();
};

// used when searching through teams through the search button
const getUsers = (request, response, params) => {
  const returnTeams = {};
  // all the current teams
  const keys = Object.keys(users);

  // loops through the teams
  for (let i = 0; i < keys.length; i++) {
    // if the search bar had a pokemon
    if (users[keys[i]].pokemon1 === params[''] || users[keys[i]].pokemon2 === params['']
      || users[keys[i]].pokemon3 === params[''] || users[keys[i]].pokemon4 === params['']
      || users[keys[i]].pokemon5 === params[''] || users[keys[i]].pokemon6 === params['']) {
      returnTeams[keys[i]] = users[keys[i]];
    } else if (users[keys[i]].name === params['']) {
      // if the search bar had a team name
      returnTeams[keys[i]] = users[keys[i]];
    }
  }

  // if search bar had nothing, print out 10 teams
  const count = Object.keys(returnTeams).length;
  if (count === 0) {
    for (let i = 0; i < keys.length || i < 10; i++) {
      returnTeams[keys[i]] = users[keys[i]];
    }
  }
  // console.log(returnTeams);
  return respondJSON(request, response, 200, returnTeams);
};

// get meta
const getUsersMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};


// adds a team from the submit button
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Unique Team Name and 6 Pokemon are required',
  };

  // if something's missing, send the error message
  if (!body.name || !body.pokemon1 || !body.pokemon2 || !body.pokemon3
    || !body.pokemon4 || !body.pokemon5 || !body.pokemon6) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // check for duplicate team names
  if (users[body.name]) {
    responseJSON.id = 'Team Name has been used already. Please choose another name.';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  // adds new elements to object a name and 6 pokemon
  users[body.name].name = body.name;
  users[body.name].pokemon1 = body.pokemon1;
  users[body.name].pokemon2 = body.pokemon2;
  users[body.name].pokemon3 = body.pokemon3;
  users[body.name].pokemon4 = body.pokemon4;
  users[body.name].pokemon5 = body.pokemon5;
  users[body.name].pokemon6 = body.pokemon6;

  // prints success code
  if (responseCode === 201) {
    responseJSON.message = 'Team Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // returns data
  return respondJSONMeta(request, response, responseCode);
};

// page not found
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};


// not found meta
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
