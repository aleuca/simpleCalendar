"use strict";
/**
 * Module imports
 */
exports.__esModule = true;
var mongoose = require("mongoose");
/**
 * Module variables
 */
var mongoUrl = 'mongodb://localhost/meetings';
/**
 * Module
 */
mongoose.connect(mongoUrl);
var userSchema = new mongoose.Schema({
    name: String,
    email: String
});
var User = mongoose.model('User', userSchema);
exports.User = User;
