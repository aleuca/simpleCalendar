"use strict";
exports.__esModule = true;
var express = require("express");
var parser = require("body-parser");
var meetings_1 = require("./db/meetings");
var users_1 = require("./db/users");
var utils_1 = require("./utils/utils");
var app = express();
app.use(parser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    var beginningYear = new Date();
    beginningYear.setMonth(0);
    beginningYear.setDate(1);
    var endYear = new Date();
    endYear.setMonth(11);
    endYear.setDate(30);
    Promise.all([
        meetings_1.Meeting.find({}),
        users_1.User.find({}),
        meetings_1.Meeting
            .find({
            meetingStart: {
                $gte: new Date()
            }
        })
            .populate('meetingParticipants')
            .sort('meetingStart')
            .limit(20),
        meetings_1.Meeting.find({
            meetingStart: {
                $gte: beginningYear,
                $lte: endYear
            }
        })
    ])
        .then(function (_a) {
        var meetings = _a[0], users = _a[1], nextTwenty = _a[2], meetingsThisYear = _a[3];
        res.render('landing', {
            numOfMeetings: meetings.length,
            nextTwenty: nextTwenty,
            users: users,
            average: utils_1.averageParticipants(nextTwenty),
            avgMeetings: utils_1.avgMeetingsMonth(meetingsThisYear)
        });
    });
});
//View form for creating new meeting
app.get('/newMeeting', function (req, res) {
    res.render('newMeeting');
});
app.post('/createRandom', function (req, res) {
    console.log('starting meeting creation');
    utils_1.createRandomMeetings(5000)
        .then(function () {
        console.log('ok');
        res.redirect('/');
    });
});
app.get('/users/:id', function (req, res) {
    Promise.all([
        users_1.User.findById(req.params.id),
        meetings_1.Meeting
            .find({ meetingParticipants: req.params.id })
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
    });
});
app.get('/meetings/:id', function (req, res) {
    meetings_1.Meeting.findById(req.params.id)
        .then(function (meeting) {
        res.render('meetings', {
            meeting: meeting
        });
    });
});
//post and create a new meeting
app.post('/', function (req, res) {
    console.log(req.body);
    //insert into database
    // // get data from form and add to campgrounds array
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
        var usersToInsert = users.map(function (user) {
            return user._id;
        });
        var newMeeting = {
            meetingStart: meetingStart,
            meetingEnd: meetingEnd,
            meetingTopic: meetingTopic,
            meetingParticipants: usersToInsert,
            recurring: recurringMeetingsArray
        };
        console.log('inserting new meeting:', newMeeting);
        // Create a new meeting and save to DB
        return meetings_1.Meeting.create(newMeeting);
    })
        .then(function (newMeeting) {
        console.log('newly created', newMeeting);
        res.redirect('/');
    });
});
app.listen(process.env.PORT || 5000, function () {
    console.log('server running');
});
