var path = require("path"),
	fs = require('fs'),
	express = require("express"),
	multer = require("multer"),
	pg = require("pg"),
	app = express(),
	done = false,
	port = 1337;

const DB_USER_NAME = "postgres",
	DB_PWD = "masterkey",
	DB_IP = "localhost",
	DB_PORT = "5432",
	DB_NAME = "uploads";
var CONNECT_STRING = "postgres" + "://" + DB_USER_NAME + ":" + DB_PWD + "@" + DB_IP + ":" + DB_PORT + "/" + DB_NAME;


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
	},
	inMemory: true
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
	var msg = {
		status: false
	};

	console.log("Request on " + new Date());
	if (done) {
		////var client = new pg.Client(CONNECT_STRING);
		//
		//pg.connect(CONNECT_STRING, function (error, client, done) {
		//	if (error) {
		//		return console.log("Error fetching the pool from", CONNECT_STRING, error);
		//	}
		//	client.query("SELECT $1::oid FROM pokemon", ["1"], function (error, result) {
		//		done();
		//
		//		if (error) {
		//			return console.log("Error running query", error);
		//		}
		//		console.log(result.rows[0]);
		//		client.end();
		//	});
		//});
		//
		msg.status = true;
	}
	//res.json(msg);
	res.set('Content-Type','application/json');
	res.send(msg);
});

app.get("/pics/:id", function (req, res) {
	fs.readFile(path.join(__dirname + "/uploads/" + req.params.id),
		function (err, data) {
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