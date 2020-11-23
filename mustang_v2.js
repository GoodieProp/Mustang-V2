
var cURLArray = [];
var cArray = [];
var loadingContact = 0;
var currentContactIndex = 0; 

function initApp() {
    console.log("Initializing Mustang Application V2");
}

function viewCurrentContact() {
    currentContact = cArray[currentContactIndex];
    console.log(currentContact);
    document.getElementById("fnID").value = currentContact.firstName;   // first and last
    document.getElementById("lnID").value = currentContact.lastName;
    document.getElementById("eID").value = currentContact.email;   
    document.getElementById("cID").value = currentContact.city;   
    document.getElementById("sID").value = currentContact.state;
    document.getElementById("zcID").value = currentContact.zip;
    document.getElementById("fhID").value = currentContact.favoriteHobby;  // additional field 

    // Todo: Add additional fields.
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + cArray.length;
}

function updateContact() {
    console.log("Updating Contact!");
    currentContact = cArray[currentContactIndex];

    firstName = document.getElementById("fnID").value;
    lastName = document.getElementById("lnID").value;
    email = document.getElementById("eID").value;
    city = document.getElementById("cID").value;
    state = document.getElementById("sID").value;
    zip = document.getElementById("zcID").value;
    favoriteHobby = document.getElementById("fhID").value;

    var upContact = '{"firstName": "' + firstName + '", "lastName": "' + lastName 
    + '", "email": "' + email + '", "city": "' + city +'", "state": "' + state 
    +'", "zip": "' + zip + '", "favoriteHobby": "' + favoriteHobby +'"}';

    contact = JSON.parse(upContact);
    cArray[currentContactIndex] = contact;
    currentContactIndex = currentContactIndex;
    viewCurrentContact();
}

function previous() {
    if (currentContactIndex > 0) {
        currentContactIndex--;
    }
    currentContact = cArray[currentContactIndex];
    viewCurrentContact();

    document.getElementById("nextbtn").disabled = false;
    // Todo: Disable previous button when currentContactIndex equal to 0.
    // Todo: Save changed items to contacts array and resort array.
    
    if (currentContactIndex == 0) {
        document.getElementById("previousbtn").disabled = true;
    }
    
}

function next() {
    if (currentContactIndex < (cArray.length-1)) {
        currentContactIndex++;
    }
    currentContact = cArray[currentContactIndex];
    viewCurrentContact();
    
    document.getElementById("previousbtn").disabled = false;

    // Todo: Disable next button when there is no next item.
    // Todo: Save changed items to contacts array and resort array.
    if (currentContactIndex == cArray.length) {
        document.getElementById("nextbtn").disabled = true;
    }
}

function add() {
    console.log('add()');

    firstName = document.getElementById("fnID").value;
    lastName = document.getElementById("lnID").value;
    email = document.getElementById("eID").value;
    city = document.getElementById("cID").value;
    state = document.getElementById("sID").value;
    zip = document.getElementById("zcID").value;
    favoriteHobby = document.getElementById("fhID").value;

    // Todo: Implement add functionality by inserting new element into array.
    var newContact = '{"firstName": "' + firstName + '", "lastName": "' + lastName 
    + '", "email": "' + email + '", "city": "' + city +'", "state": "' + state 
    +'", "zip": "' + zip + '", "favoriteHobby": "' + favoriteHobby +'"}';
                    
    nContact = JSON.parse(newContact);
    cArray.push(nContact);
    currentContactIndex = cArray.length-1;

    console.log("Added New Contact to end of Array:");
    console.log(newContact);
}

function remove() {
    console.log('remove()');

    console.log(currentContact);
    // Todo: Implement delete functionality by deleting element from array.
    cArray.splice(currentContactIndex, 1); 
}

function zipBlurFunction() {
    getPlace();
}

function getPlace() {
    var zip = document.getElementById("zcID").value;
    console.log("Zip: " + zip);

    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();

    // Register the embedded handler function
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            if (document.getElementById("cID").value == "")
                document.getElementById("cID").value = place[0];
            if (document.getElementById("sID").value == "")
                document.getElementById("sID").value = place[1];
        }
    }
    xhr.open("GET", "getCityState.php?zip=" + zip);
    xhr.send(null);
}

function keyPressed() {
    console.log('keyPressed()');

    // This type of function should be useful in search as it implements keyPressed.
}


/**
 * Below is from Mustang V1
 */
async function loadIndex() {
    // Fetch API using async and await
    // await - waits until fetch is complete entirely
    // data - contains fetch data
    const response = await fetch("https://mustang-index.azurewebsites.net/index.json");
    const data = await response.json();

    // Code to display index on webpage
    let output = '<h2>Contacts</h2>';
    output += '<ol>';
    // parses through each json
    data.forEach(function (dataz) {
        output += `
            <li>
                <b>Name:</b>
                ${dataz.Name}
                <b>Email:</b>
                ${dataz.Email}
                <b>Contact URL:</b>
                ${dataz.ContactURL}
            </li>
            <br>
        `;
    });
    output += '</ul>'
    document.getElementById("loadIndex").innerHTML = output;

// Code to display index in console
console.log("Index JSON: ");
for (const d of data) {
    console.log(d);
    cURLArray.push(d.ContactURL);
}
// sends contacturlarray to display in console
console.log("ContactURLArray: " + JSON.stringify(cURLArray));
}

// function to go through contacturls
function loadContacts() {
    for (i = 0; i < cURLArray.length; i++) {
        loadNextContact(cURLArray[i]); 
    }
}

// displays contact urls on page
async function loadNextContact(URL) {
    const response = await fetch(URL);
    const data = await response.json();
    console.log("Name: " + data.firstName + " URL: " + URL);
    console.log(data);
    cArray.push(data);
    document.getElementById("contactsID").innerHTML += `<b>Name:</b> ${data.firstName} ${data.lastName} <b>Preferred Name:</b> ${data.preferredName} <b>Email:</b> ${data.email}<br>`;
    document.getElementById("statusID").innerHTML += `Status: Loading  ${data.firstName}  ${data.lastName}`;

    document.getElementById("statusID").innerHTML = "Status: Contacts Loaded (" + cURLArray.length + ")";
    viewCurrentContact()
}

// logs all contact informations to console.
async function logContacts() {
    console.log(cArray);
}

// taken from w3Schools
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }

var contactNames = [];

  for (i = 0; i < cArray.length; i++) {
    contactNames.push(cArray[i].firstName); 
}

autocomplete(document.getElementById("contactList"), contactNames);





