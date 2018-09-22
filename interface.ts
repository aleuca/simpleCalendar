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
    start?: Date,
    end?: Date,
    topic?: String,
    participants?: mongoose.Schema.Types.ObjectId[],
    recurring?: Date[]
}

export interface IMeetingData {
    start?: Date,
    end?: Date,
    topic?: String,
    participants?: mongoose.Schema.Types.ObjectId[],
    recurring?: Date[]
}