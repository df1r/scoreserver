// Security Issues: Address these points at the end of the project.
// Learn about https

import express from "express";
import bodyParser from "body-parser"; //not sure this is necessary.

const app = express();
const port = 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

function DbCoachRecord(iD, first, middle, last, school) {//This is a temporary constructor function.
                                                        //I am using it to create an array that
                                                        //temporarily replaces the database.
    this.iD = iD;
    this.passWord = "CJML";
    this.session = 0;
    this.first = first;
    this.middle = middle;
    this.last = last;
    this.school = school;
    this.students = []; //A student is a record with first, middle, last, iD
    this.scoreCard = [];
    this.scoreCard.studentPlacement = ["","","","","","","","","",""]; //studentPlacement[l] is a student iD value
    this.scoreCard.scores=[];
    for (var j=0; j<10; j++){
        this.scoreCard.scores[j]=[0,0,0,0,0,0,0,0,0,0];
    }
    this.permission=[]; //These two values are checked when a coach clicks the name-entry or score-entry button.
    // These permissions are changed by the administrator as they lock and unlock the name- or score-entry.
    this.permission.nameEntry=true;
    this.permission.scoreEntry=true;
}


// Below are the data that will come from the database in a later version

const dbStatus = {
    maximumCoachId : 2,
    contestNumber : 1,
    hostSchool : "Eric R. Blitzkreig Canning Academy",
    contestDate : new Date("12/25/24").toLocaleDateString(),
    contestNumber : 4,
}
var dbCoaches = [
    new DbCoachRecord(1, "Vera","","Vacation","UC Tech"),
    new DbCoachRecord(2,"Progg","","Nauseous","Montgomery High School"),
];
dbCoaches[1].permission.nameEntry=false;


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
// End of the typed-in data for testing that will later come from the database

// The functions dBaseRead(n) and dBaseWrite(coach) are placeholders for database commands
// Modify this function so that the syntax is dBaseRead("coach", 5) or dBaseRead("status") or dBaseRead("permissions")
function dBaseRead(coachId) { 
    if (coachId) {
        var idx = dbCoaches.findIndex((srchItem)=>{return srchItem.iD == coachId});
        return dbCoaches[idx];
    } else {
        return{
            maximumCoachId: dbStatus.maximumCoachId,
            contestNumber: dbStatus.contestNumber,
            hostSchool: dbStatus.hostSchool,
            contestDate: dbStatus.contestDate,
        };
    }
}

// Modify this function so that the syntax is dBaseWrite("coach", coachrecord) or dBaseRead("status", statusrecord) or dBaseRead("permissions", permissionrecord)
function dBaseWrite(coach) {
    var idx = dbCoaches.findIndex((srchItem)=>{return srchItem.iD == coach.iD});
    dbCoaches[idx] = coach;
}

//And now comes the code that will actually stay when I incorporate a database. I only need to
//redefine dBaseRead and dBaseWrite above and the rest of the code should work.

//Use the coaches array to create an alphabetical list of schools.

function makeAlphaSchoolsList() {
    var max = dBaseRead().maximumCoachId;
    var alphaSchools = [];
    for(var iD = 1; iD <= max; iD++){
        alphaSchools.push({school : dBaseRead(iD).school, coachId : iD,});
    }
    alphaSchools.sort((a,b)=>{ if (a.school > b.school) {return 1;} else if (a.school < b.school) {return -1;} else {return 0;} });
    return alphaSchools;
}

function isClean(someArray){ // Checks whether an array of length 10 contains any repeated items
    for (var i=0; i<9; i++) {
        if (someArray[i] != ""){
            for (var j=i+1; j<10; j++) {
                if(someArray[i]==someArray[j]){return false;}
            }
        }
    }
    return true;
}

function fillSpaces(someArray){ // Shifts items in an array of length 10 to fill empty spaces
    var fillingHappened = false;
    var emptySpots = [];
    var top=9;
    while((top > -1) && (someArray[top]=="")) {top--;}
    for (var j=0; j<top; j++){
        if (someArray[j] == ""){
            emptySpots.push(j);
            fillingHappened = true;
        }
    }
    if (fillingHappened){
        for (var j=emptySpots.length-1; j>=0; j--){
            for (var k=emptySpots[j]; k<10; k++){
                someArray[k]=someArray[k+1];
            }
        }
    }
    var returnObject = []
    returnObject.array = someArray;
    returnObject.fillingHappened = fillingHappened;
    return returnObject;
}



app.get("/", (req, res)=>{
    var arrivalMsg = req.query.arrivedFrom;
    var alphaSchools = makeAlphaSchoolsList();
    res.render("login.ejs", {
        "alphaSchools": alphaSchools,
        "arrivalMsg": arrivalMsg,
    }); // We will have to send to the login page: the contest number, date and host school.
});

app.post("/login", (req, res)=>{
    var coach = dBaseRead(req.body.coachId);
    var currentStatus = dBaseRead();
    if (req.body.passWord == coach.passWord){
        coach.session=Math.random();
        dBaseWrite(coach);
        if (coach.middle == "") {
            coach.fullName = coach.first + " " + coach.last;
        } else {
            coach.fullName = coach.first + " " + coach.middle + " " + coach.last;
        }
        console.log(`${coach.iD}: ${coach.fullName} has logged in.`);
        res.render("coach.ejs", 
        {
            "state": "readOnly",
            "coachId": coach.iD, //see security note above: This will be a hashed unique session ID that can be used to find the coach.
            "coach": coach.fullName,
            "school": coach.school,
            "students": coach.students,
            "scoreCard": coach.scoreCard.studentPlacement,
            "session": coach.session,
            "venue" : currentStatus.hostSchool,
            "cDate" : currentStatus.contestDate,
            "cNumber" : currentStatus.contestNumber,
        });
    } else {
        res.redirect("/?arrivedFrom=wrongpwd");
    }
    });


