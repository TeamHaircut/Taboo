

// Get room from template
const clientRoom = document.getElementById('client-room');
const room = clientRoom.innerHTML;

function buzzer(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("loop", "true");//? loop src
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      //console.log("inside play function");
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

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
clientUsername.innerHTML = localStorage.getItem("uname");
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