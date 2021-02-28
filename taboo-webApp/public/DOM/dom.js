const infoDiv = document.querySelector('.info-div');

const roomUserTable = document.querySelector('.userlist-table');

//const chatMessages = document.querySelector('.chat-messages');

const teams = document.getElementById("teams");
const timer = document.getElementById("timer");
const giverControl0 = document.getElementById("giverControl0");
const giverControl1 = document.getElementById("giverControl1");
const buzzerControl = document.getElementById("buzzerControl");

const cardColor = document.getElementById("tabooCardColor");
const guessWord = document.querySelector('.guessWord');
const taboo0 = document.querySelector('.taboo0');
const taboo1 = document.querySelector('.taboo1');
const taboo2 = document.querySelector('.taboo2');
const taboo3 = document.querySelector('.taboo3');
const taboo4 = document.querySelector('.taboo4');

var myTabooCard;
var cardSelected = false;

//keep
// Show each room user in the room user table
function outputRoomUserTable(GameState) {
    // Clear the outdated table
    roomUserTable.innerHTML = '';
    
	//////////////////////TEAMA///////////////////
	const aTeamRow = document.createElement('tr');
	aTeamRow.classList.add('table-light');

	const aTeamHeader = document.createElement('th');
	aTeamHeader.setAttribute("scope","row");
	aTeamHeader.innerHTML = ``;
    aTeamRow.appendChild(aTeamHeader);

	const aTeamData = document.createElement('td');
	aTeamData.style.color = "black";
	aTeamData.innerHTML = `TEAM A`;
	aTeamRow.appendChild(aTeamData);

	const aPointData = document.createElement('td');
	aPointData.style.color = "black";
	//calc team A points
	var aTeamPoints = 0;
	aTeamPoints = GameState.aTeamPoints;
	aPointData.innerHTML = `${aTeamPoints}`;
	aTeamRow.appendChild(aPointData);
	document.querySelector('.userlist-table').appendChild(aTeamRow);
	///////////////////////TEAM A MEMBER LIST//////////////////////
    // Build a table row for each user in the room
	GameState.users.forEach(user=>{
		if(user.teamName == "teamA") {
			const tr = document.createElement('tr');
			tr.classList.add('table-light');
			
			// Indicate who is the current card czar
			const th = document.createElement('th');
			th.setAttribute("scope","row");
			if(user.username == GameState.cardCzar.username) {
				th.innerHTML = ``;
			} else {
				th.innerHTML = ``;
			}
			tr.appendChild(th);
			
			//  Append username and point data to the table row
			const tdName = document.createElement('td');
			if(user.status == 'active') {
				tdName.style.color = "black";
				tdName.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${user.username}`;
			} else if(user.status == 'idle'){
				tdName.style.color = "red";
				tdName.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${user.username} (busy)`;
			} else {
				//tdName.style.color = "red";
				//tdName.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${user.username} (offline)`;		
			}
			tr.appendChild(tdName);
			const tdPoints = document.createElement('td');
			tdPoints.innerHTML = ``;
			tr.appendChild(tdPoints);
			document.querySelector('.userlist-table').appendChild(tr);
		}
		
	});
	///////////////////////TEAMB////////////////////
	const bTeamRow = document.createElement('tr');
	bTeamRow.classList.add('table-light');

	const bTeamHeader = document.createElement('th');
	bTeamHeader.setAttribute("scope","row");
	bTeamHeader.innerHTML = ``;
    bTeamRow.appendChild(bTeamHeader);

	const bTeamData = document.createElement('td');
	bTeamData.style.color = "black";
	bTeamData.innerHTML = `TEAM B`;
	bTeamRow.appendChild(bTeamData);

	const bPointData = document.createElement('td');
	bPointData.style.color = "black";
	//calc team A points
	var bTeamPoints = 0;
	bTeamPoints = GameState.bTeamPoints;
	bPointData.innerHTML = `${bTeamPoints}`;
	bTeamRow.appendChild(bPointData);
	document.querySelector('.userlist-table').appendChild(bTeamRow);
	///////////////////TEAM B MEMBER LIST///////////////////
    // Build a table row for each user in the room
	GameState.users.forEach(user=>{
		if(user.teamName == "teamB") {
			const tr = document.createElement('tr');
			tr.classList.add('table-light');
			
			// Indicate who is the current card czar
			const th = document.createElement('th');
			th.setAttribute("scope","row");
			if(user.username == GameState.cardCzar.username) {
				th.innerHTML = ``;
			} else {
				th.innerHTML = ``;
			}
			tr.appendChild(th);
			
			//  Append username and point data to the table row
			const tdName = document.createElement('td');
			if(user.status == 'active') {
				tdName.style.color = "black";
				tdName.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${user.username}`;
			} else if(user.status == 'idle'){
				tdName.style.color = "red";
				tdName.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${user.username} (busy)`;
			} else {
				//tdName.style.color = "red";
				//tdName.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${user.username} (offline)`;		
			}
			tr.appendChild(tdName);
			const tdPoints = document.createElement('td');
			tdPoints.innerHTML = ``;
			tr.appendChild(tdPoints);
			document.querySelector('.userlist-table').appendChild(tr);
		}
		
	});
	/////////////////////////////////////////////

    // Build a table row for each user in the room
	/*
	GameState.users.forEach(user=>{
	const tr = document.createElement('tr');
	tr.classList.add('table-light');
    
    // Indicate who is the current card czar
	const th = document.createElement('th');
	th.setAttribute("scope","row");
	if(user.username == GameState.cardCzar.username) {
		th.innerHTML = `<i class="fas fa-gavel"></i>`;
	} else {
		th.innerHTML = ``;
	}
    tr.appendChild(th);
    
	//  Append username and point data to the table row
	const tdName = document.createElement('td');
	if(user.status == 'active') {
		tdName.style.color = "black";
		tdName.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${user.username}`;
	} else if(user.status == 'idle'){
		tdName.style.color = "red";
		tdName.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${user.username} (busy)`;
	} else {
		tdName.style.color = "red";
		tdName.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${user.username} (offline)`;		
	}
	tr.appendChild(tdName);
	const tdPoints = document.createElement('td');
	tdPoints.innerHTML = `${user.points}`;
	tr.appendChild(tdPoints);

    //  Append table row to the userlist table
	//document.querySelector('.userlist-table').appendChild(aTeamRow);
	//document.querySelector('.userlist-table').appendChild(aTeamMember);
	document.querySelector('.userlist-table').appendChild(bTeamRow);
	//document.querySelector('.userlist-table').appendChild(tr);
	});  
	*/
}

