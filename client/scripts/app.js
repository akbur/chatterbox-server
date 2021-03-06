var uniqueRooms = {};
var friends = {};
var url = window.location;
var user = url.search.substring(url.search.lastIndexOf('=')+1);
var selectedRoom = 'messages';

$('select').on('click', function (e) {
  var roomName = '';
  $("select option:selected").each(function () {
    if ($(this)[0].text === 'Add room') {
      roomName = prompt('Enter room name');// || 'Lobby';
      if (!uniqueRooms[roomName]) {
        $('select').append('<option value = "' + roomName + '">' + roomName + '</div>');
        uniqueRooms[roomName] = true;
      }
    } else {
      roomName += $(this).text() + '';
    }
  });
  selectedRoom = roomName;
  getNewMessages();
});

$('div').on('click', '.message', function () {
  var friendID = $(this).attr('id');
  friends[friendID] = true;
});

var makeStrSafe = function (message, type) {
  if (message) {
    message = message
    .replace(/&/g, '%amp')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&#39;');
  }
  if (type) {
    convertMessage(message);
  } else {
    return message;
  }
};

var getRooms = function () {
  $.ajax({
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      if (data.results) {
        for (var i = 0; i < data.results.length; i++) {
          var roomName = makeStrSafe(data.results[i].roomname);
          if (!uniqueRooms[roomName]) {
            $('select').append('<option value = "' + roomName + '">' + roomName + '</div>');
          }
          uniqueRooms[roomName] = true;
        }
      }
    },
    error: function (data) {
      console.log(data);
      console.error('chatterbox: Failed to send message. Error: ', data);
    }
  });
};

var convertMessage = function (message) {
  var newMessage = {
    username: user,
    text: message,
    roomname: selectedRoom
  };
  document.getElementById('textBox').value='';
  postMessage(newMessage);
};

var postMessage = function (message) {
  $.ajax({
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent. Data: ', data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message. Error: ', data);
    }
  });
};

var getNewMessages = function (room) {
  var room = arguments.length > 0 ? room : 'messages'; 
  $.ajax({
    url: 'http://127.0.0.1:3000/classes/' + room,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      var data = JSON.parse(data);
      $('.message').remove();
      for (var i = 0; i < data.results.length; i++) {
        if (makeStrSafe(data.results[i].roomname) === selectedRoom) { 
          var userName = makeStrSafe(data.results[i].username);
          var userPost = makeStrSafe(data.results[i].text);
          if (friends[userName]) {
            $('#messages').append('<div class = "message" id="' + userName + '"><b>' + userName + ': ' + userPost + '</b></div>');
          } else {
            $('#messages').append('<div class = "message" id="' + userName + '">' + userName + ": " + userPost + '</div>');
          }
        }
      }
    },
    error: function (data) {
      var data = JSON.parse(data);
      console.error('chatterbox: Failed to send message. Error: ', data.results[0]);
    },
  });
};

getRooms();
setInterval(function () {
  getNewMessages(selectedRoom);
}, 2000);
