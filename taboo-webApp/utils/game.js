const {mergeSelectedBlackDecks, mergeSelectedWhiteDecks} = require('./serverDeck');
const {isWCRebootOptionEnabled} = require('./serverRules');
const { checkExceptions } = require('./exceptions');

var blackDeck;
var whiteDeck;

var discardBlackDeck = [];

var cardCzar = false;
var blackCard = '';

var options = [];

var aTeamPoints = 0;
var bTeamPoints = 0;

var serverGameInitialized = false;

var serverBuzzer = false;

var cardEvent = '';

function mergeSelectedDecks() {
	blackDeck = mergeSelectedBlackDecks();
	whiteDeck = mergeSelectedWhiteDecks();
}

function getBlackDeck() {
	var i = blackDeck.length, k, temp;
	while(--i > 0) {
		k = Math.floor(Math.random() * (i+1));
		temp = blackDeck[k];
		blackDeck[k] = blackDeck[i];
		blackDeck[i] = temp;
	}
	console.log("Taboo Cards Left: " +blackDeck.length);
	return blackDeck;
}

function getWhiteDeck() {
	var i = whiteDeck.length, k, temp;
	while(--i > 0) {
		k = Math.floor(Math.random() * (i+1));
		temp = whiteDeck[k];
		whiteDeck[k] = whiteDeck[i];
		whiteDeck[i] = temp;
	}
	return whiteDeck;
}

function isServerGameInitialized(flag) {
	return serverGameInitialized;
}

function setServerGameInitialized(flag) {
	serverGameInitialized = flag;
}

function setServerBuzzer(flag) {
	serverBuzzer = flag;
}

function triggerCardEvent(str) {
	cardEvent = str;
	if(!str) {
		serverBuzzer = false;
	}
}

function addTeamPoints(team) {
	if(team == "teamA") {
		aTeamPoints = aTeamPoints + 1;
	}
	if(team == "teamB") {
		bTeamPoints = bTeamPoints + 1;
	}
}

function resetTeamPoints() {
	aTeamPoints = 0;
	bTeamPoints = 0;
}

function modgame(code, room) {
	switch(code) {
		case "TEAMAA":
			aTeamPoints = aTeamPoints + 1;
			break;
		case "TEAMAS":
			aTeamPoints = aTeamPoints - 1;
			break;
		case "TEAMBA":
			bTeamPoints = bTeamPoints + 1;
			break;
		case "TEAMBS":
			bTeamPoints = bTeamPoints - 1;
			break;
	}
}

function getGameState(user, users, gameusers) {
	//currently there is only one house rule established. 
	//only used in DOM.outputWhiteCards conditional statement 
	//TODO - implement options as array of house rules
	options = isWCRebootOptionEnabled(); //0 || 1
	const gamestate = {cardCzar, blackCard, serverGameInitialized, serverBuzzer, aTeamPoints, bTeamPoints, serverBuzzer, cardEvent, user, users, gameusers, options};
	//console.log(gamestate);
	return gamestate;
}

// Fisher-Yates Randomize In Place
function shuffleCards(cards) {
	var i = cards.length, k, temp;
	while(--i > 0) {
		k = Math.floor(Math.random() * (i+1));
		temp = cards[k];
		cards[k] = cards[i];
		cards[i] = temp;
	}
	return cards;
}

// Clear Discarded Black Card Deck
function clearDiscardBlackDeck() {
	discardBlackDeck = [];
}

// Draw a black card
function drawBlackCard(flag) {
	if (flag) {
		blackCard = getBlackDeck().pop();
		//if no cards left set black deck = to discard black deck
		if(typeof blackCard == 'undefined') {
			blackCard = 'NONE';
			//blackDeck = discardBlackDeck;
			//discardBlackDeck = [];
			//blackCard = getBlackDeck().pop();
			//if no cards in discard pile,  reshuffle black deck
			//if(typeof blackCard == 'undefined') {
			//	blackDeck = mergeSelectedBlackDecks();
			//}
		}
		if(!blackCard) {
			var tempCount = 0;
			while(!blackCard && tempCount < 10) {
				blackCard = getBlackDeck().pop();
				tempCount++;
			}
		}
		// Logic to determine drawCount from blackCard text
		var temp = blackCard;
		if(temp) {
			var count = (temp.match(/_*_/g) || []).length;
			if(count == 0) {
				drawCount = 1;
			} else {
				drawCount = count;
			}
			drawCount = checkExceptions(temp, drawCount);//from exceptions.js
			discardBlackDeck.push(blackCard);
		}
	} else {
		blackCard = '';
		drawCount = 1;
	}
}

// Set the card czar to user
function setCardCzar(user) {
	cardCzar = user;
}

module.exports = {
  setCardCzar,
  drawBlackCard,
  getGameState,
  mergeSelectedDecks,
  clearDiscardBlackDeck,
  setServerGameInitialized,
  setServerBuzzer,
  addTeamPoints,
  resetTeamPoints,
  modgame,
  triggerCardEvent
};