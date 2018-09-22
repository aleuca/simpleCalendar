import { User } from './users'
import { Meeting } from './meetings'
import { IUserData, IUser } from '../interface'

const userData: IUserData[] = [
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
    .then(() => User.insertMany(userData))
    .then((users: IUser[]) => {
        console.log('created users', users)
        process.exit(0)
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })