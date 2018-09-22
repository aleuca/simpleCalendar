/**
 * Module imports
 */

import * as mongoose from 'mongoose'
import { IUser } from '../interface'

/**
 * Module variables
 */

const mongoUrl = 'mongodb://localhost/meetings'

/**
 * Module
 */

mongoose.connect(mongoUrl)

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
})

const User = mongoose.model<IUser>('User', userSchema)

/**
 * Module exports
 */
export { User }
