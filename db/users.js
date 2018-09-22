"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var mongoUrl = 'mongodb://localhost/meetings';
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl);
var userSchema = new mongoose.Schema({
    name: String,
    email: String
});
var User = mongoose.model('User', userSchema);
exports.User = User;
//add new meeting to db
