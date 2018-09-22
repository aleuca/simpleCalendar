import * as mongoose from 'mongoose'
import { IUser } from '../interface'

const mongoUrl = 'mongodb://localhost/meetings'

mongoose.connect(mongoUrl)

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
})

const User = mongoose.model<IUser>('User', userSchema)

export { User }

//add new meeting to db