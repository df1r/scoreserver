var rowButtons=[];
var sCount=[0,0,0,0,0,0,0,0,0,0]; // used in function clickaction to keep track of student score sums
var qVCount=[0,0,0,0,0,0,0,0,0,0]; // used in function clickAction to keep track of varsity question score sums
var qJvCount=[0,0,0,0,0,0,0,0,0,0]; // used in function clickAction to keep track of JV question score sums
var tScoreV=0;
var tScoreJv=0;

function computeTeamScore(scoreArray){
    if(scoreArray.length != 5) {return -1};
    scoreArray.sort((A,B)=>{return(Number(A)-Number(B))});
    return (Number(scoreArray[2])+Number(scoreArray[3])+Number(scoreArray[4]));
}

function clickAction(element) { 
    var p=element.firstChild.innerText;
    element.firstChild.innerText = 1-p;
    if (p==0) {
        element.style.backgroundColor="#c05402";
    } else {
        element.style.backgroundColor="#8bcf029e";
    }
    document.getElementById("scoreArray"+element.sumBox+element.qSumBox).setAttribute("value", 1-p);
    sCount[element.sumBox]=sCount[element.sumBox]+1-2*p;
    document.getElementById("hScore"+element.sumBox).firstChild.innerText=sCount[element.sumBox];
    if (element.sumBox < 5) { // a click in a varsity player's box
        qVCount[element.qSumBox]=qVCount[element.qSumBox]+1-2*p; // add or subtract 1 to the question sum
        document.getElementById("v"+element.qSumBox).firstChild.innerText=qVCount[element.qSumBox]; // put the result in the question-sum box below
        var vScoreBoxes = document.querySelectorAll(".scoreboxv"); // obtain array of student scores so far
        var vScoreArray = [];
        for (var j=0; j<5; j++) {
            vScoreArray.push(vScoreBoxes[j].firstChild.innerText);
        }
        document.getElementById("vscore").firstChild.innerText=computeTeamScore(vScoreArray); //use the student scores to compute a team score and put the result in the box to the right
    } else {                  // a click in a JV player's box
        qJvCount[element.qSumBox]=qJvCount[element.qSumBox]+1-2*p; // add or subtract 1 to the question sum
        document.getElementById("jv"+element.qSumBox).firstChild.innerText=qJvCount[element.qSumBox]; // put the result in the question-sum box below
        var jvScoreBoxes=document.querySelectorAll(".scoreboxjv"); // obtain array of student scores so far
        var jvScoreArray=[];
        for (var j=0; j<5; j++) {
            jvScoreArray.push(jvScoreBoxes[j].firstChild.innerText);
        }
        document.getElementById("jvscore").firstChild.innerText=computeTeamScore(jvScoreArray); //use the student scores to compute a team score and put the result in the box to the right
    }
}

// document.getElementById("jvscore").firstChild.innerText=computeTeamScore(allScoresArray.slice(5,9));

// Start of coach.js script

// Initialization: Sum the rows and columns and style the boxes
for (var k=0; k<10; k++) { // row k column j
    rowButtons[k]=document.querySelectorAll("button.clickrow"+k); // Create the 2D array rowButtons
    for (var j=0; j<10; j++) {
        if (rowButtons[k][j].firstChild.innerText==1) { // style the box according to whether it has a 1 or a 0
            rowButtons[k][j].style.backgroundColor="#c05402";
        } else {
            rowButtons[k][j].style.backgroundColor="#8bcf029e";
        }
        sCount[k]=sCount[k]+Number(rowButtons[k][j].firstChild.innerText); // add the score value to the row sum (the student-score box)
        rowButtons[k][j].sumBox=k; // give each button element a pointer to its row sum
        rowButtons[k][j].qSumBox=j; // give each button element a pointer to its column sum
        if (k<5) { // add the score value to the column sum (the question-sum box)
            qVCount[j] += Number(rowButtons[k][j].firstChild.innerText);
        } else {
            qJvCount[j] += Number(rowButtons[k][j].firstChild.innerText);
        }
    }
    document.getElementById("hScore"+k).firstChild.innerText=sCount[k];
}
for (j=0; j<10; j++) {document.getElementById("v"+j).firstChild.innerText=qVCount[j];}
for (j=0; j<10; j++) {document.getElementById("jv"+j).firstChild.innerText=qJvCount[j];}
document.getElementById("vscore").firstChild.innerText=computeTeamScore(sCount.slice(0,5));
document.getElementById("jvscore").firstChild.innerText=computeTeamScore(sCount.slice(5));


for(j=0; j<10; j++) {
    rowButtons[j].forEach(element => {
        element.addEventListener("click", ()=>{
            clickAction(element);
        });
    });
}

