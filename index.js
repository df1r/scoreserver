// Security Issues: Address these points at the end of the project.
// Learn about https
// Stop autofill suggestions for password fields and make them hidden.

import express from "express";
import bodyParser from "body-parser"; //not sure this is necessary.

const app = express();
const port = 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : false }))

function DbCoachRecord(iD, first, middle, last, school) {// This is a constructor function, used when a coach is added to the database.
    this.iD = iD;
    this.passWord = "CJML";
    this.session = 0;
    this.first = first;
    this.middle = middle;
    this.last = last;
    this.school = school;
    this.students = []; // A student is a record with first, middle, last, iD
    this.scoreCard = {
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
}


// Below are the data that will come from the database in a later version

var dbStatus = {
    maximumCoachId : 2,
    contestNumber : 4,
    hostSchool : "Eric R. Blitzkrieg Canning Academy",
    contestDate : new Date("12/25/24").toLocaleDateString(),
}
var dbCoaches = [
    new DbCoachRecord(1, "Vera","","Vacation","UC Tech"),
    new DbCoachRecord(2,"Progg","","Nauseous","Montgomery High School"),
];


dbCoaches[0].students = [
    {
        first : "Bangus",
        middle : "",
        last : "Finch",
        iD : 1,
    },
    {
        first : "Potatahed",
        middle : "",
        last : "Bircummins",
        iD : 2,
    },
    {
        first : "Donpoop",
        middle : "",
        last : "Poopidoop",
        iD : 3,
    },
    {
        first : "1Flippy",
        middle : "",
        last : "!Floppos",
        iD : 4,
    },
    {
        first : "Gus",
        middle : "",
        last : "Underscrat",
        iD : 5,
    },
    {
        first : "Spuckles",
        middle : "",
        last : "Underscrat",
        iD : 6,
    },
    {
        first : "Pinkie",
        middle : "",
        last : "Winkles",
        iD : 7,
    },
    {
        first : "Arthur",
        middle : "",
        last : "Bardsplar",
        iD : 8,
    },
    {
        first : "Sunshine",
        middle : "",
        last : "Spaghetti",
        iD : 9,
    },
    {
        first : "Reorari",
        middle : "",
        last : "Ferrari",
        iD : 10,
    },
    {
        first : "Spuckles",
        middle : "",
        last : "Dopeslinger",
        iD : 11,
    },
]

dbCoaches[1].students = [
    {
        first : "Peoria",
        middle : "",
        last : "Frindom",
        iD : 1,
    },
    {
        first : "Queasles",
        middle : "",
        last : "Rungrun",
        iD : 2,
    },
    {
        first : "Kurt",
        middle : "",
        last : "Hurtzenwurst",
        iD : 3,
    },
    {
        first : "Rumrum",
        middle : "",
        last : "Humdrum",
        iD : 4,
    },
    {
        first : "Ooflewiggies",
        middle : "",
        last : "Po",
        iD : 5,
    },
    {
        first : "Trusk",
        middle : "",
        last : "Palatial",
        iD : 6,
    },
    {
        first : "Kyle",
        middle : "",
        last : "Forawhile",
        iD : 7,
    },
    {
        first : "Blue",
        middle : "",
        last : "Grabingoe",
        iD : 8,
    },
    {
        first : "Unt",
        middle : "",
        last : "Berunder",
        iD : 9,
    },
    {
        first : "Wozzle",
        middle : "",
        last : "Buns",
        iD : 10,
    },
    {
        first : "Cathy",
        middle : "",
        last : "Buns",
        iD : 11,
    },
]

var dbStatistician = {
    passWord: "CJML",
    session: 0,
}

// End of the typed-in data for testing that will later come from the database

// The functions dBaseRead(...) and dBaseWrite(...) are placeholders for database commands
// Syntax examples: 
// dBaseRead("coach", 5); 
// dBaseRead("status"); 
// dBaseRead("statistician");
function dBaseRead(reqType, coachId) { 
    switch (reqType) {
        case "coach":
            if (coachId) {
                var idx = dbCoaches.findIndex((srchItem) => { return srchItem.iD == coachId });
                var returnedCoach = JSON.parse(JSON.stringify(dbCoaches[idx]));
                return returnedCoach;
            } else {
                console.log("dBaseRead: coach ID was expected as second argument");
                return;
            }
        case "status":
            var returnedStatus = JSON.parse(JSON.stringify(dbStatus));
            return returnedStatus;
        case "statistician":
            var returnedStatistician = JSON.parse(JSON.stringify(dbStatistician));
            return returnedStatistician;
        default:
            console.log(`dBaseRead: reqType was expected to be "coach" or "status" or "statistician", not ${reqType}.`);
            return false;
    }
}

// Syntax examples: 
// dBaseWrite("coach", coachrecord);
// dBaseWrite("status", statusrecord);
// dBaseWrite("permissions", permissionrecord);
// dBaseWrite("permissions", permissionrecord, 5);
// dBaseWrite("session", session, 5);
// dBaseWrite("statistician", statisticianrecord);
// Note that coachrecord must have ten keys, three of which themselves have keys;
// Note that statusrecord must have keys maximumCoachId, contestNumber, hostSchool, and contestDate;
// Note that permissionrecord must have the boolean values nameEntry and scoreEntry;
// Note that session must be a real number;
// Note that statisticianrecord has just two keys: passWord and session;
function dBaseWrite(reqType, record, coachId) {
    switch (reqType) {
        case "coach":
            if (record.iD == "new") {
                var statusRecord = dBaseRead("status");
                statusRecord.maximumCoachId += 1;
                dBaseWrite("status", statusRecord);
                record.iD = statusRecord.maximumCoachId;
                dbCoaches.push(record);
                return true;
            } else {
                var idx = dbCoaches.findIndex((srchItem) => { return srchItem.iD == record.iD });
                if (idx == -1) {
                    console.log("dBaseWrite: coachId not recognized.");
                    return false
                } else {
                    dbCoaches[idx] = JSON.parse(JSON.stringify(record)); // For ease of coding I have
                        // not bothered to avoid storing dbCoaches[idx].fullName. But I have
                        // tried to write the rest of the code with the assumption that the fullName
                        // key is absent in the database coach record.
                    return true;
                }
            }
        case "status":
            dbStatus = JSON.parse(JSON.stringify(record));
            return true;
        case "permissions":
            if (coachId) {
                var idx = dbCoaches.findIndex((srchItem) => { return srchItem.iD == coachId });
                dbCoaches[idx].permission.nameEntry = record.nameEntry;
                dbCoaches[idx].permission.scoreEntry = record.scoreEntry;
            } else {
                for (var j = 0; j < dbstatus.maximumCoachId; j++) { // This line assumes that dbCoaches is never a sparse array,
                        // and that no coach ID's are ever skipped, both of which should be true.
                    dbCoaches[j].permission.nameEntry = record.nameEntry;
                    dbCoaches[j].permission.scoreEntry = record.scoreEntry;
                }
            }
            return true;
        case "session":
            var idx = dbCoaches.findIndex((srchItem) => { return srchItem.iD == coachId });
            if (idx == -1) {
                console.log(`dBaseWrite: coach ID not recognized.`);
                return false;
            } else {
                dbCoaches[idx].session = record; // This is a simple assignment of a number.
                return true;
            }
        case "statistician":
            dbStatistician = JSON.parse(JSON.stringify(record));
            return true;
        default:
            console.log(`dBaseWrite: reqType was expected to be "coach" or "status" or "permissions" or "session" or "statistician", not ${reqType}`);
            return false;
    }
}

// And now comes the code that will actually stay when I incorporate a database. I only need to
// redefine dBaseRead and dBaseWrite above and the rest of the code should work.

// addFullName adds a key called "fullName" to a record, to help the ejs code display students or coaches.

function addFullName(personRecord) {
        if (personRecord.middle == "") {
            personRecord.fullName = personRecord.first + " " + personRecord.last;
        } else {
            personRecord.fullName = personRecord.first + " " + personRecord.middle + " " + personRecord.last;
        }
    return;
}

// makeAlphaSchoolsList uses the list of coaches in the database to create an alphabetical list of schools.

function makeAlphaSchoolsList() {
    var max = dBaseRead("status").maximumCoachId;
    var alphaSchools = [];
    for(var iD = 1; iD <= max; iD++){ 
        alphaSchools.push({school : dBaseRead("coach",iD).school, coachId : iD,});
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
    res.render("index.ejs", {
        alphaSchools : alphaSchools,
        arrivalMsg : arrivalMsg,
    }); // We will have to send to the login page: the contest number, date and host school.
});

app.post("/", (req, res) => {
    if (req.body.coachId == "statistician") {
        var statistician = dBaseRead("statistician");
        if (req.body.passWord == statistician.passWord) {
            statistician.session = Math.random();
            dBaseWrite("statistician", statistician);
            var status = dBaseRead("status");
            var coachList = [];
            for (var j = 1; j <= status.maximumCoachId; j++) {
                coachList.push(dBaseRead("coach", j));
            }
            coachList.forEach((coach) => {
                addFullName(coach);
            });
            var alphaSchools = makeAlphaSchoolsList();
            res.render("statistician.ejs", {
                state: "readOnly",
                status: status,
                coachList: coachList,
                alphaSchools: alphaSchools,
                session: statistician.session, // At the next server request the session number must match, to prevent simultaneous logins.
            });
        } else {
            res.redirect("/?arrivedFrom=wrongpwd");
        }
    } else {
        var coach = dBaseRead("coach", req.body.coachId);
        var currentStatus = dBaseRead("status");
        if (req.body.passWord == coach.passWord) {
            coach.session = Math.random();
            dBaseWrite("session", coach.session, coach.iD);
            addFullName(coach);
            console.log(`${coach.iD}: ${coach.fullName} has logged in.`);
            var alphaStudents = makeAlphaStudentsList(coach);
            res.render("coach.ejs",
                {
                    state: "readOnly",
                    coachId: coach.iD, // This value is posted by the coach's form to allow checking of whether the session number matches.
                    session: coach.session, // ... to allow checking of whether the session number matches.
                    coachFullName: coach.fullName, // The full coach record is not sent, to avoid serving the password.
                    coachSchool: coach.school,
                    alphaStudents: alphaStudents,
                    coachScoreCardStudentPlacement: coach.scoreCard.studentPlacement,
                    coachScoreCardScores: coach.scoreCard.scores,
                    currentStatusHostSchool: currentStatus.hostSchool,
                    currentStatusContestDate: currentStatus.contestDate,
                    currentStatusContestNumber: currentStatus.contestNumber,
                });
        } else {
            res.redirect("/?arrivedFrom=wrongpwd");
        }
    }
});



app.post("/statistician", (req, res) => {
    var statistician = dBaseRead("statistician");
    console.log(`statistician: Request ${req.body.requestType}`);
    if (statistician.session == req.body.session) {
        var status = dBaseRead("status");
        var state = "readOnly";
        var coachList = [];
        for (var j = 1; j <= status.maximumCoachId; j++) {
            coachList.push(dBaseRead("coach", j));
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
                    dBaseWrite("permissions", coach.permission, coach.iD);
                });
                break;
            case "closeNames": // Close name entry for ALL coaches
                coachList.forEach((coach) => {
                    coach.permission.nameEntry = false;
                    dBaseWrite("permissions", coach.permission, coach.iD);
                });
                break;
            case "openScores": // Open score entry for ALL coaches
                coachList.forEach((coach) => {
                    coach.permission.scoreEntry = true;
                    dBaseWrite("permissions", coach.permission, coach.iD);
                });
                break;
            case "closeScores": // Close score entry for ALL coaches
                coachList.forEach((coach) => {
                    coach.permission.scoreEntry = false;
                    dBaseWrite("permissions", coach.permission, coach.iD);
                });
                break;
            case "namePermission": // Toggle name entry permission for one coach (coachId, computed above)
                var idx = coachId - 1;
                coachList[idx].permission.nameEntry = !(coachList[idx].permission.nameEntry);
                dBaseWrite("permissions", coachList[idx].permission, coachId);
                break;
            case "scorePermission": // Toggle score entry permission for one coach (coachId, computed above)
                var idx = coachId - 1;
                coachList[idx].permission.scoreEntry = !(coachList[idx].permission.scoreEntry);
                dBaseWrite("permissions", coachList[idx].permission, coachId);
                break;
            case "modifyVenue":
                state = "modifyVenue";
                break;
            case "submitVenue":
                var statusRecord = {
                    maximumCoachId: status.maximumCoachId,
                    contestNumber: req.body.contestNumber,
                    hostSchool: req.body.hostSchool,
                    contestDate: req.body.contestDate,
                }
                dBaseWrite("status", statusRecord);
                status = dBaseRead("status");
                break;
            case "newContest":
                state = "modifyVenue";
                coachList.forEach((coach) => {
                    coach.scoreCard = {
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
                    dBaseWrite("coach", coach);
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
                    dBaseWrite("statistician", statistician);
                    break;
                }
            default:
                console.log("statistician.ejs returned an unrecognized requestType of ", req.body.requestType);
        }
        var alphaSchools = makeAlphaSchoolsList();
        res.render("statistician.ejs", {
            state: state,
            status: status,
            coachList: coachList,
            alphaSchools: alphaSchools,
            session: statistician.session,
        });
    } else {
        console.log(`Statistician: session was terminated by server`)
        res.redirect("/?arrivedFrom=bumped");
    }
});

app.post("/manageTeams", (req, res) => {
    var statistician = dBaseRead("statistician");
    var editTeam = "none";
    console.log(`statistician: Request ${req.body.requestType}`);
    if (statistician.session == req.body.session) {
        req.body.summerMode = req.body.summerMode || false;
        var status = dBaseRead("status");
        var coachList = [];
        for (var j = 1; j <= status.maximumCoachId; j++) {
            coachList.push(dBaseRead("coach", j));
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
                    dBaseWrite("coach", coach);
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
                dBaseWrite("coach", coachList[idx]);
                break;
            case "deleteTeam":
                for (var j = coachId; j < status.maximumCoachId; j++) {
                    var idx1 = j - 1;
                    var idx2 = j;
                    coachList[idx1] = coachList[idx2];
                    coachList[idx1].iD = idx2;
                    dBaseWrite("coach", coachList[idx1]);
                    addFullName(coachList[idx1]);
                }
                coachList=coachList.slice(0, -1);
                status.maximumCoachId = status.maximumCoachId - 1;
                dBaseWrite("status", status);
                break;
            case "addTeam":
                var newTeam = new DbCoachRecord("new", req.body.coachFirst, req.body.coachMiddle, req.body.coachLast, req.body.coachSchool);
                dBaseWrite("coach", newTeam);
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
    var statistician = dBaseRead("statistician");
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
        var coach = dBaseRead("coach", coachId);
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
                dBaseWrite("coach", coach);
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
                dBaseWrite("coach", coach);
                var alphaStudents = makeAlphaStudentsList(coach); // This will take care of adding the fullName key to the added student.
                break;
            case "passWordReset":
                coach.passWord = "CJML";
                dBaseWrite("coach", coach);
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
    var coach = dBaseRead("coach", req.body.coachId);
    var currentStatus = dBaseRead("status");
    var state = "readOnly";
    var numAddedStuds = 0; // Used to keep track of how many name "add student" requests have been made so far.
                            // These students are temporarily named with a numeric suffix, as in " Student3".
    var displayShiftWarning = ""; // This is not currently used, but will be in a future version.
    var duplicates = false; // Used when scorecard names are submitted, to determine whether to accept the submission.
    var namesLockedMsg = false; // Tells whether to display the warning that names are locked.
    var scoresLockedMsg = false; // Tells whether to display the warning that scores are locked.
    var coachScoreCardStudentPlacement = coach.scoreCard.studentPlacement;
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
                    state = "readOnly";
                    namesLockedMsg = true;
                }
                break;
            case "submitNames":
                if (coach.permission.nameEntry) {
                    var emptySpaceFound = false;
                    var tempCoachScoreCardStudentPlacement = [ // record student placements in a temporary array
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
                        if (tempCoachScoreCardStudentPlacement[j] == "addStudent") {
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
                            tempCoachScoreCardStudentPlacement[j] = newId;
                        }
                    }
                    // Before checking for duplicates on the scorecard, update the list of students in the database.
                    dBaseWrite("coach", coach);
                    // Check that the list of students on the scorecard is "clean" and if so finish updating the database.
                    if (isClean(tempCoachScoreCardStudentPlacement)) { // come here when there is no student listed multiple times.
                        var packedArray = fillSpaces(tempCoachScoreCardStudentPlacement, coach.scoreCard.scores);
                        coach.scoreCard.studentPlacement = packedArray.studentArray;
                        coach.scoreCard.scores = packedArray.scoreArray;
                        emptySpaceFound = packedArray.fillingHappened;
                        coach.scoreCard.nameEntry = true;
                        dBaseWrite("coach", coach); // update the database
                        coachScoreCardStudentPlacement = coach.scoreCard.studentPlacement;
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
                        coachScoreCardStudentPlacement = tempCoachScoreCardStudentPlacement;
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
                            coach.scoreCard.scores[k][j] = req.body["scoreArray" + k + j];
                        }
                    }
                    coach.scoreCard.scoreEntry = true;
                    dBaseWrite("coach", coach, coach.iD); // update the database
                    state = "readOnly";
                } else {
                    console.log(`${coach.iD}: Deny permission to submit scores`); // come here when the coach is refused permission to submit scores.
                    state = "readOnly";
                    scoresLockedMsg = true;
                }
                break;
            case "newStudents": // Come here when the rosteredit page handles "Add Student" selections on the scorecard.
                //There is a problem with the variable "howManyStuds". It has too many different names and it is passed too many times to track it easily.
                for (var j = 1; j <= req.body.howManyStuds; j++) {
                    var idx = coach.students.findIndex((student) => {
                        return (student.iD == req.body["studentId" + j]);
                    });
                    coach.students[idx].first = req.body["first" + j];
                    coach.students[idx].middle = req.body["middle" + j];
                    coach.students[idx].last = req.body["last" + j];
                }
                dBaseWrite("coach", coach);
                var currentStatus = dBaseRead("status");
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
                } else {
                    coach.passWord = req.body.firstEntry;
                    dBaseWrite("coach", coach);
                    break;
                }

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
            coachScoreCardStudentPlacement : coachScoreCardStudentPlacement, // !=coach.scoreCard.StudentPlacement when duplicates==true
            coachScoreCardScores : coach.scoreCard.scores,
            session : coach.session,
            displayShiftWarning : displayShiftWarning, // Not currently used. Do I need to warn coach that a shift has been made?
            duplicates : duplicates, //flag to turn on the red error lines
            namesLockedMsg : namesLockedMsg,
            scoresLockedMsg : scoresLockedMsg,
            currentStatusHostSchool : currentStatus.hostSchool,
            currentStatusContestDate : currentStatus.contestDate,
            currentStatusContestNumber : currentStatus.contestNumber,
        });
    } else { // Come here if the session number is wrong
        console.log(`${coach.iD}: session was terminated by server`)
        res.redirect("/?arrivedFrom=bumped"); 
    }
});


