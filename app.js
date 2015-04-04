var path = require("path"),
	fs = require('fs'),
	express = require("express"),
	multer = require("multer"),
	app = express(),
	done = false,
	port = 1337;

//app.use(express.static(__dirname + "/uploads"));

app.use(multer({
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
}));

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

app.post("/", function (req, res) {
	console.log("Request on " + new Date());
	if (done) {
		console.log(req.files);
		res.end("File uploaded.");
	}
});

app.get("/pics/:id", function (req, res) {
	fs.readFile(path.join(__dirname + "/uploads/" + req.params.id), function (err, data) {
		if (err) {
			console.log(err);
			res.end("File not found");
		} else {
			console.log("received data ");
			res.write(data);
			res.end();
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
//});