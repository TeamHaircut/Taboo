// Get room from template
const clientRoom = document.getElementById('client-room');
const room = clientRoom.innerHTML;

// Set ClientRoom element to room
function setClientRoom(room) {
	clientRoom.innerText = room;
}

// Get ClientRoom
function getClientRoom() {
    return room;
}

// Get username from template
const clientUsername = document.getElementById('client-username');
var username = clientUsername.innerHTML;

// Set ClientUsername to username
function setClientUsername(username) {
    clientUsername.innerHTML = username;
}

// Get ClientUsername
function getClientUsername() {
/////
    const regex = RegExp('.*(J|j)oe.*');
    //if username contains Joe or joe then username = Grumpy Nutz Joe
    if(regex.test(username)) {
        username = "Grumpy Nutz Joe";
    }
/////
    return username;
}