const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const socket = require('socket.io');
const formatMessage = require('./utils/messages');
const { getGameUserList, setUserStatus, getCurrentUserByUsername, userRejoin, userJoin, getCurrentUser, getRoomUserList, resetPoints, updatePoints, updatePoints1, setUserTeamName, setUserRoles  } = require('./utils/users');
const { clearDiscardBlackDeck, popDiscardBlackDeck, mergeSelectedDecks, getGameState, setCardCzar, getCardCzar, drawBlackCard, nextCardCzar, setServerGameInitialized, setServerBuzzer} = require('./utils/game');
const { setDeckMap, getDeckMap} = require('./utils/serverDeck');
const { setRuleMap, getRuleMap} = require('./utils/serverRules');
const { Console } = require('console');
const app = express();

// Socket setup & pass server
const PORT = 5000 || process.env.PORT;
const server = app.listen(PORT, function(err) {
 
    if (!err)
	{
		console.log(`Server is Listening on port ${PORT}`);
		console.log(`Visit http://teamhaircut.org:${PORT} to test the application`);
	}
    else console.log(err)
 
});
const io = socket(server);

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));

const GameState = {
	TERMINATE: 1,
	INITIALIZE: 2,
	REFRESH: 3
};
var gameState = GameState.TERMINATE;

var cardSelected;

//mergeSelectedDecks on server start
mergeSelectedDecks();

