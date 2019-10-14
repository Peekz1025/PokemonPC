const handleResponse = (xhr, parseResponse) => {
  const content = document.querySelector('#content');
  switch (xhr.status) {
    case 200: //if success
      content.innerHTML = `<b>Success</b>`;
      break;
    case 201: //if created
      content.innerHTML = '<b>Created</b>';
      break;
    case 204: //if data updated
      content.innerHTML = '<b>Updated</b>';
      break;
    case 400: //if bad request
      content.innerHTML = `<b>Bad Request</b>`;
      break;
    case 404: //if not found
      content.innerHTML = `<b>Resource Not Found</b>`;
      break;
    default: //any other status
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }

  //if response was sent
  if (parseResponse) {
    const obj = JSON.parse(xhr.response);

    let keys = Object.keys(obj);

    //flexbox for search results
    let divV = document.createElement('div');
    divV.setAttribute("class", "teamsearch");
    content.appendChild(divV);

    //if searched picked up anything
    if (0 < keys.length && obj[keys[0]].name != undefined) {
      for (let i = 0; i < keys.length; i++) {
        if (keys[i]) {

          //creates elements for all the teams and adds them to page
          let div = document.createElement('div');
          div.setAttribute("id", "returnedTeam");
          let h1 = document.createElement('h1');
          let p1 = document.createElement('p');
          let p2 = document.createElement('p');
          let p3 = document.createElement('p');
          let p4 = document.createElement('p');
          let p5 = document.createElement('p');
          let p6 = document.createElement('p');

          h1.innerHTML = obj[keys[i]].name
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
      const p = document.createElement('p');
      p.textContent = `Message: ${obj.message}`;
      content.appendChild(p);
    }

    //if users in response, add to screen
    if (obj.users) {
      const userList = document.createElement('p');
      const users = JSON.stringify(obj.users);
      userList.textContent = users;
      content.appendChild(userList);
    }
  } else {
    content.innerHTML += '<p>Meta Data Recieved</p>';
  }
};

const requestUpdate = (e, userForm) => {
  //change to head to perform a head request instead
  const method = 'get';

  const xhr = new XMLHttpRequest();
  const url = '/getUsers?=' + userForm.querySelector('#searchField').value;
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  if (method == 'get') {
    xhr.onload = () => handleResponse(xhr, true);
  } else {
    xhr.onload = () => handleResponse(xhr, false);
  }

  xhr.send();
  e.preventDefault();
  return false;
};

//function to send post request, used when adding teams
const sendPost = (e, nameForm) => {
  const nameAction = nameForm.getAttribute('action');
  const nameMethod = nameForm.getAttribute('method');

  const nameField = nameForm.querySelector('#nameField');
  const pokeField1 = nameForm.querySelector('#pokeField1');
  const pokeField2 = nameForm.querySelector('#pokeField2');
  const pokeField3 = nameForm.querySelector('#pokeField3');
  const pokeField4 = nameForm.querySelector('#pokeField4');
  const pokeField5 = nameForm.querySelector('#pokeField5');
  const pokeField6 = nameForm.querySelector('#pokeField6');

  // create new Ajax request
  const xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);

  // set headers and set onload to handle response
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = () => handleResponse(xhr, true);

  // build x-www-form-urlencoded formatted teamname/pokemon1/pokemon2...
  const formData = `name=${nameField.value}&pokemon1=${pokeField1.value}
    &pokemon2=${pokeField2.value}&pokemon3=${pokeField3.value}
    &pokemon4=${pokeField4.value}&pokemon5=${pokeField5.value}
    &pokemon6=${pokeField6.value}`;

  xhr.send(formData);
  e.preventDefault();
  return false;
};

//basic init function
const init = () => {
  const userForm = document.querySelector('#userForm');
  const getUsers = (e) => requestUpdate(e, userForm);

  const nameForm = document.querySelector('#nameForm');
  const addUser = (e) => sendPost(e, nameForm);

  userForm.addEventListener('submit', getUsers);
  nameForm.addEventListener('submit', addUser);
};
window.onload = init;
