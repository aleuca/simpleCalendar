"use strict";
/**
 * Module imports
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mongoose = require("mongoose");
var faker = require("faker");
var users_1 = require("./users");
/**
 * Module variables
 */
var mongoUrl = 'mongodb://localhost/meetings';
/**
 * Module
 */
mongoose.connect(mongoUrl);
var meetingSchema = new mongoose.Schema({
    start: Date,
    end: Date,
    topic: String,
    participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    recurring: [Date]
});
var Meeting = mongoose.model('Meeting', meetingSchema);
exports.Meeting = Meeting;
function createRandomMeetings(num) {
    return __awaiter(this, void 0, void 0, function () {
        var meetings, i, randomOccurences, randomNumUsers, start, j, oneWeek, newOccurrence;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    meetings = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < num)) return [3 /*break*/, 4];
                    randomOccurences = [];
                    return [4 /*yield*/, users_1.User.aggregate([{ $sample: { size: Math.floor(1 + Math.random() * 10) } }])];
                case 2:
                    randomNumUsers = _a.sent();
                    start = Math.floor(946684800000 + Math.random() * 2838240000000);
                    for (j = 0; j < Math.floor(Math.random() * 10); j++) {
                        oneWeek = 604800000;
                        newOccurrence = start + oneWeek * j;
                        randomOccurences.push(new Date(newOccurrence));
                    }
                    meetings.push({
                        //starting at 2000-01-01
                        start: new Date(start),
                        end: new Date(start + Math.floor(Math.random() * 28800000)),
                        topic: faker.lorem.sentence(),
                        participants: randomNumUsers.map(function (user) { return user._id; }),
                        recurring: randomOccurences
                    });
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, Meeting.insertMany(meetings)];
            }
        });
    });
}
exports.createRandomMeetings = createRandomMeetings;
function averageParticipants(array) {
    var participants = [];
    var sum = 0;
    array.forEach(function (meeting) {
        participants.push(meeting.participants.length);
    });
    participants.forEach(function (num) {
        sum += num;
    });
    return sum / participants.length;
}
exports.averageParticipants = averageParticipants;
function avgMeetingsMonth(meetingsInAYear) {
    return meetingsInAYear.length / 12;
}
exports.avgMeetingsMonth = avgMeetingsMonth;
