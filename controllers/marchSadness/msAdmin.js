/**
 * Created by Mike on 1/22/2015.
 */
msModel = require('../../models/marchSadnessModel');

exports.updateSingleTeam = function (req, res) {
    "use strict";
    var scores, rounds, roundScore;
    scores = req.body.scores;
    msModel.msTeam.findOne({ "_id": req.params.teamId }, function (err, team) {
        if (err) {
            res.status(500).end();
        } else {
            team.scores = scores;
            team.totalScore = 0;
            rounds = ['1', '2', '3', '4', '5', '6'].map(function (e) {
                return 'round' + e.toString();
            });
            rounds.map(function (round) {
                roundScore =
                    team.scores[round].missed3 +
                    team.scores[round].missed2 * 2 +
                    team.scores[round].missedFT * 3;
                if (round === 'round3' || round === 'round4') {
                    roundScore *= 2;
                }
                if (round === 'round5' || round === 'round6') {
                    roundScore *= 3;
                }
                team.scores[round].score = roundScore;
                team.totalScore += roundScore;
            });
            team.save(function (err) {
                if (err) {
                    console.log('error saving team score');
                }
                res.status(200);
            });
        }
    });
};

var updateAllNames = function (apiNames, allTeamsMap, index, callback) {
    "use strict";
    if (index < apiNames.length) {
        msModel.msTeam.findOne({apiName: apiNames[index]}, function (err, result) {
            if (!err) {
                result.teamName = allTeamsMap[apiNames[index]];
                result.save(function (err) {
                    if (err) {
                        console.log('error saving ' + result.apiName);
                    }
                });
            }
            updateAllNames(apiNames, allTeamsMap, index + 1, callback);
        });
    } else {
        callback();
    }
};

exports.updateNames = function (req, res) {
    "use strict";
    var allTeamsMap, apiNames, sixteenArray, regionsArray, mb;
    apiNames = [];
    allTeamsMap = JSON.parse(req.body.allTeams);
    sixteenArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return x.toString();
        });
    regionsArray = ['north', 'south', 'east', 'west'];
    regionsArray.map(function (region) {
        sixteenArray.map(function (e) {
            apiNames.push(region + e);
        });
    });
    updateAllNames(apiNames, allTeamsMap, 0, function () {
        res.status(200).end();
    });
};

exports.getTeamsByRegion = function (callback) {
    "use strict";
    var north, south, east, west, regions;
    north = [];
    south = [];
    east = [];
    west = [];
    msModel.msTeam.find({}, function (err, teams) {
        if (!err) {
            var comparitor = function (a, b) {
                if (a.seed > b.seed) { return 1; }
                if (a.seed < b.seed) { return -1; }
                return 0;
            };
            teams.map(function (thisTeam) {
                if (thisTeam.region === 'north') {
                    north.push(thisTeam);
                } else if (thisTeam.region === 'south') {
                    south.push(thisTeam);
                } else if (thisTeam.region === 'east') {
                    east.push(thisTeam);
                } else {
                    west.push(thisTeam);
                }
            });
            north.sort(comparitor);
            south.sort(comparitor);
            east.sort(comparitor);
            west.sort(comparitor);
        }
        regions = {
            north: north,
            south: south,
            east: east,
            west: west
        };
        callback(regions);
    });
};