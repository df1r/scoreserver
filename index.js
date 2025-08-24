// Security Issues: Address these points at the end of the project.
// Learn about https

import express from "express";
import bodyParser from "body-parser"; //not sure this is necessary.
import fs from "fs";
import { consoleLogToFile } from "console-log-to-file";

const app = express();
const port = 3000;

var dateNow = new Date();
var timeNow = dateNow.getHours() + '-' + dateNow.getMinutes();
var logPath = "./logs/" + dateNow.toDateString() + ' -' + ' Start Time - ' + timeNow + ".log";

consoleLogToFile({
    logFilePath: logPath,
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

var doStatus = {
    maximumCoachId : 0,
    contestNumber: 1,
    teamContest: false,
    hostSchool: "Please enter host school",
    contestDate: "yyyy-mm-dd",
}

var doStatistician = {
    passWord: "CJML",
    session: 0,
}

var doCoaches = [];

var restoreStrings = [];


function isJSONString(str) {
    try {
        JSON.parse(str);
        return (true);
    } catch (e) {
        console.log("JSON problem");
        return (false);
    }
}

function isGoodBackupString(str) {
    var restoredObject = JSON.parse(str);
    try {
        if(restoredObject.doCoaches.length == restoredObject.doStatus.maximumCoachId) {
            return true;
        } else {
            console.log("Backup Object has mismatched maximumCoachId");
            return false;
        }
    } catch (e) {
        console.log("Backup Object has wrong keys");
        return false;
    }
}

function sumTen(array) {
    return (
        Number(array[0])
        + Number(array[1])
        + Number(array[2])
        + Number(array[3])
        + Number(array[4])
        + Number(array[5])
        + Number(array[6])
        + Number(array[7])
        + Number(array[8])
        + Number(array[9]));
}

function sumTopThree(array) {
    array.forEach((item) => { 
        item = Number(item);
    });
    if (array.length < 3) {
        return (array[1] || 0) + (array[0] || 0);
    } else {
        array.sort((a, b) => { return b - a });
        return array[0] + array[1] + array[2];
    }
}

function DoCoachRecord(iD, first, middle, last, school) { // This is a constructor function, used when a coach is added to the data object.
    this.iD = iD;
    this.passWord = "CJML";
    this.session = 0;
    this.first = first;
    this.middle = middle;
    this.last = last;
    this.school = school;
    this.students = []; // A student is a record with first, middle, last, iD
    this.scoreSheet = {
        studentPlacement: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        studentsEntered: false,
        scores : [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
        scoresEntered: false,
    };
    //These two values are checked when a coach clicks the name-entry or score-entry button.
    this.permission = {
        nameEntry : false,
        scoreEntry : false,
    }
    this.place = "TBD"
}


// *************************************************************************************************
// Syntax examples:
// dObjectRead("coach", 5);
// dObjectRead("contestStatus");
// dObjectRead("statistician");
// *************************************************************************************************

function dObjectRead(reqType, coachId) {

    switch (reqType) {
        case "coach":
            if (coachId) {
                var idx = doCoaches.findIndex((srchItem) => { return srchItem.iD == coachId });
                var returnedCoach = JSON.parse(JSON.stringify(doCoaches[idx]));
                return returnedCoach;
            } else {
                console.log("dObjectRead: coach ID was expected as second argument");
                return;
            }
        case "contestStatus":
            var returnedStatus = JSON.parse(JSON.stringify(doStatus));
            return returnedStatus;
        case "statistician":
            var returnedStatistician = JSON.parse(JSON.stringify(doStatistician));
            return returnedStatistician;
        default:
            console.log(`dObjectRead: reqType was expected to be "coach" or "contestStatus" or "statistician", not ${reqType}.`);
            return false;
    }
}

// *************************************************************************************************
// Syntax examples:
// dObjectWrite("coach", coachrecord);
// dObjectWrite("contestStatus", statusrecord);
// dObjectWrite("statistician", statisticianrecord);
// dObjectWrite("permissions", permissionrecord, 5);
// dObjectWrite("session", session, 5);
// dObjectWrite("place", 9, 12);
// Note that coachrecord must have ten keys, three of which themselves have keys;
// Note that statusrecord must have keys maximumCoachId, contestNumber, hostSchool, and contestDate;
// Note that permissionrecord must have the boolean values nameEntry and scoreEntry;
// Note that session must be a real number;
// Note that statisticianrecord has just two keys: passWord and session;
// *************************************************************************************************

function dObjectWrite(reqType, record, coachId) { 

    switch (reqType) {
        case "coach":
            if (record.iD == "new") {
                var statusRecord = dObjectRead("contestStatus");
                statusRecord.maximumCoachId += 1;
                dObjectWrite("contestStatus", statusRecord);
                record.iD = statusRecord.maximumCoachId;
                doCoaches.push(record);
                return true;
            } else {
                var idx = doCoaches.findIndex((srchItem) => { return srchItem.iD == record.iD });
                if (idx == -1) {
                    console.log("dObjectWrite: coachId not recognized.");
                    return false
                } else {
                    doCoaches[idx] = JSON.parse(JSON.stringify(record)); // For ease of coding I have
                        // not bothered to avoid storing doCoaches[idx].fullName. But I have
                        // tried to write the rest of the code with the assumption that the fullName
                        // key can be absent in the data object coach record.
                    return true;
                }
            }
        case "contestStatus":
            doStatus = JSON.parse(JSON.stringify(record));
            return true;
        case "permissions":
            if (coachId) {
                var idx = doCoaches.findIndex((srchItem) => { return srchItem.iD == coachId });
                doCoaches[idx].permission.nameEntry = record.nameEntry;
                doCoaches[idx].permission.scoreEntry = record.scoreEntry;
            } else {
                for (var j = 0; j < dbstatus.maximumCoachId; j++) { // This line assumes that doCoaches is never a sparse array,
                        // and that no coach ID's are ever skipped, both of which should be true.
                    doCoaches[j].permission.nameEntry = record.nameEntry;
                    doCoaches[j].permission.scoreEntry = record.scoreEntry;
                }
            }
            return true;
        case "session":
            var idx = doCoaches.findIndex((srchItem) => { return srchItem.iD == coachId });
            if (idx == -1) {
                console.log(`dObjectWrite: coach ID not recognized.`);
                return false;
            } else {
                doCoaches[idx].session = record; // This is a simple assignment of a number.
                return true;
            }
        case "place":
            var idx = doCoaches.findIndex((srchItem) => { return srchItem.iD == coachId });
            if (idx == -1) {
                console.log(`dObjectWrite: coach ID not recognized.`);
                return false;
            } else {
                doCoaches[idx].place = record; // This is a simple assignment of a number.
                return true;
            }
        case "statistician":
            doStatistician = JSON.parse(JSON.stringify(record));
            return true;
        default:
            console.log(`dObjectWrite: reqType was expected to be "coach" or "contestStatus" or "permissions" or "session" or "place" or "statistician", not ${reqType}`);
            return false;
    }
}

// addFullName adds a key called "fullName" to a record, to help the ejs code display students or coaches.

function addFullName(personRecord) {
        if (personRecord.middle == "") {
            personRecord.fullName = personRecord.first + " " + personRecord.last;
        } else {
            personRecord.fullName = personRecord.first + " " + personRecord.middle + " " + personRecord.last;
        }
    return;
}

// makeAlphaSchoolsList uses the list of coaches in the data object to create an alphabetical list of schools.

function makeAlphaSchoolsList() {
    var max = dObjectRead("contestStatus").maximumCoachId;
    var alphaSchools = [];
    for (var iD = 1; iD <= max; iD++){ 
        var coach =  dObjectRead("coach", iD); 
        alphaSchools.push({school : coach.school, coachId : iD,});
    }
    alphaSchools.sort((a, b) => {
        if (a.school.toUpperCase() >= b.school.toUpperCase()) {
            return 1;
        } else {
            return -1;
        }
    });
    return alphaSchools;
}

// makeAlphaStudentsList uses the coach's student array to create an alphabetical list of students.
// Also, makeAlphaStudentsList adds the fullName key to each student.

function makeAlphaStudentsList(coach) {
    var alphaStudentsList = JSON.parse(JSON.stringify(coach.students));
    alphaStudentsList.sort((studentA, studentB) => {
        if (studentA.middle.toUpperCase() >= studentB.middle.toUpperCase()) {
            return (1);
        } else {
            return (-1);
        }
    });

    alphaStudentsList.sort((studentA, studentB) => {
        if (studentA.first.toUpperCase() >= studentB.first.toUpperCase()) {
            return (1);
        } else {
            return (-1);
        }
    });

    alphaStudentsList.sort((studentA, studentB) => {
        if (studentA.last.toUpperCase() >= studentB.last.toUpperCase()) {
            return (1);
        } else {
            return (-1);
        }
    });
    alphaStudentsList.forEach((student) => { 
        addFullName(student);
    });
    return (alphaStudentsList);
}

function isClean(someArray){ // Checks whether an array of length 10 contains any repeated items
    for (var i=0; i<9; i++) {
        if ((someArray[i] != "empty") && (someArray[i] != "addStudent")){
            for (var j=i+1; j<10; j++) {
                if(someArray[i]==someArray[j]){return false;}
            }
        }
    }
    return true;
}

function fillSpaces(studentArray, scoreArray) { // Shifts items in a student array to fill empty spaces, and
                                    // concurrently shifts the items in the scores arrays.
    var fillingHappened = false;
    var emptySpots = [];
    var top=9;
    while((top > -1) && (studentArray[top]=="empty")) {top--;}
    for (var j=0; j<top; j++){
        if (studentArray[j] == "empty"){
            emptySpots.push(j);
            fillingHappened = true;
        }
    }
    if (fillingHappened){
        for (var j=emptySpots.length-1; j>=0; j--){
            for (var k=emptySpots[j]; k<9; k++){
                studentArray[k] = studentArray[k + 1];
                for (var l = 0; l < 10; l++) {
                    scoreArray[k][l] = scoreArray[k + 1][l];
                }
            }
            studentArray[9] = "empty";
            for (var l = 0; l < 10; l++) {
                scoreArray[9][l] = 0;
            }
        }
    }
    var returnObject = []
    returnObject.studentArray = studentArray;
    returnObject.scoreArray = scoreArray;
    returnObject.fillingHappened = fillingHappened;
    return returnObject;
}



app.get("/", (req, res)=>{
    var arrivalMsg = (req.query.arrivedFrom || "");
    console.log(`Login page. ${arrivalMsg}`)
    var alphaSchools = makeAlphaSchoolsList();
    var contestStatus = dObjectRead("contestStatus");
    res.render("index.ejs", {
        alphaSchools : alphaSchools,
        arrivalMsg: arrivalMsg,
        contestStatus: contestStatus,
    });
});

app.post("/", (req, res) => {
    if (req.body.coachId == "statistician") {
        var statistician = dObjectRead("statistician");
        if (req.body.passWord == statistician.passWord) {
            console.log(`Statistician has logged in.`);
            statistician.session = Math.random();
            dObjectWrite("statistician", statistician);
            var contestStatus = dObjectRead("contestStatus");
            var coachList = [];
            for (var j = 1; j <= contestStatus.maximumCoachId; j++) {
                coachList.push(dObjectRead("coach", j));
            }
            coachList.forEach((coach) => {
                addFullName(coach);
            });
            var alphaSchools = makeAlphaSchoolsList();
            res.render("statistician.ejs", {
                state: "readOnly",
                contestStatus: contestStatus,
                coachList: coachList,
                alphaSchools: alphaSchools,
                session: statistician.session, // At the next server request the session number must match, to prevent simultaneous logins.
                announcements: null,
            });
        } else {
            res.redirect("/?arrivedFrom=wrongpwd");
        }
    } else {
        var coach = dObjectRead("coach", req.body.coachId);
        var currentStatus = dObjectRead("contestStatus");
        if (req.body.passWord == coach.passWord) {
            coach.session = Math.random();
            dObjectWrite("session", coach.session, coach.iD);
            addFullName(coach);
            console.log(`Coach ${coach.iD}: ${coach.school} has logged in.`);
            var alphaStudents = makeAlphaStudentsList(coach);
            res.render("coach.ejs",
                {
                    state: "readOnly",
                    coachId: coach.iD, // This value is posted by the coach's form to allow checking of whether the session number matches.
                    session: coach.session, // ... to allow checking of whether the session number matches.
                    coachFullName: coach.fullName, // The full coach record is not sent, to avoid serving the password.
                    coachSchool: coach.school,
                    alphaStudents: alphaStudents,
                    coachScoreSheetStudentPlacement: coach.scoreSheet.studentPlacement,
                    coachScoreSheetScores: coach.scoreSheet.scores,
                    currentStatusHostSchool: currentStatus.hostSchool,
                    currentStatusContestDate: currentStatus.contestDate,
                    currentStatusContestNumber: currentStatus.contestNumber,
                    currentStatusTeamContest: currentStatus.teamContest,
                    editTeam: false,
                    place: coach.place,
                    coachFirst: "",
                    coachMiddle: "",
                    coachLast: "",
                });
        } else {
            res.redirect("/?arrivedFrom=wrongpwd");
        }
    }
});



app.post("/statistician", (req, res) => {
    var statistician = dObjectRead("statistician");
    console.log(`statistician: Request ${req.body.requestType}`);
    if (statistician.session == req.body.session) {
        var announcements;
        var contestStatus = dObjectRead("contestStatus");
        var state = "readOnly";
        var coachList = [];
        for (var j = 1; j <= contestStatus.maximumCoachId; j++) {
            coachList.push(dObjectRead("coach", j));
        }
        coachList.forEach((coach) => {
            addFullName(coach);
        });
        if (req.body.requestType.startsWith("namePermission")) {
            var coachId = req.body.requestType.slice(14);
            req.body.requestType = "namePermission"
        }
        if (req.body.requestType.startsWith("scorePermission")) {
            var coachId = req.body.requestType.slice(15);
            req.body.requestType = "scorePermission"
        }
        switch (req.body.requestType) {
            case "readOnly":
                break;
            case "openNames": // Open name entry for ALL coaches
                coachList.forEach((coach) => {
                    coach.permission.nameEntry = true;
                    dObjectWrite("permissions", coach.permission, coach.iD);
                });
                break;
            case "closeNames": // Close name entry for ALL coaches
                coachList.forEach((coach) => {
                    coach.permission.nameEntry = false;
                    dObjectWrite("permissions", coach.permission, coach.iD);
                });
                break;
            case "openScores": // Open score entry for ALL coaches
                coachList.forEach((coach) => {
                    coach.permission.scoreEntry = true;
                    dObjectWrite("permissions", coach.permission, coach.iD);
                });
                break;
            case "closeScores": // Close score entry for ALL coaches
                coachList.forEach((coach) => {
                    coach.permission.scoreEntry = false;
                    dObjectWrite("permissions", coach.permission, coach.iD);
                });
                break;
            case "namePermission": // Toggle name entry permission for one coach (coachId, computed above)
                var idx = coachId - 1;
                coachList[idx].permission.nameEntry = !(coachList[idx].permission.nameEntry);
                dObjectWrite("permissions", coachList[idx].permission, coachId);
                break;
            case "scorePermission": // Toggle score entry permission for one coach (coachId, computed above)
                var idx = coachId - 1;
                coachList[idx].permission.scoreEntry = !(coachList[idx].permission.scoreEntry);
                dObjectWrite("permissions", coachList[idx].permission, coachId);
                break;
            case "modifyVenue":
                state = "modifyVenue";
                break;
            case "submitVenue":
                var statusRecord = {
                    maximumCoachId: contestStatus.maximumCoachId,
                    contestNumber: req.body.contestNumber,
                    teamContest: false,
                    hostSchool: req.body.hostSchool,
                    contestDate: req.body.contestDate,
                }
                if (req.body.teamContest) { statusRecord.teamContest = true } ;
                dObjectWrite("contestStatus", statusRecord);
                contestStatus = dObjectRead("contestStatus");
                break;
            case "newContest":
                state = "modifyVenue";
                coachList.forEach((coach) => {
                    coach.permission = {
                        nameEntry: false,
                        scoreEntry: false,
                    }
                    coach.scoreSheet = {
                        studentPlacement: ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
                        studentsEntered: false,
                        scores: [
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ],
                        scoresEntered: false,
                    }
                    coach.session = 0; // Log out all coaches
                    coach.place = "TBD";
                    dObjectWrite("coach", coach);
                });
                break;
            case "changePwd":
                res.render("changePwd.ejs", {
                    instrMsg: "Use the fields below to change your password. All fields are required.",
                    returnPath: "/statistician",
                    coachId: "statistician",
                    session: statistician.session,
                });
                return;
            case "updatePwd":
                if (req.body.firstEntry != req.body.secondEntry) {
                    res.render("changePwd.ejs", {
                        instrMsg: "Error: Passwords did not match. Please try again.",
                        returnPath: "/statistician",
                        coachId: "statistician",
                        session: statistician.session,
                    });
                    return;
                } else {
                    statistician.passWord = req.body.firstEntry;
                    dObjectWrite("statistician", statistician);
                    break;
                }
            case "computeRanking":  // This not only populates the coach.place's, but also renders the announcements.
                state = "showAnnouncements"; // Open the contest ending box when the state is showAnnouncements.
                if (!(contestStatus.teamContest)) {
                    announcements = {
                        firstPlace: "1: ",
                        secondPlace: "2: ",
                        thirdPlace: "3: ",
                        highScore: 0,
                        highScorers: "",
                    };
                    var teamScores = [];
                    coachList.forEach((coach) => {
                        var varsityScores = [];
                        for (var j = 0; j < 5; j++) {
                            varsityScores.push(sumTen(coach.scoreSheet.scores[j]));
                            announcements.highScore = Math.max(announcements.highScore, varsityScores[varsityScores.length - 1]);
                        }
                        for (var j = 5; j < 10; j++) {
                            announcements.highScore = Math.max(announcements.highScore, sumTen(coach.scoreSheet.scores[j]));
                        }
                        // varsityScores.sort((scoreA, scoreB) => {
                        //     return (scoreB - scoreA);
                        // });
                        // teamScores.push(varsityScores[0] + varsityScores[1] + varsityScores[2]);
                        teamScores.push(sumTopThree(varsityScores));
                    });
                    var sortedScores = teamScores.slice().sort((scoreA, scoreB) => { return (scoreB - scoreA) });
                    var ranking = teamScores.map((score) => { return (sortedScores.findIndex((sortedScore) => { return (sortedScore == score); }) + 1) });
                    var j = 0;
                    coachList.forEach((coach) => {
                        coach.place = ranking[j];
                        if (ranking[j] == 1) {
                            announcements.firstPlace = announcements.firstPlace + coach.school + ", score=" + teamScores[coach.iD - 1] + "\n";
                        } else if (ranking[j] == 2) {
                            announcements.secondPlace = announcements.secondPlace + coach.school + ", score=" + teamScores[coach.iD - 1] + ",\n";
                        } else if (ranking[j] == 3) {
                            announcements.thirdPlace = announcements.thirdPlace + coach.school + ", score=" + teamScores[coach.iD - 1] + ",\n";
                        }
                        dObjectWrite("place", coach.place, coach.iD);
                        j++;
                        for (var k = 0; k < 10; k++) {
                            if (sumTen(coach.scoreSheet.scores[k]) == announcements.highScore) {
                                addFullName(coach.students[coach.scoreSheet.studentPlacement[k] - 1]);
                                announcements.highScorers = announcements.highScorers + coach.school + ": "
                                    + coach.students[coach.scoreSheet.studentPlacement[k] - 1].fullName + ",\n";
                            }
                        }
                    });
                    console.log(`High scorers are ${announcements.highScorers}`);
                } else {
                    announcements = {
                        firstPlace: "1: ",
                        secondPlace: "2: ",
                        thirdPlace: "3: ",
                    };
                    var teamScores = [];
                    coachList.forEach((coach) => {
                        teamScores.push(sumTen(coach.scoreSheet.scores[0]));
                    });
                    var sortedScores = teamScores.slice().sort((scoreA, scoreB) => { return (scoreB - scoreA) });
                    var ranking = teamScores.map((score) => { return (sortedScores.findIndex((sortedScore) => { return (sortedScore == score); }) + 1) });
                    var j = 0;
                    coachList.forEach((coach) => {
                        coach.place = ranking[j];
                        if (ranking[j] == 1) {
                            announcements.firstPlace = announcements.firstPlace + coach.school + ", score=" + teamScores[coach.iD - 1] + "\n";
                        } else if (ranking[j] == 2) {
                            announcements.secondPlace = announcements.secondPlace + coach.school + ", score=" + teamScores[coach.iD - 1] + ",\n";
                        } else if (ranking[j] == 3) {
                            announcements.thirdPlace = announcements.thirdPlace + coach.school + ", score=" + teamScores[coach.iD - 1] + ",\n";
                        }
                        dObjectWrite("place", coach.place, coach.iD);
                        j++;
                    });
                }
                break;
            case "downloadPasteable":
                var lines = [];
                var maxNumberStudents = 0;
                coachList.forEach((coach) => { 
                    maxNumberStudents = Math.max(maxNumberStudents, coach.students.length);
                });
                if (contestStatus.teamContest) { 
                    lines[0] = contestStatus.contestDate + "," + contestStatus.contestNumber;
                    coachList.forEach((coach) => {  // The cb parameter "coach" is not used, but this seems like the clearest way to write loop.
                        lines[0] += ",".repeat(12);
                    });
                    lines[0] = lines[0].slice(0,-1); // Date, Contest number, then 11 empty cells for the first coach, 12 for each thereafter
                    lines[1] = ",";
                    coachList.forEach((coach) => { 
                        lines[1]+=coach.school+","+"Participated,Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8,Q9,Q10,"
                    });
                    lines[1] = lines[1].slice(0, -1); // This is to remove the trailing comma after the final "Q10".
                    lines[2] = "";
                    coachList.forEach((coach) => { 
                        lines[2] += "," + coach.fullName + "," + coach.scoreSheet.studentPlacement[0];
                        for (var k = 0; k < 10; k++) { 
                            lines[2] += "," + coach.scoreSheet.scores[0][k];
                        }
                    });
                    lines[3] = "";
                    coachList.forEach((coach) => { 
                        lines[3] += ",".repeat(12); // no. columns = 1+12*(no. coaches), so no. commas = 12*(no. coaches)
                    });
                    // for (var j = 4; j < 13; j++) { 
                    for (var row = 5; row < 14; row++) { 
                        lines[row - 1] = lines[row - 2];
                    }
                } else { 
                    lines[0] = contestStatus.contestDate + "," + contestStatus.contestNumber;
                    coachList.forEach((coach) => { 
                        lines[0] += ",".repeat(12);
                    });
                    lines[0] = lines[0].slice(0,-1); // Date, Contest number, then 11 empty cells for the first coach, 12 for each thereafter
                    lines[1] = ",";
                    coachList.forEach((coach) => { 
                        lines[1]+=coach.school+","+"Students,Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8,Q9,Q10,"
                    });
                    lines[1] = lines[1].slice(0, -1); // This is to remove the trailing comma after the final "Q10".
                    lines[2] = "";
                    coachList.forEach((coach) => { // filling row 3 with studentSeat 1 on the sheet
                        var studentId = coach.scoreSheet.studentPlacement[0];
                        if (studentId == "empty") { studentId = 0; }
                        lines[2] += "," + coach.fullName + "," + studentId;
                        for (var k = 0; k < 10; k++) { 
                            lines[2] += "," + coach.scoreSheet.scores[0][k];
                        }
                    });
                    for (var row = 4; row < 13; row++) { 
                        lines[row - 1] = "";
                        var studentSeat = row - 2;
                        coachList.forEach((coach) => { 
                            var studentId = coach.scoreSheet.studentPlacement[studentSeat - 1];
                            if (studentId == "empty") { studentId = 0; }
                            lines[row - 1] += ",," + studentId;
                            for (var k = 0; k < 10; k++) { 
                                lines[row - 1] += "," + coach.scoreSheet.scores[studentSeat - 1][k];
                            }
                        });
                    }
                    lines[12] = ""; // row 13 is blank
                    coachList.forEach((coach) => { 
                        lines[12] += ",".repeat(12);
                    });
                }
                for (var row = 14; row < 14 + maxNumberStudents; row++) { 
                    lines[row - 1] = "";
                    var stId = row - 13;
                    coachList.forEach((coach) => { 
                        var nextCoach = "";
                        if (coach.students.length >= stId) {
                            var student = coach.students[stId - 1];
                            nextCoach += "," + student.first + "," +
                                    student.middle + "," + 
                                    student.last + ",".repeat(9);
                        } else {
                            nextCoach += ",".repeat(12);
                        }
                        lines[row - 1] += nextCoach;
                    });
                }
                var CSVFile = "./public/CSVContestResult.txt"
                var CSVFileContent = "";
                lines.forEach((line) => { 
                    CSVFileContent += line + "\n";
                });
                fs.writeFile(CSVFile, CSVFileContent, (err) => {
                    if (err) {
                        console.log("Error writing file. Error message follows.");
                        console.log(err);
                        return;
                    } else {
                        res.download(CSVFile, "yyyy contest " + contestStatus.contestNumber + ".csv", (err) => {
                            if (err) {
                                console.log("contest download error: ", err);
                                console.log("headersSent: ", Object.keys(res._headerSent));
                            } else {
                                console.log("The contest file was sent to the statistician for download.")
                            }
                        });
                    }
                })
                return;
            case "downloadBackup":
                var JSONFile = "./public/JSONBackup.json";
                var backupJSON = '{"doCoaches":'+JSON.stringify(doCoaches)+',"doStatus":'+JSON.stringify(doStatus)+"}";
                fs.writeFile (JSONFile, backupJSON, (err) => { 
                    if (err) {
                        console.log("backupJSON writeFile error: ", err);
                    } else {
                        res.download(JSONFile, "yymmdd backup.json", (err) => {
                            if (err) {
                                console.log("backup.json download error: ", err);
                                console.log("headersSent: ", Object.keys(res._headerSent));
                            } else {
                                console.log("The backup file was sent to the statistician for download.")
                            }
                        });
                    }
                });
                return;
            case "restoreBackup":
                break;
            case "cleanDeleted":
                coachList.forEach((coach) => {
                    let deleteIndices = [];
                    coach.students.forEach((student) => {
                        if (student.last.startsWith("!")) {
                            var idx = coach.students.findIndex((a) => { return (a.iD == student.iD) });
                            deleteIndices.push(idx);
                        }
                    });
                    for (var j = deleteIndices.length - 1; j >= 0; j--) {
                        coach.students.splice(deleteIndices[j], 1);
                    }
                    dObjectWrite("coach", coach);
                });
                break;
            case "restartLogFile":
                console.log(`logPath: ${logPath}`);
                console.log(`filename: ${logPath.slice(6)}`);
                res.download(logPath, logPath.slice(6), (err) => {
                    if (err) {
                        console.log("Error downloading log file: ", err);
                    } else {
                        fs.rm(logPath, { force: true }, (err) => {
                            if (err) {
                                console.error('Error deleting file:', err);
                            } else {
                                console.log('File deleted successfully!');
                                dateNow = new Date();
                                timeNow = dateNow.getHours() + '-' + dateNow.getMinutes();
                                logPath = "./logs/" + dateNow.toDateString() + ' -' + ' Start Time - ' + timeNow + ".log";
                                consoleLogToFile({
                                    logFilePath: logPath,
                                })
                            }
                        });
                    }
                });
                return;
            default:
                console.log("statistician.ejs returned an unrecognized requestType of ", req.body.requestType);
        }
        var alphaSchools = makeAlphaSchoolsList();
        res.render("statistician.ejs", {
            state: state,
            contestStatus: contestStatus,
            coachList: coachList,
            alphaSchools: alphaSchools,
            session: statistician.session,
            announcements: announcements,
        });
    } else {
        console.log(`Statistician: session was terminated by server`)
        res.redirect("/?arrivedFrom=bumped");
    }
});

app.post("/restore", (req, res) => { 
    var statistician = dObjectRead("statistician");
    if (statistician.session == req.body.session) {
        var nStart = req.body.packetStats.search(/\d+/); // format of packetStats is /p\d#\D\d#z/. Example: p203t237z.
        var nEnd = nStart + req.body.packetStats.slice(nStart).search(/\D/);
        var tStart = nEnd + req.body.packetStats.slice(nEnd).search(/\d+/);
        var tEnd = tStart + req.body.packetStats.slice(tStart).search(/\D/);
        var packetNumber = Number(req.body.packetStats.slice(nStart, nEnd));
        var packetTotal = Number(req.body.packetStats.slice(tStart, tEnd));
        restoreStrings[packetNumber-1] = req.body.packetBody;
        var j = packetTotal;
        while ((j > 0) && (restoreStrings[j - 1])) { j--; };
        if (j == 0) {
            console.log("Statistician: Restoring from backup");
            var contestStatus = dObjectRead("contestStatus");
            var backupJSON = "";
            for (j = 0; j < packetTotal; j++) {
                backupJSON += restoreStrings[j];
                restoreStrings[j] = null; // This is necessary so that the next restore will work as planned
            }
            if ((isJSONString(backupJSON)) && isGoodBackupString(backupJSON)) {
                var backedUpObject = JSON.parse(backupJSON);
                doStatus = backedUpObject.doStatus;
                contestStatus = dObjectRead("contestStatus");
                doCoaches = backedUpObject.doCoaches;
                doCoaches.forEach((coach) => {
                    coach.place = "TBD";
                });
                var coachList = [];
                for (var j = 1; j <= contestStatus.maximumCoachId; j++) {
                    coachList.push(dObjectRead("coach", j));
                }
                coachList.forEach((coach) => {
                    addFullName(coach);
                });
                console.log("Backup successful");
                res.render("statistician.ejs", {
                    state: "readOnly",
                    contestStatus: contestStatus,
                    coachList: coachList,
                    alphaSchools: makeAlphaSchoolsList(),
                    session: statistician.session,
                    announcements: "",
                });
            } else {
                console.log("Backup aborted");
                return res.send('<h1>Data not valid</h1><a href="javascript:history.back()">Back</a>');
            }
        }
        // put something here to send something to the client so that the browser doesn't seem to be hanging.
    } else {
        console.log(`Statistician: session was terminated by server`);
        res.redirect("/?arrivedFrom=bumped");
    }
});

app.post("/manageTeams", (req, res) => {
    var statistician = dObjectRead("statistician");
    var editTeam = "none";
    console.log(`statistician: Request ${req.body.requestType}`);
    if (statistician.session == req.body.session) {
        req.body.summerMode = req.body.summerMode || false;
        var contestStatus = dObjectRead("contestStatus");
        var coachList = [];
        for (var j = 1; j <= contestStatus.maximumCoachId; j++) {
            coachList.push(dObjectRead("coach", j));
        }
        coachList.forEach((coach) => {
            addFullName(coach);
        });
        if (req.body.requestType.startsWith("editTeam")) {
            var coachId = req.body.requestType.slice(8);
            req.body.requestType = "editTeam"
        }
        if (req.body.requestType.startsWith("updateTeam")) {
            var coachId = req.body.requestType.slice(10);
            req.body.requestType = "updateTeam"
        }
        if (req.body.requestType.startsWith("deleteTeam")) {
            var coachId = req.body.requestType.slice(10);
            req.body.requestType = "deleteTeam"
        }
        switch (req.body.requestType) {
            case "manageTeams":
                break;
            case "summerModeOff":
                req.body.summerMode = false;
                break;
            case "summerModeOn":
                req.body.summerMode = true;
                break;
            case "cleanDeleted":
                coachList.forEach((coach) => {
                    var studentListLength = coach.students.length;
                    for (var j = studentListLength - 1; j >= 0; j--) {
                        if (coach.students[j].last.startsWith("!")) {
                            coach.students.splice(j, 1);
                        }
                    };
                    dObjectWrite("coach", coach);
                });
                break;
            case "editTeam":
                editTeam = coachId;
                break;
            case "updateTeam":
                var idx = coachId - 1;
                coachList[idx].first = req.body.coachFirst;
                coachList[idx].middle = req.body.coachMiddle;
                coachList[idx].last = req.body.coachLast;
                coachList[idx].school = req.body.coachSchool;
                addFullName(coachList[idx]);
                dObjectWrite("coach", coachList[idx]);
                break;
            case "deleteTeam":
                for (var j = coachId; j < contestStatus.maximumCoachId; j++) {
                    var idx1 = j - 1; // Recall that the array index is one less than the coach ID
                    var idx2 = j; // idx2 is the index of the coach that is being copied downward
                    coachList[idx1] = coachList[idx2];
                    coachList[idx1].iD = idx2; // alternatively, coachList[idx1].iD = idx1+1;
                    dObjectWrite("coach", coachList[idx1]);
                    addFullName(coachList[idx1]);
                }
                coachList = coachList.slice(0, -1); 
                doCoaches = doCoaches.slice(0, -1);
                contestStatus.maximumCoachId = contestStatus.maximumCoachId - 1;
                dObjectWrite("contestStatus", contestStatus);
                break;
            case "addTeam":
                var newTeam = new DoCoachRecord("new", req.body.coachFirst, req.body.coachMiddle, req.body.coachLast, req.body.coachSchool);
                dObjectWrite("coach", newTeam); // When coach.iD = "new" then dObjectWrite knows to add this coach to the end of the data object.
                addFullName(newTeam);
                coachList.push(newTeam);
                break;
            default:
        }
        var alphaSchools = makeAlphaSchoolsList();
        res.render("manageteams.ejs", {
            coachList: coachList,
            alphaSchools: alphaSchools,
            session: statistician.session,
            summerMode: req.body.summerMode,
            editTeam: editTeam,
        })
    } else {
        console.log(`Statistician: session was terminated by server`)
        res.redirect("/?arrivedFrom=bumped");
    }
});

app.post("/statisticianroster", (req, res) => { 
    var statistician = dObjectRead("statistician");
    console.log(`statistician: Request ${req.body.requestType}`);
    if (statistician.session == req.body.session) { 
        var coachId = req.body.coachId; // This value is null if the post call was made by manageteams.ejs. See the "manageRoster" handling below.
        var studentId = "none";
        if (req.body.requestType.startsWith("manageRoster")) {
            coachId = req.body.requestType.slice(12);
            req.body.requestType = "manageRoster";
        } 
        if (req.body.requestType.startsWith("editStudent")){
            studentId = req.body.requestType.slice(11);
            req.body.requestType = "editStudent";
        }
        if (req.body.requestType.startsWith("updateStudent")){
            studentId = req.body.requestType.slice(13);
            req.body.requestType = "updateStudent";
        }
        var coach = dObjectRead("coach", coachId);
        addFullName(coach);
        var alphaStudents = makeAlphaStudentsList(coach);
        switch (req.body.requestType) {
            case "manageRoster": // Nothing is needed beyond sending the coach record determined above.
                break;
            case "editStudent": //Nothing is needed beyond sending the studentId value (set to other than "none").
                break;
            case "updateStudent":
                var idx = coach.students.findIndex((student) => {
                    return (student.iD == studentId);
                });
                coach.students[idx].first = req.body.first;
                coach.students[idx].middle = req.body.middle;
                coach.students[idx].last = req.body.last;
                dObjectWrite("coach", coach);
                studentId = "none"; // This tells statisticianroster.ejs to not change any student list items into a form.
                var alphaStudents = makeAlphaStudentsList(coach); // This will take care of adding the fullName key to the modified student.
                break;
            case "addStudent":
                var newId = 1+coach.students.length;
                coach.students.push({
                    first: req.body.first,
                    middle: req.body.middle,
                    last: req.body.last,
                    iD: newId,
                });
                dObjectWrite("coach", coach);
                var alphaStudents = makeAlphaStudentsList(coach); // This will take care of adding the fullName key to the added student.
                break;
            case "passWordReset":
                coach.passWord = "CJML";
                dObjectWrite("coach", coach);
                break;
            default:
        }
        res.render("statisticianroster.ejs", {
            session: statistician.session,
            coach: coach,
            studentId: studentId,
            alphaStudents: alphaStudents,
        });
    } else {
        console.log(`Statistician: session was terminated by server`)
        res.redirect("/?arrivedFrom=bumped");
    }
});

app.post("/coach", (req, res)=>{ 
    var coach = dObjectRead("coach", req.body.coachId);
    var currentStatus = dObjectRead("contestStatus");
    var state = "readOnly";
    var numAddedStuds = 0; // Used to keep track of how many name "add student" requests have been made so far.
                            // These students are temporarily named with a numeric suffix, as in " Student3".
    var displayShiftWarning = ""; // This is not currently used, but will be in a future version.
    var duplicates = false; // Used when scoresheet names are submitted, to determine whether to accept the submission.
    var namesLockedMsg = false; // Tells whether to display the warning that names are locked.
    var scoresLockedMsg = false; // Tells whether to display the warning that scores are locked.
    var coachScoreSheetStudentPlacement = coach.scoreSheet.studentPlacement;
    var editTeam = false; //Tells whether to put the team name and coach name in editable text fields.
    addFullName(coach);
    console.log(`${coach.iD}: Request ${req.body.requestType}`);
    if (coach.session == req.body.session) {
        switch (req.body.requestType) {
            case "readOnly":
                state = "readOnly";
                break;
            case "manageRoster":
                var alphaStudents = makeAlphaStudentsList(coach);
                res.render("roster.ejs", {
                    alphaStudents: alphaStudents,
                    coachId: coach.iD,
                    session: coach.session,
                });
                return;
            case "enterNames":
                if (coach.permission.nameEntry) {
                    state = "enterNames";
                } else {
                    console.log(`${coach.iD}: Deny permission to enter names`); // come here when the coach is refused permission to enter names.
                    state = "readOnly";
                    namesLockedMsg = true;
                }
                break;
            case "submitNames":
                if (coach.permission.nameEntry) {
                    var emptySpaceFound = false;
                    var tempCoachScoreSheetStudentPlacement = [ // record student placements in a temporary array
                        req.body.selectStudent0,
                        req.body.selectStudent1,
                        req.body.selectStudent2,
                        req.body.selectStudent3,
                        req.body.selectStudent4,
                        req.body.selectStudent5,
                        req.body.selectStudent6,
                        req.body.selectStudent7,
                        req.body.selectStudent8,
                        req.body.selectStudent9,
                    ];
                    numAddedStuds = req.body.numAddedStuds;
                    var listLength = coach.students.length;
                    for (var j = 0; j < 10; j++) {
                        if (tempCoachScoreSheetStudentPlacement[j] == "addStudent") {
                            numAddedStuds++;
                            var newId = listLength + numAddedStuds;
                            coach.students.push(
                                {
                                    first: "New",
                                    middle: "",
                                    last: (" Student" + numAddedStuds), // The space before the 'S' is to place it alphabetically first.
                                    iD: newId,
                                }
                            );
                            tempCoachScoreSheetStudentPlacement[j] = newId;
                        }
                    }
                    // Before checking for duplicates on the scoresheet, update the list of students in the data object.
                    dObjectWrite("coach", coach);
                    // Check that the list of students on the scoresheet is "clean" and if so finish updating the data object.
                    if (isClean(tempCoachScoreSheetStudentPlacement)) { // come here when there is no student listed multiple times.
                        var packedArray = fillSpaces(tempCoachScoreSheetStudentPlacement, coach.scoreSheet.scores);
                        coach.scoreSheet.studentPlacement = packedArray.studentArray;
                        coach.scoreSheet.scores = packedArray.scoreArray;
                        emptySpaceFound = packedArray.fillingHappened;
                        coach.scoreSheet.studentsEntered = true;
                        dObjectWrite("coach", coach); // update the data object
                        coachScoreSheetStudentPlacement = coach.scoreSheet.studentPlacement;
                        displayShiftWarning = emptySpaceFound; // will be used in a future version
                        if (numAddedStuds == 0) {
                            state = "readOnly";
                        } else { // Come here when the coach is adding one or more students to the roster.
                            var needNames = [];
                            for (j = numAddedStuds; j > 0; j--) {
                                needNames.push(Number(coach.students[coach.students.length - j].iD)); //pick off ID's of New Student1, etc.
                            }
                            var alphaStudents = makeAlphaStudentsList(coach);
                            res.render("rosteredit.ejs", { //This render-return in the middle of a switch is necessary because only a computation determines whether the user is sent to the rosteredit page.
                                coachId: coach.iD,
                                session: coach.session,
                                alphaStudents: alphaStudents,
                                needNames: needNames, // This array contains the ID's of the students that aren't named yet.
                                returnToCoach: true, // This flag tells the rosteredit page to call a post to /coach instead of /roster.
                            });
                            return;
                        }
                    } else { // Come here when there is at least one student listed multiple times.
                        state = "enterNames";
                        duplicates = true;
                        coachScoreSheetStudentPlacement = tempCoachScoreSheetStudentPlacement;
                    }
                } else {
                    console.log(`${coach.iD}: Deny permission to submit names`); // come here when the coach is refused permission to submit names.
                    state = "readOnly";
                    namesLockedMsg = true;
                }
                break;
            case "enterScores":
                if (coach.permission.scoreEntry) {
                    state = "enterScores";
                } else {
                    console.log(`${coach.iD}: Deny permission to enter scores`); // come here when the coach is refused permission to enter scores.
                    state = "readOnly";
                    scoresLockedMsg = true;
                }
                break;
            case "submitScores":
                if (coach.permission.scoreEntry) {
                    for (var k = 0; k < 10; k++) {
                        for (var j = 0; j < 10; j++) {
                            coach.scoreSheet.scores[k][j] = req.body["scoreArray" + k + j];
                        }
                    }
                    coach.scoreSheet.scoresEntered = true;
                    dObjectWrite("coach", coach, coach.iD); // update the data object
                    state = "readOnly";
                } else {
                    console.log(`${coach.iD}: Deny permission to submit scores`); // come here when the coach is refused permission to submit scores.
                    state = "readOnly";
                    scoresLockedMsg = true;
                }
                break;
            case "newStudents": // Come here when the rosteredit page handles "Add Student" selections on the scoresheet.
                for (var j = 1; j <= req.body.numAddedStuds; j++) { //This is the final use of numAddedStuds. It remains reset to zero after this line.
                    var idx = coach.students.findIndex((student) => {
                        return (student.iD == req.body["studentId" + j]);
                    });
                    coach.students[idx].first = req.body["first" + j];
                    coach.students[idx].middle = req.body["middle" + j];
                    coach.students[idx].last = req.body["last" + j];
                }
                dObjectWrite("coach", coach);
                var currentStatus = dObjectRead("contestStatus");
                var alphaStudents = makeAlphaStudentsList(coach);
                state = "readOnly";
                break;
            case "changePwd":
                res.render("changePwd.ejs", {
                    instrMsg: "Use the fields below to change your password. All fields are required.",
                    returnPath: "/coach",
                    coachId: coach.iD,
                    session: coach.session,
                });
                return;
            case "updatePwd":
                if (req.body.firstEntry != req.body.secondEntry) {
                    res.render("changePwd.ejs", {
                        instrMsg: "Error: Passwords did not match. Please try again.",
                        returnPath: "/coach",
                        coachId: coach.iD,
                        session: coach.session,
                    });
                    return;
                } else if (req.body.oldPassWord != coach.passWord) {
                    res.render("changePwd.ejs", {
                        instrMsg: "Error: Wrong password. If you have forgotten your current password, please ask the statistician to reset your password to CJML.",
                        returnPath: "/coach",
                        coachId: coach.iD,
                        session: coach.session,
                    });
                    return;
                } else {
                    coach.passWord = req.body.firstEntry;
                    dObjectWrite("coach", coach);
                    break;
                }
            case "editTeam":
                editTeam = true;
                break;
            case "submitTeam":
                coach.first = req.body.coachFirst;
                coach.middle = req.body.coachMiddle;
                coach.last = req.body.coachLast;
                coach.school = req.body.coachSchool;
                dObjectWrite("coach", coach);
                addFullName(coach);
                break;
            case "downloadScoresheet":
                var lines = [];
                var contestStatus = dObjectRead("contestStatus");
                lines[0] = ",,,Central Jersey Math League" + ",".repeat(10) + "Place:";
                lines[1] = ",,," + coach.school + " Score Sheet" + ",".repeat(10) + coach.place;
                lines[2] = ",".repeat(13); // row 3 is empty
                lines[3] = "Coach,,,Venue,,,,Date,,Contest No,,,,";
                lines[4] = coach.fullName + ",,," + contestStatus.hostSchool + ",".repeat(4) + contestStatus.contestDate + ",," + contestStatus.contestNumber + ",".repeat(4);
                lines[5] = lines[2]; // row 6 is empty
                if (!(contestStatus.teamContest)) { 
                    lines[6] = ",,Question No.:,1,2,3,4,5,6,7,8,9,10,Scores";
                    lines[7] = ",Lastname,First [Middle]" + ",".repeat(11);
                    var varsityScores = [];
                    for (var row = 9; row < 14; row++){
                        var studentSeat = row - 8;
                        lines[row - 1] = studentSeat + ":,";
                        if (coach.scoreSheet.studentPlacement[studentSeat - 1] == "empty") {
                            lines[row - 1] += ",";
                        } else {
                            var student = coach.students[coach.scoreSheet.studentPlacement[studentSeat - 1] - 1];
                            lines[row - 1] += student.last + "," + student.first;
                            if (student.middle != "") {
                                lines[row - 1] += student.middle;
                            }
                        }
                        for (var k = 0; k < 10; k++) {
                            lines[row - 1] += "," + coach.scoreSheet.scores[studentSeat - 1][k];
                        }
                        var varsityScore = sumTen(coach.scoreSheet.scores[studentSeat - 1]);
                        varsityScores.push(varsityScore);
                        lines[row - 1] += "," + varsityScore;
                    }
                    lines[13] = "Varsity:" + ",".repeat(13); // row 14 contains only the varsity team score. Question columns are not summed.
                    lines[13] += sumTopThree(varsityScores);
                    var JVScores = [];
                    for (var row = 15; row < 20; row++){
                        var studentSeat = row - 9;
                        lines[row - 1] = studentSeat + ":,";
                        if (coach.scoreSheet.studentPlacement[studentSeat - 1] == "empty") {
                            lines[row - 1] += ",";
                        } else {
                            var student = coach.students[coach.scoreSheet.studentPlacement[studentSeat - 1] - 1];
                            lines[row - 1] += student.last + "," + student.first;
                            if (student.middle != "") {
                                lines[row - 1] += student.middle;
                            }
                        }
                        for (var k = 0; k < 10; k++) {
                            lines[row - 1] += "," + coach.scoreSheet.scores[studentSeat - 1][k];
                        }
                        var JVScore = sumTen(coach.scoreSheet.scores[studentSeat - 1]);
                        JVScores.push(JVScore);
                        lines[row - 1] += "," + JVScore;
                    }
                    lines[19] = "JV:" + ",".repeat(13); // row 14 contains only the varsity team score. Question columns are not summed.
                    lines[19] += sumTopThree(JVScores);
                } else { 
                    lines[6] = ",,Question No.:,1,2,3,4,5,6,7,8,9,10,Score";
                    lines[7] = ",".repeat(13);
                    lines[8] = ",,Team Scores: "
                    for (var k = 0; k < 10; k++) {
                        lines[8] += "," + coach.scoreSheet.scores[0][k];
                    }
                    var teamScore = sumTen(coach.scoreSheet.scores[0]);
                    lines[8] += "," + teamScore;
                }
                var CSVFile = "./public/scoreSheet-"+coach.iD+".txt"
                var CSVFileContent = "";
                lines.forEach((line) => { 
                    CSVFileContent += line + "\n";
                });
                fs.writeFile(CSVFile, CSVFileContent, (err) => {
                    if (err) {
                        console.log("Error writing file. Error message follows.");
                        console.log(err);
                        return;
                    } else {
                        res.download(CSVFile, "CJMLscoresheet" + contestStatus.contestNumber + ".csv", (err) => {
                            if (err) {
                                console.log("contest download error: ", err);
                                console.log("headersSent: ", Object.keys(res._headerSent));
                            } else {
                                console.log(`The scoresheet file was sent to coach ${coach.iD} for download.`)
                            }
                        });
                    }
                })
                return;
            default:
                console.log('post("/coach"...): Unrecognized requestType of ', req.body.requestType);
        }
        var alphaStudents = makeAlphaStudentsList(coach);
        res.render("coach.ejs", { 
            state : state,
            coachId : coach.iD, 
            coachFullName : coach.fullName, 
            coachSchool : coach.school,
            alphaStudents : alphaStudents,
            numAddedStuds : numAddedStuds,
            coachScoreSheetStudentPlacement : coachScoreSheetStudentPlacement, // !=coach.scoreSheet.StudentPlacement when duplicates==true
            coachScoreSheetScores : coach.scoreSheet.scores,
            session : coach.session,
            displayShiftWarning : displayShiftWarning, // Not currently used. Do I need to warn coach that a shift has been made?
            duplicates : duplicates, //flag to turn on the red error lines
            namesLockedMsg : namesLockedMsg,
            scoresLockedMsg : scoresLockedMsg,
            currentStatusHostSchool : currentStatus.hostSchool,
            currentStatusContestDate : currentStatus.contestDate,
            currentStatusContestNumber: currentStatus.contestNumber,
            currentStatusTeamContest: currentStatus.teamContest,
            editTeam: editTeam,
            place: coach.place,
            coachFirst: coach.first,
            coachMiddle: coach.middle,
            coachLast: coach.last,
        });
    } else { // Come here if the session number is wrong
        console.log(`${coach.iD}: session was terminated by server`)
        res.redirect("/?arrivedFrom=bumped"); 
    }
});


app.post("/roster", (req, res) => {
    var coach=dObjectRead("coach",req.body.coachId);
    console.log(`${coach.iD}: Request to manage the roster`);
    if (coach.session == req.body.session) {
        if (req.body.requestType.startsWith("deleteStudent")) {
            var dStudentId = req.body.requestType.slice(13);
            req.body.requestType = "deleteStudent";
        }
        switch (req.body.requestType) {
            case "manageRoster":
                break;
            case "deleteStudent":
                var idx = coach.students.findIndex((student) => {
                    return (student.iD == dStudentId);
                });
                coach.students[idx].last = "!" + coach.students[idx].last;
                dObjectWrite("coach", coach);
                break;
            case "changeStudent":
                var cStudentId = req.body.studentId1;
                var idx = coach.students.findIndex((student) => {
                    return (student.iD == cStudentId);
                });
                coach.students[idx].first = req.body.first1;
                coach.students[idx].middle = req.body.middle1;
                coach.students[idx].last = req.body.last1;
                dObjectWrite("coach", coach);
                break;
            default:
        }
        var alphaStudents = makeAlphaStudentsList(coach);
        res.render("roster.ejs", {
            alphaStudents : alphaStudents,
            coachId : coach.iD,
            session : coach.session,
        });
    } else {
        // Come here if the session number is wrong
        console.log(`${coach.iD}: session was terminated by server`);
        res.redirect("/?arrivedFrom=bumped");
    }
});

app.post("/rosteredit", (req, res) => {
    var coach=dObjectRead("coach",req.body.coachId);
    var currentStatus = dObjectRead("contestStatus");
    console.log(`${coach.iD}: Request ${req.body.requestType}`);
    if (coach.session == req.body.session) { 
        if (req.body.requestType.startsWith("editStudent")) {
            var editId = req.body.requestType.slice(11);
            req.body.requestType = "editStudent";
        }
        switch (req.body.requestType) {
            case "addStudent":
                var editId = coach.students.length + 1;
                coach.students.push(
                    {
                        first: "New",
                        middle: "",
                        last: " Student", // The space before the 'S' is to place it alphabetically first.
                        iD: editId,
                    }
                );
                dObjectWrite("coach", coach);
                break;
            case "editStudent": // The work of "editStudent" was done above, when the value of editId was set.
                break;
            default:
                console.log("Error: request type was neither 'addStudent' nor 'editStudent'.");
                var alphaStudents = makeAlphaStudentsList(coach);
                res.render("coach.ejs", {
                    state: "readOnly",
                    coachId: coach.iD,
                    coachFullName: coach.fullName,
                    coachSchool: coach.school,
                    alphaStudents: alphaStudents,
                    coachScoreSheetStudentPlacement: coach.scoreSheet.studentPlacement,
                    coachScoreSheetScores: coach.scoreSheet.scores,
                    session: coach.session,
                    currentStatusHostSchool: currentStatus.hostSchool,
                    currentStatusContestDate: currentStatus.contestDate,
                    currentStatusContestNumber: currentStatus.contestNumber,
                    currentStatusTeamContest: currentStatus.teamContest,
                    editTeam: false,
                    place: coach.place,
                    coachFirst: "",
                    coachMiddle: "",
                    coachLast: "",
                });
                return;
        }
        var alphaStudents = makeAlphaStudentsList(coach);
        res.render("rosteredit.ejs", {
            alphaStudents : alphaStudents,
            coachId : coach.iD,
            session : coach.session,
            needNames : [Number(editId)],
            returnToCoach : false,
        });

    } else {
        // Come here if the session number is wrong
        console.log(`${coach.iD}: session was terminated by server`);
        res.redirect("/?arrivedFrom=bumped");
    }
});

app.post("/rosterundelete", (req, res) => { 
    var coach=dObjectRead("coach",req.body.coachId);
    if (coach.session == req.body.session) { 
        if (req.body.requestType.startsWith("unDeleteStudent")) {
            var unDeleteId = req.body.requestType.slice(15);
            var unDeleteIdx = coach.students.findIndex((element) => {
                return element.iD == unDeleteId;
            });
            coach.students[unDeleteIdx].last = coach.students[unDeleteIdx].last.slice(1); // Undelete by removing the starting "!" from last name
            dObjectWrite("coach", coach); // The student list has been updated, now continue with a render of the rosterundelete page again.
        }
        // skip to here when requestType is "undelete"
        var alphaStudents = makeAlphaStudentsList(coach);
        res.render("rosterundelete.ejs", {
            coachId : coach.iD,
            session : coach.session,
            alphaStudents : alphaStudents,
        })
    } else {
        // Come here if the session number is wrong
        console.log(`${coach.iD}: session was terminated by server`);
        res.redirect("/?arrivedFrom=bumped");
    }
});

app.listen(3000, ()=>{
    console.log(`scoring server running on port ${port}`);
});
