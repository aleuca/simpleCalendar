"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var mongoUrl = 'mongodb://localhost/meetings';
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl);
var meetingSchema = new mongoose.Schema({
    meetingStart: Date,
    meetingEnd: Date,
    meetingTopic: String,
    meetingParticipants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    recurring: [Date]
});
var Meeting = mongoose.model('Meeting', meetingSchema);
exports.Meeting = Meeting;
//add new meeting to db
