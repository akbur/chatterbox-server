var messages = {"results": []};

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";
  if(request.method === 'GET'){
    var roomMessages = {results:[]};
    messages.results.forEach(function(messageObj) {
      if (request.url === '/classes/' + messageObj.roomname) {
        roomMessages.results.push(messageObj);
      }
    });
    if(request.url === '/classes/' + roomMessages.results.roomname) {
      response.writeHead(200, headers);
      var stringRoomMsgs = JSON.stringify(roomMessages);
      console.log("stringRoomMsgs in GET ", stringRoomMsgs);
      response.end(stringRoomMsgs);
    } else if (request.url === '/classes/messages') {
      response.writeHead(200, headers);
      var stringMsgs = JSON.stringify(messages);
      console.log("stringMsgs in GET ", stringMsgs);
      response.end(stringMsgs);
    } else {
      response.writeHead(404, headers);
      response.end("404 Error");
    }
  } else if(request.method === 'POST'){
      if(request.url === '/classes/messages') {
        request.on('data', function(data){
          var data = JSON.parse(data)
          console.log(data);
          console.log("messages before parse ", messages);
          messages.results.push(data);
          data = JSON.stringify(data);
          console.log("messages after parse ", messages);
          response.writeHead(201, headers);
          response.end(data);
        });
        
      } else {
        response.writeHead(404, headers);
        response.end("404 Error");
      }
  } else if(request.method === 'OPTIONS'){
    response.writeHead(200, headers);
    response.end('option');
  } else {
      response.writeHead(404, headers);
      response.end("404 Error");
  }
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = requestHandler;