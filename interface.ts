import * as mongoose from "mongoose"

export interface IUserData {
    name?: string
    email?: string
}

export interface IUser extends mongoose.Document {
    name?: string
    email?: string
}

export interface IMeeting extends mongoose.Document {
    meetingStart?: Date,
    meetingEnd?: Date,
    meetingTopic?: String,
    meetingParticipants?: mongoose.Schema.Types.ObjectId[],
    recurring?: Date[]
}

export interface IMeetingData {
    meetingStart?: Date,
    meetingEnd?: Date,
    meetingTopic?: String,
    meetingParticipants?: mongoose.Schema.Types.ObjectId[],
    recurring?: Date[]
}