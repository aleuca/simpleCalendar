import * as faker from 'faker'
import { Meeting } from '../db/meetings'
import { User } from '../db/users'
import { IMeeting, IMeetingData, IUser } from '../interface'

export async function createRandomMeetings(num: number): Promise <IMeeting[]> {
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
            meetingStart: new Date(start), 
            meetingEnd: new Date(start + Math.floor(Math.random() * 28800000)), 
            meetingTopic: faker.random.alphaNumeric(12), 
            meetingParticipants: randomNumUsers.map((user) => user._id), 
            recurring: randomOccurences 
        })
    }
    return Meeting.insertMany(meetings)
}

export function averageParticipants(array: IMeeting[]): number {
    const participants: number[] = []
    let sum: number = 0
    array.forEach((meeting) => {
        participants.push(meeting.meetingParticipants.length)
    })

    participants.forEach((num: number) => {
        sum += num
    })

    return sum / participants.length
}

export function avgMeetingsMonth(meetingsInAYear: IMeeting[]):number {
    return meetingsInAYear.length / 12
}
