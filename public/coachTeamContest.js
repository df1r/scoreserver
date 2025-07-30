// Row k, column j. Now we only have one row, so k=1 and we only have j. Carve script from here.

var rowButtons = [];
var sCount=0; // used in function clickaction to keep track of team score sum

function clickAction(element) { 
    var p=element.innerText;
    element.innerText = 1-p;
    if (p==0) {
        element.style.backgroundColor="#c05402";
    } else {
        element.style.backgroundColor="#8bcf029e";
    }
    document.getElementById("scoreArray0"+element.qNumber).setAttribute("value", 1-p);
    sCount = sCount + 1 - 2 * p;
    document.getElementById("hScore0").innerText=sCount;
}

// Start of coachTeamContest.js script

// Initialization: Sum the rows and columns and style the boxes
console.log("This is the start of coachTeamContest.js");
rowButtons = document.querySelectorAll("button.clickrow0"); // Create the 2D array rowButtons
for (var j = 0; j < 10; j++) {
    rowButtons[j].qNumber = j;
    if (rowButtons[j].innerText==1) { // style the box according to whether it has a 1 or a 0
        rowButtons[j].style.backgroundColor="#c05402";
    } else if (rowButtons[j].innerText==0) { //this could simply be an else if(), but I need help debugging.
        rowButtons[j].style.backgroundColor="#8bcf029e";
    }
    sCount = sCount + Number(rowButtons[j].innerText); // add the score value to the row sum (the team-score box)
}
document.getElementById("hScore0").innerText = sCount;


rowButtons.forEach(element => {
    element.addEventListener("click", ()=>{
        clickAction(element);
    });
});

