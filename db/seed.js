const { User } = require('./users')
const { Meeting } = require('./meetings')

const users = [
    {
        name: 'Alina',
        email: 'alina@alina.com'
    },
    {
        name: 'Dan',
        email: 'dan@dan.com'
    },
    {
        name: 'Garie',
        email: 'garie@garie.com'
    },
    {
        name: 'Eden',
        email: 'eden@eden.com'
    },
    {
        name: 'Lea',
        email: 'lea@lea.com'
    },
    {
        name: 'Misha',
        email: 'misha@misha.com'
    },
    {
        name: 'Kelly',
        email: 'kelly@kelly.com'
    },
    {
        name: 'Jeff',
        email: 'jeff@jeff.com'
    },
    {
        name: 'Lars',
        email: 'lars@lars.com'
    },
    {
        name: 'Camiel',
        email: 'camiel@camiel.com'
    },

]


Promise.all([
    Meeting.remove({}),
    User.remove({})
])
    .then(() => {
        users.forEach((user) => {
            User.create(user, function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('inserting user!', user)
                }
            });
        })
    })
    .catch((err) => {
        console.log(err)
    })