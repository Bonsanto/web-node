var path = require("path"),
	fs = require('fs'),
	pg = require("pg"),
	express = require("express"),
	multer = require("multer"),
	type = require("./libs/img-type"),
	app = express(),
	done = false,
	port = 1337;

//app.use(express.static(__dirname + "/uploads"));
const USERNAME = "postgres",
	PASSWORD = "masterkey",
	IP = "localhost",
	PORT = "5432",
	DATABASE = "uploads",
	CONN = "postgres://" + USERNAME + ":" + PASSWORD + "@" + IP + ":" + PORT + "/" + DATABASE;

var fileWriter = multer({
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

var dbWriter = multer({
	inMemory: true,
	dest: ".uploads",
	onFileUploadComplete: function (file) {
		//todo: improve the location of this done, should be inside the query exe. but if you move it, it stops working.
		done = true;

		pg.connect(CONN, function (err, client, finished) {
			if (err) console.log("Error fetching client from pool", err);

			client.query("INSERT INTO upload (file, date, name)" +
			"VALUES ($1, $2, $3)", [file.buffer, new Date(), file.originalname], function (err, result) {
				if (err) console.log("Error querying", err);
				finished();
			});
		});
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

app.post("/", fileWriter, function (req, res) {
	var msg = {
		status: false
	};

	console.log("Request on " + new Date());
	if (done) msg.status = true;
	res.set("Content-Type", "application/json");
	res.send(msg);
});

app.get("/db", function (req, res) {
	res.sendFile("index.html", {
		root: __dirname + "/views/db/"
	}, function (error) {
		if (error) {
			res.status(error.status).end();
			console.log(error);
		}
	});
});

app.post("/db", dbWriter, function (req, res) {
	var msg = {
		status: false
	};

	console.log("Request on " + new Date());
	if (done) msg.status = true;
	res.set("Content-Type", "application/json");
	res.send(msg);
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

app.get("/pics/:id", function (req, res) {
	fs.readFile(path.join(__dirname + "/uploads/" + req.params.id), function (err, data) {
		if (err || !type.isAllowed(req.params.id)) {
			console.log(req.params.id, "Not found in folder, querying the DB");

			pg.connect(CONN, function (error, client, done) {
				if (error) {
					console.log("Error fetching client from pool", error);
					res.status(500).send("Internal Error");
				}

				var query = client.query("SELECT * FROM upload WHERE name = $1", [req.params.id]);

				query.on("row", function (row, result) {
					result.addRow(row);
				});

				query.on("end", function (result) {
					if (result.rows.length < 1) {
						console.log("Not stored in the DB", err);
						res.status(404).send("Not Found");
					} else {
						res.set("Content-Type", "img/" + type.typeparser(req.params.id));
						res.send(result.rows[0].file);
					}
					done();
				});

				query.on("error", function (error) {
					console.log("Error querying", error);
					res.status(500).send("Internal Error");
					done();
				});

			});
		} else {
			res.set("Content-Type", "img/" + type.typeparser(req.params.id));
			res.send(data);
		}
	});
});

app.listen(port, function () {
	console.log("Working on port " + port);
});

