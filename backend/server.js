const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

//const cron = require('node-cron');
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.pluralize(null);
const passport = require("passport");
const routes = express.Router();
const PORT = 4000;
//const axios = require('axios');

let USERS = require("./routes/api/user");
let NOTIFICATION = require("./routes/api/notification");
let HAZARD = require("./routes/api/hazard");
let SSD = require("./routes/api/ssd");
let SSS = require("./routes/api/sss");
let ANALYTIC = require("./models/analytic.model");

app.use(cors());
app.use(bodyParser.json());

//Connect to our MongoDB instance
mongoose
    .connect("mongodb://localhost:27017/HazardTrackingDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false
    })
    .catch(err => {
        console.log(err);
    });

const connection = mongoose.connection;

connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
});

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", USERS);

//Users Api Routes
app.use("/", NOTIFICATION);

//Hazards Api Routes
app.use("/", HAZARD);

//SSD Api Routes
app.use("/", SSD);

//SSS Api Routes
app.use("/", SSS);

//GET request for all analytics entries - RETURNS ARRAY OF VALUES
routes.route("/analytics/").get(function(req, res) {
    ANALYTIC.find(function(err, analytics) {
        if (err) {
            console.log(err);
        } else {
            res.json(analytics);
        }
    });
});

//GET request for analytics data entry by date - RETURNS A SINGLE ENTRY
routes.route("/analytics/:date").get(function(req, res) {
    let date = req.params.date;

    ANALYTIC.findOne(
        {
            date: {
                $regex: date,
                $options: "i"
            }
        },
        function(err, analytics) {
            if (err) {
                res.status(404).send(
                    "There is no data associated with that date in the analytics DB."
                );
            } else {
                res.json(analytics);
            }
        }
    );
});

//POST request for new Analytic entry
routes.route("/analytics/add").post(function(req, res) {
    let analyticEntry = new ANALYTIC(req.body);
    analyticEntry
        .save()
        .then(analyticEntry => {
            res.status(200).json({
                analyticEntry: "Analytic data saved successfully"
            });
        })
        .catch(err => {
            res.status(400).send("Adding new analytic data failed");
        });
});

/* cron.schedule('* * * * *', function () {
	console.log('running a task every minute');

	axios.get('http://localhost:4000/data/hazard').then((res) => {
		hazards = res.data.length;
	});
	axios.get('http://localhost:4000/data/ssd').then((res) => {
		ssd = res.data.length;
	});
	axios.get('http://localhost:4000/data/sss').then((res) => {
		sss = res.data.length;
	});

	const date = new Date();

	const dateFormatted =
		date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();

	const newAnalyticEntry = {
		date: dateFormatted,
		number_of_hazards: 83,
		number_of_reports: 5,
		number_of_ssd: 63,
		number_of_sss: 61,
	};

	axios
		.post('http://localhost:4000/data/analytics/add', newAnalyticEntry)
		.then((res) => console.log(res.data));
}); */

io.on("connection", function(socket) {
    var online = Object.keys(io.engine.clients);
    io.emit("server message", JSON.stringify(online));

    socket.on("disconnect", function() {
        var online = Object.keys(io.engine.clients);
        io.emit("server message", JSON.stringify(online));
    });
});
server.listen(5000, function() {
    console.log("Socket.io is listening on Port: " + 5000);
});

app.use("/", routes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
