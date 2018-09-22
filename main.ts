/**
 * Module imports
 */
import * as express from 'express'
import * as mongoose from 'mongoose'
import * as parser from 'body-parser'

import { 
    Meeting, 
    createRandomMeetings, 
    averageParticipants, 
    avgMeetingsMonth, 
} from './db/meetings'

import { User } from './db/users'
import { IMeetingData } from './interface'

/**
 * Module variables
 */
const app = express()
app.use(parser.urlencoded({ extended: true }))
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))


/**
 * Module
 */

/**
 * show route for users
 */
app.get('/users/:id', function (req, res) {
    Promise.all([
        User.findById(req.params.id),
        Meeting.find({ meetingParticipants: req.params.id })
            .sort('meetingStart')
    ])
        .then(([foundUser, foundMeetings]) => {
            res.render('users', {
                userID: req.body.id,
                username: foundUser,
                numOfMeetings: foundMeetings.length,
                nextMeeting: foundMeetings[0].meetingStart
            })
        })
        .catch((err) => {
            console.log('Error while fetching user:', err)
            res.redirect('/')
        })
})

/**
 * main show route for first 5 meetings and stats
 */
app.get('/', function (req, res) {
    const beginningOfYear = new Date()
    beginningOfYear.setMonth(0)
    beginningOfYear.setDate(1)

    const endOfYear = new Date()
    endOfYear.setMonth(11)
    endOfYear.setDate(30)

    Promise.all([
        Meeting.count({}),
        User.find({}),
        Meeting.find({
            meetingStart: {
                $gte: new Date()
            }
        })
            .populate('meetingParticipants')
            .sort('meetingStart')
            .limit(20),
        Meeting.find({
            meetingStart: {
                $gte: beginningOfYear,
                $lte: endOfYear
            }
        })
    ])
        .then(([totalMeetings, users, nextTwenty, meetingsThisYear]) => {
            res.render('landing', {
                numOfMeetings: totalMeetings,
                nextTwenty: nextTwenty,
                users: users,
                average: averageParticipants(nextTwenty),
                avgMeetings: avgMeetingsMonth(meetingsThisYear)
            })
        })
        .catch((err) => {
            console.log('Error while fetching:', err)
            res.send('Error: server failure')
        })
})


/**
 * View form for creating new meeting
 */
app.get('/newMeeting', function (req, res) {
    res.render('newMeeting')
})

/**
 * Command to create 5000 random meetings
 */
app.post('/createRandom', function (req, res) {
    console.log('Creating 5000 random meetings')
    createRandomMeetings(5000)
        .then(() => {
            console.log('Successfully created 5000 meetings')
            res.redirect('/')
        })
        .catch((err) => {
            console.log('Error while creating random meetings:', err)
            res.redirect('/')
        })
})

/**
 * show route for meetings
 */
app.get('/meetings/:id', function (req, res) {
    Meeting.findById(req.params.id)
        .then((meeting) => {
            res.render('meetings', {
                meeting: meeting
            })
        })
        .catch((err) => {
            console.log('Error while fetching meeting:', err)
            res.redirect('/')
        })
})

/**
 * create a new meeting
 */
app.post('/meeting', function (req, res) {
    //insert into database
    const meetingTopic: string = req.body.topic
    const meetingStart: Date = new Date(req.body['meeting-start-date'])
    const meetingEnd: Date = new Date(req.body['meeting-end-date'])
    const meetingParticipants: string[] = req.body['meeting-participants'].split(',')
    const recurrence: string = req.body.recurring
    const occurrenceNumber = parseInt(req.body['occurrence-number'])
    const recurringMeetingsArray: Date[] = []

    if (recurrence === 'on') {
        //milliseconds in a week
        const oneWeek = 604800000
        for (let i = 1; i < occurrenceNumber; i++) {
            recurringMeetingsArray.push(new Date(meetingStart.getTime() + oneWeek * i))
        }
    }

    User.find({ email: meetingParticipants })
        .then((users) => {
            const usersToInsert: mongoose.Schema.Types.ObjectId[] = users.map(user => user._id)

            const newMeeting: IMeetingData = {
                meetingStart,
                meetingEnd,
                meetingTopic,
                meetingParticipants: usersToInsert,
                recurring: recurringMeetingsArray
            }
            console.log('Inserting new meeting:', newMeeting)

            // Create a new meeting and save to DB
            return Meeting.create(newMeeting)
        })
        .then((newMeeting) => {
            console.log('Created meeting:', newMeeting)
            res.redirect('/')
        })
        .catch((err) => {
            console.log('Error fetching meeting:', err)
            res.redirect('/')
        })
})

/**
 * run server
 */
const PORT = process.env.PORT || 5000
app.listen(PORT, function () {
    console.log(`server running on port ${PORT}`)
})