// Output message to DOM
/*function outputMessage(message) {
	const div = document.createElement('div');
	if(message.username == getClientUsername()) {
		div.classList.add('mine');
	} else {
		div.classList.add('yours');
		div.style.fontSize = "small";
		div.innerHTML =`${message.username}`;
	}

	div.classList.add('messages');
	
	const div1 = document.createElement('div');
	div1.classList.add("message");
	div1.classList.add('last');
	
	div1.style.fontSize = "medium";
	//message.time not used
	div1.innerHTML = `<p>${message.text}</p>`;
	div.appendChild(div1);
	document.querySelector('.chat-messages').appendChild(div);
}
*/
/////////////////////////////////////////////////////////////////////////////////////////

// Add black card to DOM
function outputTabooCard(GameState) {
	
	// role should be defined in GameState
	// role: giver, receiver, buzzer
	var role;
	GameState.users.forEach(user => {
		if(user.username == getClientUsername()) {
			role = user.role;
		}
	});

	card = GameState.blackCard;
	guessWord.innerHTML = ``;
	taboo0.innerHTML = ``;
	taboo1.innerHTML = ``;
	taboo2.innerHTML = ``;
	taboo3.innerHTML = ``;
	taboo4.innerHTML = ``;

	if(GameState.blackCard != false) {
		//timer.style.display = "block";
		//timer.style.visibility = "visible";

		var tabooCard = card.split(",");
		if(tabooCard[1] == "GREEN") {
			cardColor.src = "img_cardbackground_green.PNG";
		} else {
			cardColor.src = "img_cardbackground_purple.PNG";
		}

		//console.log(role);
		if(role != "receiver") {
			if(typeof tabooCard[2] == 'undefined') {
				guessWord.innerHTML = `GAMEOVER`;
				guessWord.style.color = "red";
				taboo0.innerHTML = `There are no more cards left in the deck!`;
				taboo1.innerHTML = `Maybe next time you should skip fewer cards.<br><i class="far fa-grin-wink fa-2x"></i>`;
				taboo2.innerHTML = ``;
				taboo3.innerHTML = ``;
				taboo4.innerHTML = ``;
				timer.style.display = "block";
				timer.style.visibility = "hidden";

				if(role == "giver") {
					giverControl0.style.display = "block";
					giverControl0.style.visibility = "hidden";
					giverControl1.style.display = "block";
					giverControl1.style.visibility = "hidden";
					buzzerControl.style.display = "none";
				}

				if(role == "buzzer") {
					giverControl0.style.display = "none";
					giverControl1.style.display = "none";
					buzzerControl.style.display = "block";
					buzzerControl.style.visibility = "hidden";
				}
					
			} else {
					guessWord.innerHTML = `${tabooCard[2]}`;
					taboo0.innerHTML = `${tabooCard[3]}`;
					taboo1.innerHTML = `${tabooCard[4]}`;
					taboo2.innerHTML = `${tabooCard[5]}`;
					taboo3.innerHTML = `${tabooCard[6]}`;
					taboo4.innerHTML = `${tabooCard[7]}`;
			}
		} else {
			if(typeof tabooCard[2] == 'undefined') {
				guessWord.innerHTML = `GAMEOVER`;
				guessWord.style.color = "red";
				taboo0.innerHTML = `There are no more cards left in the deck!`;
				taboo1.innerHTML = `Maybe next time you should skip fewer cards.<br><i class="far fa-grin-wink fa-2x"></i>`;
				taboo2.innerHTML = ``;
				taboo3.innerHTML = ``;
				taboo4.innerHTML = ``;
				timer.style.display = "block";
				timer.style.visibility = "hidden";


			}
		}


	}
	if(GameState.serverBuzzer) {
		//console.log("HERE");
		guessWord.innerHTML=`<i class="fas fa-times fa-9x" style="color: red;"></i>`;
		taboo0.innerHTML = ``;
		taboo1.innerHTML = ``;
		taboo2.innerHTML = ``;
		taboo3.innerHTML = ``;
		taboo4.innerHTML = ``;
	}
}

function passCard() {
	//console.log("card passed");
	clearServerBuzzer();
	drawBlackCard();
  }

function checkCard() {
	//console.log("point scored");
	drawBlackCard();
	//console.log(teams.value);
	//teams.value holds client team value
	sendWinnerInfoToServer1(teams.value);
	//addPoint();
}

function buzzCard() {
	//console.log("buzzzz");
	buzzServer();
	//playBuzzer();
}