//Run when client connects
io.on('connection', socket => {

	socket.on('joinRoom', ({ username, room }) => {
		const regex = RegExp('.*(J|j)oe.*');
		//if username contains Joe or joe then username = Grumpy Nutz Joe
		if(regex.test(username)) {
			username = "Grumpy Nutz Joe";
		}
		var user = getCurrentUserByUsername(username);
		//if new user
		if (!user) {
			const user = userJoin(socket.id, username, room);

			//Add the connecting socket to the defined room
			socket.join(user.room);

			// Welcome current user to the room
			//socket.emit('message', formatMessage(`Mr. ${user.room}`, `Welcome to the ${user.room} room.`));

			/* Send GameState, room user list, and czar to all the room's clients*/
			io.to(user.room).emit('gamestate', {
				gameState: "default",
				GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
			});	
		//else rejoining user
		} else {
			userRejoin(socket.id, user);

			//Add the connecting socket to the defined room			
			socket.join(user.room);
			// get updated current user and sent it to gamestate
			user = getCurrentUser(socket.id);

			io.to(user.room).emit('gamestate', {
				gameState: GameState.REFRESH,
				GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
			});
		}
		
	});
	
	// Listen for chatMessage
	socket.on('chatMessage', msg => {
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});

	// Listen for game control event
	socket.on('teamControlState', ({state}) => {
		const user = getCurrentUser(socket.id);
		setUserTeamName(user,state);
	});
	//keep
	// Listen for game control event
	socket.on('gameControlState', ({state}) => {
		const user = getCurrentUser(socket.id);
		if(state === `<i class="fas fa-play"></i> Start Game`) {

			console.log("Game Started");
			setUserRoles(user);

			//////////////////////////////
			var counter = 0;
			// We want to send the countdown in seconds to the client and we start at 60
			var seconds = 30;
			// temporary variable for storing how far we have go in the countdown
			var remaining = 0;
			// set a new interval to go off every second and keep the countdown synced among all players
			var interval = setInterval(function() {
				// perform the calculation for how many seconds left
				remaining = seconds - Math.ceil(counter / 1000);
				// broadcast how advanced the countdown is
				io.to(user.room).emit('countdown', remaining);
				if (counter >= (seconds*1000)) {
					// countdown is finished tell the client to change the views.
					io.to(user.room).emit('gamestate', { 
						gameState: GameState.TERMINATE,
						GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
					});
					clearInterval(interval);
				}
				counter += 1000;
			}, 1000);
			/////////////////////////////

			cardSelected = false;

			// Set card czar to current user
			setCardCzar(user);
			
			// Set points for all users to 0
			resetPoints();
			
			// Draw a Black Card
			drawBlackCard(true);
			
			//Initialize White Cards for all clients in the room
			var roomUserList = getRoomUserList(user.room);
//keep
			//Send czar and room info to everybody in the room
			//io.to(user.room).emit('launch', {
			//	GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
			//});

			io.to(user.room).emit('gamestate', {
				gameState: GameState.INITIALIZE,
				GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
			});
			
		} else {
			const user = getCurrentUser(socket.id);

			// Remove card czar
			setCardCzar(false);

			// Clear black card
			drawBlackCard(false);

			// Clear white cards
			var roomUserList = getRoomUserList(user.room);
			//updateRoomUsersWhiteCards(initializeWhiteCards(roomUserList, false));

			clearDiscardBlackDeck();

			io.to(user.room).emit('gamestate', { 
				gameState: GameState.TERMINATE,
				GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
			});
		}
	});

	socket.on('selectDeck', ({optionMap}) => {
		setDeckMap(optionMap.key, optionMap.value);
	});

	socket.on('getServerDeckOptions', () => {

			io.emit('serverDeckData', 
			Array.from(
				getDeckMap()
				)
		);

	});

	socket.on('getServerRules', () => {

			io.emit('serverRulesData', 
			Array.from(
				getRuleMap()
				)
		);

	});

	socket.on('requestRulesInfo', ({key, val}) => {
		setRuleMap(key, val);

		io.emit('serverRulesData', 
		Array.from(
			getRuleMap()
			)
		);

	});

	socket.on('requestDeckInfo', ({key, val}) => {
		setDeckMap(key, val);

		io.emit('serverDeckData', 
		Array.from(
			getDeckMap()
			)
		);

	});

	//keep
	// Listen for winner event
	socket.on('declareWinner', ({card}) => {
		cardSelected = false;
		const user = getCurrentUser(socket.id);

		const cardArray = [];

		//extract user from card
		var name = card.username;

		//update points for name
		updatePoints(name);
		
		//Emit updated DOM to all users
		io.to(user.room).emit('updateDOM', {
			winnerArray: cardArray, 
			GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
		});

		// Update card czar
		setCardCzar(
			nextCardCzar(
				getCardCzar(), getGameUserList(user.room)
			)
		);
				
		/* Send GameState, room user list, and czar to all the room's clients*/
		io.to(user.room).emit('gamestate', {
			gameState,
			GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
		});

	});

	// Listen for winner event
	socket.on('declareWinner1', ({team}) => {
		cardSelected = false;
		const user = getCurrentUser(socket.id);

		const cardArray = [];

		//extract user from card
		var teamName = team;
		updatePoints1(teamName);
		
		//Emit updated DOM to all users
		//io.to(user.room).emit('updateDOM', {
		//	winnerArray: cardArray, 
		//	GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
		//});
				
		/* Send GameState, room user list, and czar to all the room's clients*/
		io.to(user.room).emit('gamestate', {
			gameState: GameState.REFRESH,
			GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
		});

	});
//keep
	// Listen for draw black card event
	socket.on('drawBlackCard', () => {
		const user = getCurrentUser(socket.id);
		drawBlackCard(true);

		io.to(user.room).emit('drawBlackCard', {
			GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
		});
	});

	// Listen for changes in game state initialization
	socket.on('setServerGameInitialized', (flag) => {
		//const user = getCurrentUser(socket.id);
		console.log(flag);
		setServerGameInitialized(flag);
	});

	socket.on('setBuzzer', () => {
		const user = getCurrentUser(socket.id);
		setServerBuzzer(true);
		io.to(user.room).emit('gamestate', {
			gameState: GameState.REFRESH,
			GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
		});
	});

	socket.on('clearServerBuzzer', () => {
		const user = getCurrentUser(socket.id);
		setServerBuzzer(false);
		io.to(user.room).emit('gamestate', {
			gameState: GameState.REFRESH,
			GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
		});
	});
	
	// Listen for rejoin event
	socket.on('rejoinRoom', ({ username }) => {
		var user = getCurrentUserByUsername(username);
		if(user) {
			// set current user to active in user.js
			userRejoin(socket.id, user);
			socket.join(user.room);

			// get updated current user and sent it to gamestate
			user = getCurrentUser(socket.id);

			io.to(user.room).emit('gamestate', {
				gameState: GameState.REFRESH,
				GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
			});
		}
	});

	socket.on('startRound', ({ username, blackCardSelected }) => {
		cardSelected = blackCardSelected;
		popDiscardBlackDeck();
		var user = getCurrentUserByUsername(username);
		if(user){

			io.to(user.room).emit('gamestate', {
				gameState: GameState.REFRESH,
				GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
			});
		}
	});

	socket.on('logoutUser', () => {

		var user = getCurrentUser(socket.id);

		if (user) {
			setUserStatus(user, 'offline');
			user = getCurrentUser(socket.id);

			// Send users and room info
			io.to(user.room).emit('gamestate', {
				gameState: "default",
				GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
			});
		}
	});

	var logoutUser;
	// Runs when client closes browser
	socket.on('disconnect', (reason) => {
		//console.log(reason);
/*
		var user = getCurrentUser(socket.id);

		if(user) {
			logoutUser = setTimeout(() => {
				console.log(user.username+" inside timeout");
				setUserStatus(user, 'offline');
				user = getCurrentUser(socket.id);
				io.to(user.room).emit('gamestate', {
					gameState: "default",
					GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
				});
			},
				15000//90000
			)*/

		var user = getCurrentUser(socket.id);

		if (user) {
			//console.log(user.status);
//			setUserStatus(user, 'offline');
//			user = getCurrentUser(socket.id);

			// Send users and room info
			io.to(user.room).emit('gamestate', {
				gameState: "default",
				GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
			});
		}

	});

	// Runs when client changes tab or app
	socket.on('goIdle', () => {

		var user = getCurrentUser(socket.id);

		if (user) {
			if(user.status == 'active'){
				setUserStatus(user,'idle');
				user = getCurrentUser(socket.id);

				// Send users and room info
				io.to(user.room).emit('gamestate', {
					gameState: "default",
					GameState: getGameState(user, getRoomUserList(user.room), getGameUserList(user.room))
				});
			}
		}
	});

});

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1/test', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));