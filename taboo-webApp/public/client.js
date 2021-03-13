const gameControl = document.getElementById('gamecontrol');
const gameControl1 = document.getElementById('gamecontrol1');

const logoutControl = document.getElementById('logoutcontrol');

const resetPointLink = document.getElementById('resetPointLink');
const refreshUserListLink = document.getElementById('refreshUserListLink');

const chatForm = document.getElementById('chat-form');

const socket = io('http://teamhaircut.org:5000', {
	'reconnection': true,
	'reconnectionDelay': 50,
	'maxReconnectionAttempts': Infinity
});

var myBuzzer = new buzzer("buzzer.mp3");

console.log(localStorage.getItem("uname"));
socket.emit('joinRoom', { username: getClientUsername(), room: getClientRoom() });

/////////////////////////////SOUND//////////////////////////////////////////////////////
			var buzzerSound = new Audio("buzzer.mp3");
			
			var allAudio = [];
			allAudio.push(buzzerSound);

			var tapped = function() {
				// Play all audio files on the first tap and stop them immediately.
				if(allAudio) {
					for(var audio of allAudio) {
						audio.play();
						audio.pause();
						audio.currentTime = 0;
					}
					allAudio = null;
				}
			}

			document.body.addEventListener('touchstart', tapped, false);
			document.body.addEventListener('click', tapped, false);

			var stopBuzzer = function() {
				buzzerSound.pause();
			}

			var playBuzzer = function() {
				buzzerSound.play();
				setTimeout(function() {
					buzzerSound.pause();
				}, 1000)
			}
/////////////////////////////////////////////////////////////////////////////
resetPointLink.addEventListener("click", function(){ 
	console.log("reset point link clicked");
	socket.emit('requestRulesInfo0', {id: "resetpoints"});
	
});

refreshUserListLink.addEventListener("click", function(){ 
	console.log("refresh user list link clicked");
	socket.emit('requestRulesInfo0', {id: "resetuserlist"});
	
});

gameControl.addEventListener("click", function(){ 
	//Emit game control state to server
	const state = gameControl.innerHTML;
	socket.emit('gameControlState', {state});
	
});

gameControl1.addEventListener("click", function(){ 
	//Emit game control state to server
	clearServerBuzzer();
	const state = gameControl1.innerHTML;
	socket.emit('gameControlState', {state});
	
});

teams.addEventListener("change", function(){ 
	//console.log(teams.value);
	//Emit game control state to server
	const teamSelection = teams.value;
	socket.emit('teamControlState', {teamSelection});
	
});

logoutControl.addEventListener("click", function() {
	socket.emit('logoutUser');
});

var logoutUser;
var isActive = false;

window.addEventListener("touchstart", function() {
	//socket.emit('vistate', { visibilityState: isActive });
	if(!isActive) {
		//socket.emit('vistate', { visibilityState: document.visibilityState });
		socket.emit('rejoinRoom', { username: getClientUsername(), room: getClientRoom() });
		isActive = true;
	}
});

document.addEventListener("visibilitychange", function() {
	//socket.emit('vistate', { visibilityState: document.visibilityState });
	if (document.visibilityState === 'visible') {
		socket.emit('rejoinRoom', { username: getClientUsername(), room: getClientRoom() });
	} else {
		isActive = false;
		socket.emit('goIdle');
	}	
	
}, false);

//keep
function drawBlackCard() {
	socket.emit('drawBlackCard');
}
//keep
socket.on('drawBlackCard', ({GameState})=> {
	// Update DOM with new black card
	outputTabooCard(GameState);
});

function buzzServer() {
	socket.emit('setBuzzer');
}

//broadcast arrow, check, or x to all clients
function broadcastEvent(str) {
	socket.emit('broadcastEvent', {str});
}

socket.on('buzzFromServer', ({GameState})=> {
	guessWord.innerHTML=`<i class="fas fa-times fa-9x" style="color: red;"></i>`;
	taboo0.innerHTML = ``;
	taboo1.innerHTML = ``;
	taboo2.innerHTML = ``;
	taboo3.innerHTML = ``;
	taboo4.innerHTML = ``;
});

function sendWinnerInfoToServer1(team) {
	socket.emit('declareWinner1', {team});
}

function clearServerBuzzer() {
	socket.emit('clearServerBuzzer');
}

//keep
//  Update points in user table, and braodcast winner to room users
socket.on('updateDOM', ({winnerArray, GameState}) => {
	cardSelected = false;
	// Update DOM with updated room user table
	outputRoomUserTable(GameState);

	// Update DOM with new black card
	outputTabooCard(GameState);

});

