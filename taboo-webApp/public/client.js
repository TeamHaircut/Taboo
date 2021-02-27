const gameControl = document.getElementById('gamecontrol');
const gameControl1 = document.getElementById('gamecontrol1');

const logoutControl = document.getElementById('logoutcontrol');

const chatForm = document.getElementById('chat-form');

const socket = io('http://teamhaircut.org:5000', {
	'reconnection': true,
	'reconnectionDelay': 50,
	'maxReconnectionAttempts': Infinity
});

socket.on('reconnecting', () => {
		socket.emit('rejoinRoom', { username: getClientUsername() });
});

/* Send an object containing the client's username, and room name as soon as they join the room*/
socket.emit('joinRoom', { username: getClientUsername(), room: getClientRoom() });

// Message from server
/*socket.on('message', message => {
	outputMessage(message);
	
	// Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});
*/

// Message submit
/*chatForm.addEventListener('submit', e => {
	e.preventDefault();
	
	// Get message text
	const msg = e.target.elements.msg.value;
	
	//Emit message to server
	socket.emit('chatMessage', msg);
	
	// Clear input
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});
*/

gameControl.addEventListener("click", function(){ 
	//Emit game control state to server
	const state = gameControl.innerHTML;
	socket.emit('gameControlState', {state});
	
});

gameControl1.addEventListener("click", function(){ 
	//Emit game control state to server
	const state = gameControl1.innerHTML;
	socket.emit('gameControlState', {state});
	
});

teams.addEventListener("change", function(){ 
	//console.log(teams.value);
	//Emit game control state to server
	const state = teams.value;
	socket.emit('teamControlState', {state});
	
});

logoutControl.addEventListener("click", function() {
	socket.emit('logoutUser');
});

var logoutUser;

document.addEventListener("visibilitychange", function() {

	if (document.visibilityState === 'visible') {
		socket.emit('rejoinRoom', { username: getClientUsername() });
		clearTimeout(logoutUser);
	} else {
		socket.emit('goIdle');
		logoutUser = setTimeout(() => {
				socket.emit('logoutUser');
		},
			90000
		)
	}	
	
})

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

socket.on('buzzFromServer', ({GameState})=> {
	guessWord.innerHTML=`<i class="fas fa-times fa-9x" style="color: red;"></i>`;
	taboo0.innerHTML = ``;
	taboo1.innerHTML = ``;
	taboo2.innerHTML = ``;
	taboo3.innerHTML = ``;
	taboo4.innerHTML = ``;
});

function sendWinnerInfoToServer(card) {
	socket.emit('declareWinner', {card});
}

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
	console.log("refeshDOM message received");
	console.log(GameState.serverGameInitialized);
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
	timer.innerHTML = `0`;
	terminateGame(GameState);
});

socket.on('countdown', remaining => {
	timer.innerHTML = remaining;

	//console.log(remaining);
	//terminateGame(GameState);
});

//keep
// Apply game termination to DOM
function terminateGame(GameState) {
	console.log("terminate game called");
	socket.emit('setServerGameInitialized', false);
	gameControl.innerHTML = `<i class="fas fa-play"></i> Start Game`;
	gameControl1.innerHTML = `<i class="fas fa-play"></i> Start Game`;
	gameControl1.style.display = "block";
	gameControl1.style.visibility = "visible";
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
	console.log("socket on gamestate message received");
	console.log(GameState);
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