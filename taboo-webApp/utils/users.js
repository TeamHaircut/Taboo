const users = [];

function setUserStatus(currentUser, status) {
	users.forEach(user => {
		if(user.username == currentUser.username) {
			user.status = status;
		}
	});
}

function setUserTeamName(currentUser, teamName) {
	users.forEach(user => {
		if(user.username == currentUser.username) {
			user.teamName = teamName;
		}
	});
	//console.log(users);
}

//Player who initiated the round is the giver, thier teammates are the recievers
//everyone else have buzzers
function setUserRoles(currentUser) {
	var team = currentUser.teamName;
	users.forEach(user => {
		if(user.username == currentUser.username) {
			user.role = "giver";
		} else if (user.teamName == team) {
			user.role = "receiver";
		} else {
			user.role = "buzzer";
		}
	});
}

function getCurrentUserByUsername(username) {
	return users.find(user => user.username === username);
}

//function updatePoints(name) {
//	users.forEach(user => {
//		if(user.username == name) {
//			user.points = user.points + 1;
//		}
//	});
//}

//function updatePoints1(teamName) {
//	//console.log(teamName);
//	users.forEach(user => {
//		if(user.teamName == teamName) {
//			user.points = user.points + 1;
//		}
//	});
//	//console.log(users);
//}

// Reset Points to 0
//function resetPoints() {
//	users.forEach(user => {
//		if(user.points == '-'){
//			user.points = 0;
//		}
//		//user.points = 0
//	});
//}

// Join user to chat
function userJoin(id, username, room) {
	const status = 'active';
	const teamName = 'teamA';
	const role = '';
	const user = { id, username, room, status, teamName, role};
	users.push(user);
	return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// Rejoin user to room
function userRejoin(id, user) {
	user.id = id;
	user.status = 'active';
}

// Get room users
function getRoomUserList(room) {
  var roomUsers = users.filter(user => user.room === room); 
  return roomUsers.filter(user => user.status !== 'inactive');
}

// Get active game users
function getGameUserList(room) {
	var roomUsers = users.filter(user => user.room === room); 
	var temp = roomUsers.filter(user => user.status !== 'inactive');
	return temp.filter(user => user.status !== 'offline');
  }

module.exports = {
  userJoin,
  getCurrentUser,
  getRoomUserList,
  getGameUserList,
  userRejoin,
  getCurrentUserByUsername, 
  setUserStatus,
  setUserTeamName,
  setUserRoles
};