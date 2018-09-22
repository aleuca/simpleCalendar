"use strict";
exports.__esModule = true;
/**
 * Module imports
 */
var express = require("express");
var parser = require("body-parser");
var meetings_1 = require("./db/meetings");
var users_1 = require("./db/users");
/**
 * Module variables
 */
var app = express();
app.use(parser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
/**
 * Module
 */
/**
 * show route for users
 */
app.get('/users/:id', function (req, res) {
    Promise.all([
        users_1.User.findById(req.params.id),
        meetings_1.Meeting.find({ meetingParticipants: req.params.id })
            .sort('meetingStart')
    ])
        .then(function (_a) {
        var foundUser = _a[0], foundMeetings = _a[1];
        res.render('users', {
            userID: req.body.id,
            username: foundUser,
            numOfMeetings: foundMeetings.length,
            nextMeeting: foundMeetings[0].meetingStart
        });
    })["catch"](function (err) {
        console.log('Error while fetching user:', err);
        res.redirect('/');
    });
});
/**
 * main show route for first 5 meetings and stats
 */
app.get('/', function (req, res) {
    var beginningOfYear = new Date();
    beginningOfYear.setMonth(0);
    beginningOfYear.setDate(1);
    var endOfYear = new Date();
    endOfYear.setMonth(11);
    endOfYear.setDate(30);
    Promise.all([
        meetings_1.Meeting.count({}),
        users_1.User.find({}),
        meetings_1.Meeting.find({
            meetingStart: {
                $gte: new Date()
            }
        })
            .populate('meetingParticipants')
            .sort('meetingStart')
            .limit(20),
        meetings_1.Meeting.find({
            meetingStart: {
                $gte: beginningOfYear,
                $lte: endOfYear
            }
        })
    ])
        .then(function (_a) {
        var totalMeetings = _a[0], users = _a[1], nextTwenty = _a[2], meetingsThisYear = _a[3];
        res.render('landing', {
            numOfMeetings: totalMeetings,
            nextTwenty: nextTwenty,
            users: users,
            average: meetings_1.averageParticipants(nextTwenty),
            avgMeetings: meetings_1.avgMeetingsMonth(meetingsThisYear)
        });
    })["catch"](function (err) {
        console.log('Error while fetching:', err);
        res.send('Error: server failure');
    });
});
/**
 * View form for creating new meeting
 */
app.get('/newMeeting', function (req, res) {
    res.render('newMeeting');
});
/**
 * Command to create 5000 random meetings
 */
app.post('/createRandom', function (req, res) {
    console.log('Creating 5000 random meetings');
    meetings_1.createRandomMeetings(5000)
        .then(function () {
        console.log('Successfully created 5000 meetings');
        res.redirect('/');
    })["catch"](function (err) {
        console.log('Error while creating random meetings:', err);
        res.redirect('/');
    });
});
/**
 * show route for meetings
 */
app.get('/meetings/:id', function (req, res) {
    meetings_1.Meeting.findById(req.params.id)
        .then(function (meeting) {
        res.render('meetings', {
            meeting: meeting
        });
    })["catch"](function (err) {
        console.log('Error while fetching meeting:', err);
        res.redirect('/');
    });
});
/**
 * create a new meeting
 */
app.post('/meeting', function (req, res) {
    //insert into database
    var meetingTopic = req.body.topic;
    var meetingStart = new Date(req.body['meeting-start-date']);
    var meetingEnd = new Date(req.body['meeting-end-date']);
    var meetingParticipants = req.body['meeting-participants'].split(',');
    var recurrence = req.body.recurring;
    var occurrenceNumber = parseInt(req.body['occurrence-number']);
    var recurringMeetingsArray = [];
    if (recurrence === 'on') {
        //milliseconds in a week
        var oneWeek = 604800000;
        for (var i = 1; i < occurrenceNumber; i++) {
            recurringMeetingsArray.push(new Date(meetingStart.getTime() + oneWeek * i));
        }
    }
    users_1.User.find({ email: meetingParticipants })
        .then(function (users) {
        var usersToInsert = users.map(function (user) { return user._id; });
        var newMeeting = {
            meetingStart: meetingStart,
            meetingEnd: meetingEnd,
            meetingTopic: meetingTopic,
            meetingParticipants: usersToInsert,
            recurring: recurringMeetingsArray
        };
        console.log('Inserting new meeting:', newMeeting);
        // Create a new meeting and save to DB
        return meetings_1.Meeting.create(newMeeting);
    })
        .then(function (newMeeting) {
        console.log('Created meeting:', newMeeting);
        res.redirect('/');
    })["catch"](function (err) {
        console.log('Error fetching meeting:', err);
        res.redirect('/');
    });
});
/**
 * run server
 */
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log("server running on port " + PORT);
});
