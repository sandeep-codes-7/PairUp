'use strict';

var setupPage = document.querySelector('#setup-page');
var chatPage = document.querySelector('#chat-page');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var setupStatus = document.querySelector('#setup-status');

var ws = null;
var myUsername = null;
var myUserId = null;
var currentRoomId = null;

var colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];

// Step 1: Call REST API to get Anonymous ID and enter Waiting Room
async function startSession() {
    myUsername = document.querySelector('#name').value.trim() || "Anonymous";
    const gender = document.querySelector('#gender').value;
    const interestsRaw = document.querySelector('#interests').value;
    const interestsList = interestsRaw.split(',').map(i => i.trim()).filter(i => i !== "");

    setupStatus.innerText = "Registering your profile...";

    try {
        const response = await fetch('/api/chat/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: myUsername, gender: gender, interests: interestsList })
        });

        const data = await response.json();
        myUserId = data.userId;
        setupStatus.innerText = "Waiting for a match...";

        // Connect to WebSockets to listen for Matchmaker
        connectWebSocket();

    } catch (error) {
        setupStatus.innerText = "Failed to connect to server.";
    }
}

function handleBack(){
    window.location = '/';
}

// Step 2: Connect to Native WebSockets
function connectWebSocket() {
    // Determine WS protocol based on HTTP protocol
    var protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    var wsUrl = protocol + window.location.host + "/ws/" + myUserId;
    
    ws = new WebSocket(wsUrl);

    ws.onmessage = function(event) {
        var message = JSON.parse(event.data);
        onMessageReceived(message);
    };

    ws.onerror = function(error) {
        setupStatus.innerText = 'Could not connect to WebSocket server. Refresh to try again!';
        setupStatus.style.color = 'red';
    };
}

function onMessageReceived(message) {
    // 1. Handle match events from server
    if(message.type === 'MATCHED') {
        currentRoomId = message.roomId;
        document.querySelector('#chat-title').innerText = "Chatting with " + message.partnerName;

        // Switch UI
        setupPage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        // Tell the server we are joining the room
        ws.send(JSON.stringify({
            sender: myUsername,
            type: 'JOIN',
            roomId: currentRoomId
        }));
        return;
    }

    // 2. Handle actual chat/join/leave messages
    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left! Refresh to find a new match.';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        avatarElement.appendChild(document.createTextNode(message.sender[0]));
        avatarElement.style['background-color'] = getAvatarColor(message.sender);
        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        usernameElement.appendChild(document.createTextNode(message.sender));
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    textElement.appendChild(document.createTextNode(message.content));
    messageElement.appendChild(textElement);
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && ws && currentRoomId) {
        var chatMessage = {
            sender: myUsername,
            content: messageContent,
            type: 'CHAT',
            roomId: currentRoomId
        };
        ws.send(JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) hash = 31 * hash + messageSender.charCodeAt(i);
    return colors[Math.abs(hash % colors.length)];
}

messageForm.addEventListener('submit', sendMessage, true);