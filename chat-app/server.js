const http = require('http');
const fs = require('fs');
const path = require('path');
var mime = require('mime');
var chatServer = require('./lib/chat_server')
var cache = {};


var server = http.createServer((req, res) => {
    var filePath = false;
    if (req.url === '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }
    var absPath = './' + filePath;
    serveStatic(res, cache, absPath);
});
server.listen(3000, () => {
    console.log("Started");
});


chatServer.listen(server);




function send404(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write("Error 404: resource not found");
    res.end();
}

function sendFile(res, filePath, fileContents) {
    res.writeHead(200, { 'content-type': mime.lookup(path.basename(filePath)) });
    res.end(fileContents);
}

function serveStatic(res, cache, absPath) {
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(res);
                    } else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }

                });

            } else {
                send404(res);

            }
        });



    }


}