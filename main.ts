import * as express from 'express'
import * as mongoose from 'mongoose'
import * as parser from 'body-parser'
import { Meeting } from './db/meetings'
import { User } from './db/users'
import { createRandomMeetings, averageParticipants, avgMeetingsMonth } from './utils/utils'
import { IMeeting, IUser , IMeetingData } from './interface'

const app = express()
app.use(parser.urlencoded({extended: true}))
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))

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
            res.render('landing', {
                numOfMeetings: meetings.length,
                nextTwenty: nextTwenty,
                users: users,
                average: averageParticipants(nextTwenty),
                avgMeetings: avgMeetingsMonth(meetingsThisYear)
            })
        })
})


//View form for creating new meeting
app.get('/newMeeting', function(req, res) {
    res.render('newMeeting')
})

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
    const meetingTopic: string = req.body.topic
    const meetingStart: Date = new Date(req.body['meeting-start-date'])
    const meetingEnd: Date = new Date(req.body['meeting-end-date'])
    const meetingParticipants: string[] = req.body['meeting-participants'].split(',')
    const recurrence: string = req.body.recurring
    const occurrenceNumber = parseInt(req.body['occurrence-number'])
    const recurringMeetingsArray: Date[] = []

    if (recurrence==='on') {
        //milliseconds in a week
        const oneWeek = 604800000
        for (let i = 1; i < occurrenceNumber; i++) {
            recurringMeetingsArray.push(new Date(meetingStart.getTime() + oneWeek * i))
        }
    }

    User.find({ email: meetingParticipants })
        .then((users) => {
            const usersToInsert: mongoose.Schema.Types.ObjectId[] = users.map((user) => {
                return user._id
            })

            const newMeeting: IMeetingData = {
                meetingStart,
                meetingEnd,
                meetingTopic,
                meetingParticipants: usersToInsert,
                recurring: recurringMeetingsArray
            }
            console.log('inserting new meeting:', newMeeting)

            // Create a new meeting and save to DB
            return Meeting.create(newMeeting)
        })
        .then((newMeeting) => {
            console.log('newly created', newMeeting)
            res.redirect('/')
        })
})

app.listen(process.env.PORT || 5000, function(){
    console.log('server running')
})
