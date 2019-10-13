'use strict';

var handleResponse = function handleResponse(xhr, parseResponse) {
  var content = document.querySelector('#content');
  switch (xhr.status) {
    case 200:
      //if success
      content.innerHTML = '<b>Success</b>';
      break;
    case 201:
      //if created
      content.innerHTML = '<b>Created</b>';
      break;
    case 204:
      //if data updated
      content.innerHTML = '<b>Updated</b>';
      break;
    case 400:
      //if bad request
      content.innerHTML = '<b>Bad Request</b>';
      break;
    case 404:
      //if not found
      content.innerHTML = '<b>Resource Not Found</b>';
      break;
    default:
      //any other status
      content.innerHTML = 'Error code not implemented by client.';
      break;
  }

  if (parseResponse) {
    var obj = JSON.parse(xhr.response);

    var keys = Object.keys(obj);

    //flexbox for search results?
    var divV = document.createElement('div');
    divV.setAttribute("class", "teamsearch");
    content.appendChild(divV);

    //if searched picked up anything
    if (0 < keys.length && obj[keys[0]].name != undefined) {
      for (var i = 0; i < keys.length; i++) {
        if (keys[i]) {

          var div = document.createElement('div');
          div.setAttribute("id", "returnedTeam");
          var h1 = document.createElement('h1');
          var p1 = document.createElement('p');
          var p2 = document.createElement('p');
          var p3 = document.createElement('p');
          var p4 = document.createElement('p');
          var p5 = document.createElement('p');
          var p6 = document.createElement('p');

          h1.innerHTML = obj[keys[i]].name;
          p1.innerHTML = obj[keys[i]].pokemon1;
          p2.innerHTML = obj[keys[i]].pokemon2;
          p3.innerHTML = obj[keys[i]].pokemon3;
          p4.innerHTML = obj[keys[i]].pokemon4;
          p5.innerHTML = obj[keys[i]].pokemon5;
          p6.innerHTML = obj[keys[i]].pokemon6;

          divV.appendChild(div);
          div.appendChild(h1);
          div.appendChild(p1);
          div.appendChild(p2);
          div.appendChild(p3);
          div.appendChild(p4);
          div.appendChild(p5);
          div.appendChild(p6);
        }
      }
    }

    //if message in response, add to screen
    if (obj.message) {
      var p = document.createElement('p');
      p.textContent = 'Message: ' + obj.message;
      content.appendChild(p);
    }

    //if users in response, add to screen
    if (obj.users) {
      var userList = document.createElement('p');
      var users = JSON.stringify(obj.users);
      userList.textContent = users;
      content.appendChild(userList);
    }
  } else {
    content.innerHTML += '<p>Meta Data Recieved</p>';
  }
};

var requestUpdate = function requestUpdate(e, userForm) {
  //const url = userForm.querySelector('#urlField').value;
  //change to head to perform a head request instead
  var method = 'get';

  var xhr = new XMLHttpRequest();
  var url = '/getUsers?=' + userForm.querySelector('#searchField').value;
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  if (method == 'get') {
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
  } else {
    xhr.onload = function () {
      return handleResponse(xhr, false);
    };
  }

  xhr.send();
  e.preventDefault();
  return false;
};

//function to send our post request
var sendPost = function sendPost(e, nameForm) {
  var nameAction = nameForm.getAttribute('action');
  var nameMethod = nameForm.getAttribute('method');

  var nameField = nameForm.querySelector('#nameField');
  var pokeField1 = nameForm.querySelector('#pokeField1');
  var pokeField2 = nameForm.querySelector('#pokeField2');
  var pokeField3 = nameForm.querySelector('#pokeField3');
  var pokeField4 = nameForm.querySelector('#pokeField4');
  var pokeField5 = nameForm.querySelector('#pokeField5');
  var pokeField6 = nameForm.querySelector('#pokeField6');

  // create new Ajax request
  var xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);

  // set headers and set onload to handle response
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = function () {
    return handleResponse(xhr, true);
  };

  // build x-www-form-urlencoded formatted teamname/pokemon1/pokemon2...
  var formData = 'name=' + nameField.value + '&pokemon1=' + pokeField1.value + '\n    &pokemon2=' + pokeField2.value + '&pokemon3=' + pokeField3.value + '\n    &pokemon4=' + pokeField4.value + '&pokemon5=' + pokeField5.value + '\n    &pokemon6=' + pokeField6.value;

  xhr.send(formData);
  e.preventDefault();
  return false;
};

var init = function init() {
  var userForm = document.querySelector('#userForm');
  var getUsers = function getUsers(e) {
    return requestUpdate(e, userForm);
  };

  var nameForm = document.querySelector('#nameForm');
  var addUser = function addUser(e) {
    return sendPost(e, nameForm);
  };

  userForm.addEventListener('submit', getUsers);
  nameForm.addEventListener('submit', addUser);
};
window.onload = init;
