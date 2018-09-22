const faker = require('faker')
const { Meeting } = require('../db/meetings');
const { User } = require('../db/users')


async function createRandomMeetings(num) {
    const meetings = []
    for(let i = 0; i < num; i++) {
        const randomOccurence = []
        const randomNumUsers = await User.aggregate(
            [ {$sample: { size: Math.floor(1 + Math.random() * 10) }} ]
         )
        const start = Math.floor(946684800000 + Math.random() * 2838240000000)

        for(let j = 0; j < Math.floor(Math.random() * 10); j++) {
            const oneWeek = 604800000
            let newOcurrence = start + oneWeek * j
            randomOccurence.push(newOcurrence)
        }

        meetings.push({
            //starting at 2000-01-01
            meetingStart: new Date(start), 
            meetingEnd: new Date(start + Math.floor(Math.random() * 28800000)), 
            meetingTopic: faker.random.alphaNumeric(12), 
            meetingParticipants: randomNumUsers.map((user) => user._id), 
            recurring: randomOccurence 
        })
    }
    return Meeting.insertMany(meetings)
}


module.exports = createRandomMeetings