import * as mongoose from 'mongoose'
import { IMeeting } from '../interface'
const mongoUrl = 'mongodb://localhost/meetings'

mongoose.connect(mongoUrl)

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

const Meeting = mongoose.model<IMeeting>('Meeting', meetingSchema)

export { Meeting }

//add new meeting to db