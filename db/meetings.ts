/**
 * Module imports
 */

import * as mongoose from 'mongoose'
import * as faker from 'faker'
import { IMeeting, IMeetingData, IUser } from '../interface'
import { User } from './users'

/**
 * Module variables
 */

const mongoUrl = 'mongodb://localhost/meetings'

/**
 * Module
 */

mongoose.connect(mongoUrl)

const meetingSchema = new mongoose.Schema({
    start: Date,
    end: Date,
    topic: String,
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    recurring: [Date]
})

const Meeting = mongoose.model<IMeeting>('Meeting', meetingSchema)

async function createRandomMeetings(num: number): Promise <IMeeting[]> {
    const meetings: IMeetingData[] = []
    for(let i = 0; i < num; i++) {
        const randomOccurences: Date[] = []
        const randomNumUsers: IUser[] = await User.aggregate(
            [ {$sample: { size: Math.floor(1 + Math.random() * 10) }} ]
         )
        const start = Math.floor(946684800000 + Math.random() * 2838240000000)

        for(let j = 0; j < Math.floor(Math.random() * 10); j++) {
            const oneWeek = 604800000
            let newOccurrence = start + oneWeek * j
            randomOccurences.push(new Date(newOccurrence))
        }

        meetings.push({
            //starting at 2000-01-01
            start: new Date(start), 
            end: new Date(start + Math.floor(Math.random() * 28800000)), 
            topic: faker.lorem.sentence(), 
            participants: randomNumUsers.map((user) => user._id), 
            recurring: randomOccurences 
        })
    }
    return Meeting.insertMany(meetings)
}

function averageParticipants(array: IMeeting[]): number {
    const participants: number[] = []
    let sum: number = 0
    array.forEach((meeting) => {
        participants.push(meeting.participants.length)
    })

    participants.forEach((num: number) => {
        sum += num
    })

    return sum / participants.length
}

function avgMeetingsMonth(meetingsInAYear: IMeeting[]):number {
    return meetingsInAYear.length / 12
}

/**
 * Module exports
 */

export { 
    Meeting, 
    createRandomMeetings, 
    averageParticipants, 
    avgMeetingsMonth 
}