app.post("/coach", (req, res)=>{ //come here when a coach clicks any button on the coach page except "logout"
    var coach=dBaseRead(req.body.coachId);
    var currentStatus = dBaseRead();
    console.log(`${coach.iD}: Request ${req.body.requestType}`);
    if (coach.session == req.body.session){
        if (req.body.requestType == "readOnly") { //come here when a coach has just logged in or hits "reload"
            res.render("coach.ejs", {
                "state": "readOnly",
                "coachId": coach.iD,
                "coach": coach.fullName,
                "school": coach.school,
                "students": coach.students,
                "scoreCard": coach.scoreCard.studentPlacement,
                "session": coach.session,
                "venue" : currentStatus.hostSchool,
                "cDate" : currentStatus.contestDate,
                "cNumber" : currentStatus.contestNumber,
            });
        } else if (req.body.requestType == "enterNames"){ //come here when a coach clicks the enter-names button
            if(coach.permission.nameEntry){
                res.render("coach.ejs", { //come here when the coach has permission to enter names
                    "state": "enterNames",
                    "coachId": coach.iD, 
                    "coach": coach.fullName, 
                    "school": coach.school,
                    "students": coach.students,
                    "scoreCard": coach.scoreCard.studentPlacement,
                    "session": coach.session,
                    "venue" : currentStatus.hostSchool,
                    "cDate" : currentStatus.contestDate,
                    "cNumber" : currentStatus.contestNumber,
                });
            } else {
                console.log(`${coach.iD}: Deny permission to enter names`); // come here when the coach does not have permission to enter names.
                res.render("coach.ejs", { 
                    "state": "readOnly",
                    "coachId": coach.iD, 
                    "coach": coach.fullName, 
                    "school": coach.school,
                    "students": coach.students,
                    "scoreCard": coach.scoreCard.studentPlacement,
                    "session": coach.session,
                    "namesLockedMsg": true,
                    "venue" : currentStatus.hostSchool,
                    "cDate" : currentStatus.contestDate,
                    "cNumber" : currentStatus.contestNumber,
                }); //add a flag to send an alert.
            }
        } else if(req.body.requestType == "submitNames") { //come here when a coach clicks on the submit-names button
            if(coach.permission.nameEntry){
                var emptySpaceFound=false;
                coach.scoreCard.studentPlacement = [ // record student placements, but don't update the database yet.
                    req.body.selectStudent0,
                    req.body.selectStudent1,
                    req.body.selectStudent2,
                    req.body.selectStudent3,
                    req.body.selectStudent4,
                    req.body.selectStudent5,
                    req.body.selectStudent6,
                    req.body.selectStudent7,
                    req.body.selectStudent8,
                    req.body.selectStudent9
                ];
                // Check that the list of students on the scorecard is "clean" and if so update the database. (Fix cross-coach contamination)
                if (isClean(coach.scoreCard.studentPlacement)) { // come here when there is no student listed multiple times.
                    var packedArray = fillSpaces(coach.scoreCard.studentPlacement); 
                    coach.scoreCard.studentPlacement = packedArray.array;
                    emptySpaceFound = packedArray.fillingHappened;
                    dBaseWrite(coach); // update the database
                    if (emptySpaceFound) { 
                        var displayShiftWarning = true;
                    } else {
                        var displayShiftWarning = false;
                    }
                    res.render("coach.ejs", {
                        "state": "readOnly",
                        "coachId": coach.iD,
                        "coach": coach.fullName,
                        "school": coach.school,
                        "students": coach.students,
                        "scoreCard": coach.scoreCard.studentPlacement,
                        "session": coach.session,
                        "shiftMsg": displayShiftWarning,
                        "venue" : currentStatus.hostSchool,
                        "cDate" : currentStatus.contestDate,
                        "cNumber" : currentStatus.contestNumber,
                    });
                } else { // Come here when a coach listed a student more than once on the score card
                    res.render("coach.ejs", {
                        "state": "enterNames",
                        "coachId": coach.iD,
                        "coach": coach.fullName,
                        "school": coach.school,
                        "students": coach.students,
                        "scoreCard": coach.scoreCard.studentPlacement,
                        "session": coach.session,
                        "shiftMsg": displayShiftWarning,
                        "duplicates": true, //flag to turn on the red error lines
                        "venue" : currentStatus.hostSchool,
                        "cDate" : currentStatus.contestDate,
                        "cNumber" : currentStatus.contestNumber,
                    });
                }
            } else {
                console.log(`${coach.iD}: Deny permission to submit names`); // come here when the coach does not have permission to submit names.
                res.render("coach.ejs", { 
                    "state": "readOnly",
                    "coachId": coach.iD, 
                    "coach": coach.fullName, 
                    "school": coach.school,
                    "students": coach.students,
                    "scoreCard": coach.scoreCard.studentPlacement,
                    "session": coach.session,
                    "namesLockedMsg": true,
                    "venue" : currentStatus.hostSchool,
                    "cDate" : currentStatus.contestDate,
                    "cNumber" : currentStatus.contestNumber,
                }); //add a flag to send an alert.
            }
        } // else handle the other two request types (Enter scores or submit scores)
    } else { // Come here if the session number is wrong
        console.log(`${coach.iD}: session was terminated by server`)
        res.redirect("/?arrivedFrom=bumped"); 
    }
});

app.listen(3000, ()=>{
    console.log(`scoring server running on port ${port}`);
});
//Next: remove deleted students from the alphaStudents array in coach.ejs
