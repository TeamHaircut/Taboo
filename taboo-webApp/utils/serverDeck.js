const deckMap = new Map();
const map2 = new Map();

////////////////////////////////////////////////////////////
const BaseGame1v0_BlackCards = require('../cards/BaseGame1v0_BlackCards');
const BaseGame1v0_WhiteCards = require('../cards/BaseGame1v0_WhiteCards');
deckMap.set('BaseGame1v0', 0);
map2.set('BaseGame1v0', {white: BaseGame1v0_WhiteCards.getWhiteDeck(), black: BaseGame1v0_BlackCards.getBlackDeck()});

const BaseGameUS_BlackCards = require('../cards/BaseGameUS_BlackCards');
const BaseGameUS_WhiteCards = require('../cards/BaseGameUS_WhiteCards');
deckMap.set('BaseGameUS', 0);
map2.set('BaseGameUS', {white: BaseGameUS_WhiteCards.getWhiteDeck(), black: BaseGameUS_BlackCards.getBlackDeck()});
////////////////////////////////
function setDeckMap(key, value) {
	deckMap.set(key, value);
}

function getDeckMap() {
	return deckMap;
}

function mergeSelectedBlackDecks() {
	var tempBlack = [];
	for (let key of getDeckMap().keys()) {
		if(getDeckMap().get(key) == true) {
			tempBlack = tempBlack.concat(map2.get(key).black);
		}

	}
	return tempBlack;
}

function mergeSelectedWhiteDecks() {
	var tempWhite = [];
	for (let key of getDeckMap().keys()) {
		if(getDeckMap().get(key) == true) {
			tempWhite = tempWhite.concat(map2.get(key).white);
		}

	}
	return tempWhite;
}

module.exports = {
    setDeckMap,
    getDeckMap,
    mergeSelectedBlackDecks,
    mergeSelectedWhiteDecks
  };