//keep
function refreshDOM(GameState) {
	if(GameState.serverBuzzer) {
		playBuzzer();
	} else {
		stopBuzzer();
	}

	if(GameState.user.username == getClientUsername()) {
		teams.value = GameState.user.teamName;
	}

	var flag = GameState.serverGameInitialized;
	if(flag) {
		initializeGame(GameState);
	}
	if(!flag){
		terminateGame(GameState);
	}
	//infoDiv.innerHTML =``;
	// Update DOM with new black card
	//outputTabooCard(GameState);
	// Update DOM with updated room user table
	//outputRoomUserTable(GameState);
}

//keep
// Launch event from server
socket.on('launch', ({GameState}) => {
	initializeGame(GameState);
});

//keep
// Apply game intialization to DOM
function initializeGame(GameState) {
	socket.emit('setServerGameInitialized', true);
	gameControl.innerHTML = `<i class="fas fa-stop"></i> Stop Game`;
	gameControl1.innerHTML = `<i class="fas fa-stop"></i> Stop Game`;
	gameControl1.style.display = "block";
	gameControl1.style.visibility = "hidden";
	teams.style.display = "block";
	teams.style.visibility = "hidden";
	timer.style.display = "block";
	timer.style.visibility = "visible";
	var role;
	GameState.users.forEach(user => {
		if(user.username == getClientUsername()) {
			role = user.role;
		}
	});
	outputTabooCard(GameState);
	card = GameState.blackCard;
	var tabooCard = card.split(",");

	if(role == "giver") {
		if(typeof tabooCard[2] == 'undefined') {
			giverControl0.style.display = "block";
			giverControl0.style.visibility = "hidden";
			giverControl1.style.display = "block";
			giverControl1.style.visibility = "hidden";
			buzzerControl.style.display = "none";
		} else {
			giverControl0.style.display = "block";
			giverControl0.style.visibility = "visible";
			giverControl1.style.display = "block";
			giverControl1.style.visibility = "visible";
			buzzerControl.style.display = "none";
		}
	}

	if(role == "buzzer") {
		if(typeof tabooCard[2] == 'undefined') {
			giverControl0.style.display = "none";
			giverControl1.style.display = "none";
			buzzerControl.style.display = "block";
			buzzerControl.style.visibility = "hidden";
		} else {
			giverControl0.style.display = "none";
			giverControl1.style.display = "none";
			buzzerControl.style.display = "block";
			buzzerControl.style.visibility = "visible";
		}
	}
	if(GameState.serverBuzzer) {
		giverControl1.style.display = "none";
		giverControl1.style.visibility = "hidden";
	}
	outputRoomUserTable(GameState);
}

//keep
// Termination event from server
socket.on('terminate', ({GameState}) => {
	timer.innerHTML = ``;
	terminateGame(GameState);
});

socket.on('countdown', remaining => {
	if(remaining == 0) {
		remaining = "";
	}
	timer.innerHTML = remaining;
});

//keep
// Apply game termination to DOM
function terminateGame(GameState) {
	//console.log("terminate game called");
	socket.emit('setServerGameInitialized', false);
	gameControl.innerHTML = `<i class="fas fa-play"></i> Start Game`;
	gameControl1.innerHTML = `<i class="fas fa-play"></i> Start Game`;
	gameControl1.style.display = "block";
	gameControl1.style.visibility = "visible";
	teams.style.display = "block";
	teams.style.visibility = "visible";
	outputTabooCard(GameState);
	timer.style.display = "block";
	timer.style.visibility = "hidden";
	guessWord.innerHTML = ``;
	taboo0.innerHTML = ``;
	taboo1.innerHTML = ``;
	taboo2.innerHTML = ``;
	taboo3.innerHTML = ``;
	taboo4.innerHTML = ``;
	giverControl0.style.display = "block";
	giverControl0.style.visibility = "hidden";
	giverControl1.style.display = "block";
	giverControl1.style.visibility = "hidden";
	buzzerControl.style.display = "none";
	buzzerControl.style.visibility = "hidden";
	infoDiv.innerHTML = ``;
	outputRoomUserTable(GameState);
}

//keep
// get gamestate from server
socket.on('gamestate', ({gameState, GameState}) => {
	//console.log("socket on gamestate message received");
	//console.log(GameState);
	switch (gameState) {
		case 1:
			terminateGame(GameState);
			break;
		case 2:
			initializeGame(GameState);
			break;	
		case 3:
			refreshDOM(GameState);		
		default:
			break;
	}
	setClientRoom(room);
	outputRoomUserTable(GameState);
});