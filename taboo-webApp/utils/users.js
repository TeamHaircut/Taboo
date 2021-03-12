const users = [];

function setUserStatus(currentUser, status) {
	users.forEach(user => {
		if(user.username == currentUser.username) {
			user.status = status;
		}
	});
}

function resetUserList() {
	users.forEach(user => {
		console.log(user.status);
		if(user.status == 'idle') {
			user.status = 'offline';
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
function userRejoin(id, user, room) {
	user.id = id;
	user.status = 'active';
	user.room = room;
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
  setUserRoles,
  resetUserList
};