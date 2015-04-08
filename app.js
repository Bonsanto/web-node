var path = require("path"),
	fs = require('fs'),
	express = require("express"),
	multer = require("multer"),
	type = require("./libs/img-type"),
	app = express(),
	done = false,
	port = 1337;

//app.use(express.static(__dirname + "/uploads"));

var multipart = multer({
	dest: "./uploads/",
	rename: function (fieldname, filename) {
		return filename;
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
});

app.get("/", function (req, res) {
	res.sendFile("index.html", {
		root: __dirname + "/views/"
	}, function (error) {
		if (error) {
			res.status(error.status).end();
			console.log(error);
		}
	});
});

app.get("/pictures/:id", function (req, res) {
	console.log(req.params.id);
	res.sendFile("index.html", {
		root: __dirname + "/views/pictures/"
	}, function (error) {
		if (error) {
			res.status(error.status).end();
			console.log(error);
		}
	});
});

app.post("/", multipart, function (req, res) {
	var msg = {
		status: false
	};

	console.log("Request on " + new Date());
	if (done) msg.status = true;
	res.set("Content-Type", "application/json");
	res.send(msg);
});

app.get("/pics/:id", function (req, res) {
	fs.readFile(path.join(__dirname + "/uploads/" + req.params.id), function (err, data) {
		if (err || !type.isAllowed(req.params.id)) {
			console.log(err);
			res.status(404).send(err ? "File not found" : "Format not supported");
		} else {
			res.set("Content-Type", "img/" + type.typeparser(req.params.id));
			res.send(data);
		}
	});
});

app.listen(port, function () {
	console.log("Working on port " + port);
});

//app.get("/pics/:id", function (req, res) {
//	console.log(req.params.id);
//	res.sendFile(req.params.id, {
//		root: __dirname + "/uploads/"
//	}, function (error) {
//		if (error) {
//			res.status(error.status).end();
//			console.log(error);
//		}
//	});
