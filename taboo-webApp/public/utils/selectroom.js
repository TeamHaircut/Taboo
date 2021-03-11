const nameDiv = document.getElementById("name");

var nameValue = "Player"+ Math.floor(Math.random() * 1000);
nameDiv.value = nameValue;

function setUserName() {
    localStorage.setItem("uname", nameDiv.value);
}