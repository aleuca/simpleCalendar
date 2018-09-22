const mongoose = require('mongoose')
const mongoUrl = 'mongodb://localhost/meetings'

mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl);

const meetingSchema = new mongoose.Schema({
    meetingStart: Date,
    meetingEnd: Date,
    meetingTopic: String,
    meetingParticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    recurring: [Date]
})

const Meeting = mongoose.model('Meeting', meetingSchema)

module.exports = {
    Meeting
}

//add new meeting to db