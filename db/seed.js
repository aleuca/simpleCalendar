"use strict";
/**
 * Module imports
 */
exports.__esModule = true;
var users_1 = require("./users");
var meetings_1 = require("./meetings");
/**
 * Module variables
 */
var userData = [
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
];
/**
 * Module
 */
Promise.all([
    meetings_1.Meeting.remove({}),
    users_1.User.remove({})
])
    .then(function () { return users_1.User.insertMany(userData); })
    .then(function (users) {
    console.log('created users', users);
    process.exit(0);
})["catch"](function (err) {
    console.log(err);
    process.exit(1);
});