app.post("/roster", (req, res) => {
    var coach=dBaseRead("coach",req.body.coachId);
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
                dBaseWrite("coach", coach);
                break;
            case "changeStudent":
                var cStudentId = req.body.studentId1;
                var idx = coach.students.findIndex((student) => {
                    return (student.iD == cStudentId);
                });
                coach.students[idx].first = req.body.first1;
                coach.students[idx].middle = req.body.middle1;
                coach.students[idx].last = req.body.last1;
                dBaseWrite("coach", coach);
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
    var coach=dBaseRead("coach",req.body.coachId);
    var currentStatus = dBaseRead("status");
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
                dBaseWrite("coach", coach);
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
                    coachScoreCardStudentPlacement: coach.scoreCard.studentPlacement,
                    coachScoreCardScores: coach.scoreCard.scores,
                    session: coach.session,
                    currentStatusHostSchool: currentStatus.hostSchool,
                    currentStatusContestDate: currentStatus.contestDate,
                    currentStatusContestNumber: currentStatus.contestNumber,
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
    var coach=dBaseRead("coach",req.body.coachId);
    if (coach.session == req.body.session) { 
        if (req.body.requestType.startsWith("unDeleteStudent")) {
            var unDeleteId = req.body.requestType.slice(15);
            var unDeleteIdx = coach.students.findIndex((element) => {
                return element.iD == unDeleteId;
            });
            coach.students[unDeleteIdx].last = coach.students[unDeleteIdx].last.slice(1); // Undelete by removing the starting "!" from last name
            dBaseWrite("coach", coach); // The student list has been updated, now continue with a render of the rosterundelete page again.
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
