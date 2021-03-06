#!/usr/bin/env nodejs
const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

var logpath = '/home/ubuntu/woodpecker/log';


function getInfo (request, response) {
  var datetime = new Date();
  var ip = '\n\tNew Connection ' + request.connection.remoteAddress + ' -> ' + request.headers['host'];
  var agent = '\n\tUser Agent: ' + request.headers['user-agent'];
  var uri = '\n\tRequested Resource: ' + request.url;
  var method = '\n\tRequest Method: ' + request.method;
  var accept = '\n\tAccept: ' + request.headers['accept'];
  var type = '\n\tContent Type: ' + request.headers['content-type'];
  var contentLen = '\n\tContent Length: ' + request.headers['content-length'];
  fs.appendFile(logpath, '\n\n---Begin--\n\t' +
      datetime + ip + agent + uri + method + accept + type + contentLen, function (err) { console.log(err); }
  );
}

http.createServer(function (request, response) {
  var getpath = url.parse(request.url).pathname;
  var fullPath = path.join(__dirname, getpath);
  var requestBody = '';
  response.setHeader('Allow', 'GET', 'OPTIONS');
  response.setHeader('Connection', 'keep-alive');
  response.setHeader('Date', new Date());
  response.setHeader('Server', 'Apache/2.4.7 (Ubuntu)');
  /*
  response.setHeader('X-Powered-By', 'PHP/5.6.22');
  */

  if (request.headers['user-agent'] === '' ||
    request.headers['user-agent'].includes('curl') === true ||
    request.headers['user-agent'].includes('Python') === true) {
    response.write('');
    response.end();
  } else if (fullPath.includes('/wp-login.php') || request.method === 'POST') {
    getInfo(request, response);
    if (request.method === 'GET') {
      fs.readFile(__dirname + '/wp-login.php', 'binary', function (err, file) {
        if (err) console.log(err);
        response.write(file, 'binary');
        response.end();
      });
    }
	if (request.method === 'POST'){
    fs.readFile(__dirname + '/404.html', 'binary', function (err, fourofour) {
      if (err) console.log(err);
      response.writeHead(404, {'Content-Type': 'text/html'});
      response.write(fourofour, 'binary');
      response.end();
    });
    request.on('data', function (data) {
      requestBody += data;
    });
    request.on('end', function () {
      fs.appendFile(logpath, '\n\tRequest Body:\n' + Array(10).join('#') + '\n' + requestBody, function (err) { console.log(err); });
    });
	}
  } else if (request.method === 'GET') {
    getInfo(request, response);
    if (fullPath === __dirname + '/' || fullPath === __dirname + '/index.html') {
      fs.readFile(__dirname + '/index.html', 'binary', function (err, file) {
        if (err) console.log(err);
        response.write(file, 'binary');
        response.end();
      });
    } else if (fullPath === __dirname + '/whatsmyip') {
      response.write(request.connection.remoteAddress, {'Content-Type': 'text/html'});
      response.end();
    } else {
      fs.readFile(fullPath, 'binary', function (err, file) {
        if (err ||
          fullPath.includes('basic_server.js') ||
          fullPath.includes('node_modules')) {
          fs.readFile(__dirname + '/404.html', 'binary', function (err, fourofour) {
            if (err) console.log(err);
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.write(fourofour, 'binary');
            response.end();
          });
        } else {
          response.write(file, 'binary');
          response.end();
        }
      });
    }
  }
}).listen(80, '0.0.0.0');
console.log('Server is now running');
process.on('uncaughtException', function (err) { console.log(err); });
