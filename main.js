const express = require('express')
const app = express()
const parser = require('body-parser')
const { Meeting } = require('./db/meetings');
const { User } = require('./db/users');
const createRandomMeetings = require('./utils/utils');

app.use(parser.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));



app.get('/', function (req, res) {
    const beginningYear = new Date()
    beginningYear.setMonth(0)
    beginningYear.setDate(1)
    const endYear = new Date()
    endYear.setMonth(11)
    endYear.setDate(30) 

    Promise.all([
        Meeting.find({}),
        User.find({}),
        Meeting
            .find({
                meetingStart: {
                    $gte: new Date()
                }
            })
            .populate('meetingParticipants')
            .sort('meetingStart')
            .limit(20),
        Meeting.find({
            meetingStart: {
                $gte: beginningYear,
                $lte: endYear
            }
        })
        ])
        .then(([meetings, users, nextTwenty, meetingsThisYear]) => {
            function averageParticipants() {
                const participants = []
                let sum = 0
                nextTwenty.forEach((meeting) => {
                    participants.push(meeting.meetingParticipants.length)
                })

                participants.forEach((num) => {
                    sum += num
                })

                return sum / participants.length
            }

            function avgMeetingsMonth() {
                return meetingsThisYear.length / 12
            }
            

            res.render('landing', {
                numOfMeetings: meetings.length,
                nextTwenty: nextTwenty,
                users: users,
                average: averageParticipants(),
                avgMeetings: avgMeetingsMonth()
            });
        })
});


//View form for creating new meeting
app.get('/newMeeting', function(req, res) {
    res.render('newMeeting');
});

app.post('/createRandom', function(req, res) {
    console.log('starting meeting creation')
    createRandomMeetings(5000) 
        .then(() => {
            console.log('ok')
            res.redirect('/')
        })
})

app.get('/users/:id', function (req, res) {
    Promise.all([
        User.findById(req.params.id),
        Meeting
        .find({meetingParticipants : req.params.id})
        .sort('meetingStart')
    ])
        .then(([foundUser, foundMeetings]) => {
            res.render('users', {
                userID: req.body.id, 
                username: foundUser, 
                numOfMeetings: foundMeetings.length , 
                nextMeeting: foundMeetings[0].meetingStart
            })
        })    
})

app.get('/meetings/:id', function (req, res) {
        Meeting.findById(req.params.id)
            .then((meeting) => {
                res.render('meetings', {
                    meeting: meeting 
                })
            })    
})

//post and create a new meeting
app.post('/', function (req, res) {
    console.log(req.body)
    //insert into database
    // // get data from form and add to campgrounds array
    const meetingTopic = req.body.topic;
    const meetingStart = new Date(req.body['meeting-start-date']);
    const meetingEnd = new Date(req.body['meeting-end-date']);
    const meetingParticipants = req.body['meeting-participants'].split(',')
    const recurrence = req.body.recurring
    const occurrenceNumber = parseInt(req.body['occurrence-number'])
    const recurringMeetingsArray = []

    if (recurrence==='on') {
        //milliseconds in a week
        const oneWeek = 604800000
        for (let i = 1; i < parseInt(occurrenceNumber); i++) {
            console.log(meetingStart)
            recurringMeetingsArray.push(meetingStart.getTime() + oneWeek * i)
        }
    }

    User.find({ email: meetingParticipants })
        .then((users) => {
            const usersToInsert = users.map((user) => {
                return user._id
            })

            const newMeeting = { 
                meetingStart, 
                meetingEnd, 
                meetingTopic, 
                meetingParticipants: usersToInsert, 
                recurring: recurringMeetingsArray 
            }
            console.log('inserting new meeting:', newMeeting)
            // Create a new meeting and save to DB
            Meeting.create(newMeeting, function (err, newlyCreated) {
                if (err) {
                    console.log(err);
                } else {
                    //redirect back to campgrounds page
                    console.log(newlyCreated);
                    res.redirect('/');
                }
            });
        })
})

app.listen(process.env.PORT || 5000, function(){
    console.log('server running');
});


// The database contains:
// - Start and end date/time of a meeting
// - Topic of the meeting
// - Names of people in the meeting (max 10)
// - Repeating of meetings when you plan a meeting 


// Build a meeting web application using the following technologies:
// - Node.js
// - Mongodb
// - Typescript
// - Interface could be simple