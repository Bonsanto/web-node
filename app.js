var http = require('http'),
	fs = require('fs'),
	express = require("express"),
	multer = require("multer"),
	bodyParser = require("body-parser");

var app = express(),
	done = false,
	port = 1337;

//app.use(bodyParser.urlenconded({
//	extended: true
//}));

app.use(multer({
	dest: "./uploads/",
	rename: function (fieldname, filename) {
		return filename + Date.now();
	},
	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path);
		done = true;
	},
	onError: function (error, next) {
		console.log(error);
		next();
	}
}));

app.get("/", function (req, res) {
	//res.writeHead(200, {
	//});
	res.sendFile("index.html", {
		root: __dirname + "/views/"
	}, function (error) {
		if (error) {
			res.status(error.status).end();
			console.log(error);
		}
	});
});

app.post("/", function (req, res) {
	console.log("Request on " + Date.now());
	if (done) {
		console.log(req.files);
		res.end("File uploaded.");
	}
});

app.listen(port, function () {
	console.log("Working on port " + port);
});

/**
 * res.writeHead(200, {'Content-Type': 'text/html'});
 * res.write('<html><body><img src="data:image/jpeg;base64,')
 * res.write(new Buffer(data).toString('base64'));
 * res.end('"/></body></html>');
 * */

/**
 fs.readFile('image.jpg', function (err, data) {
	if (err) throw err; // Fail if the file can't be read.
	http.createServer(function (req, res) {
		favio("Favio");
		res.writeHead(200, {
			'Content-Type': 'image/jpeg'
		});
		res.end(data); // Send the file data to the browser.
	}).listen(1337);
	console.log('Server running at http://localhost:8124/');
});
 **/