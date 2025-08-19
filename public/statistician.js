
var restoreReqButton = document.getElementById("restoreReqButton");
var restoreButton = document.getElementById("restoreButton");
var coachTextField = document.getElementById("restoreCoachTextField")
var statusTextField = document.getElementById("restoreStatusTextField")
var endContestButton = document.getElementById("endContest");
var finishEndingButton = document.getElementById("finishEndingContest");
var endingContainer = document.getElementById("endingButtons");
var rankings = document.getElementById("rankings");
var downPaste = document.getElementById("downPaste");
var downBack = document.getElementById("downBack");
var downBackAuto = document.getElementById("downBackAuto");
var interval = 60000;

function backupPrompt() {
    downBackAuto.click();
}

var backingUp = setTimeout(backupPrompt, interval);

restoreReqButton.addEventListener("click", () => { 
    restoreReqButton.classList.add("invisible");
    restoreButton.classList.remove("invisible");
    coachTextField.classList.remove("invisible");
    statusTextField.classList.remove("invisible");
});

endContestButton.addEventListener("click", () => { 
    endContestButton.classList.add("invisible");
    endingContainer.classList.add("boxed");
    rankings.classList.remove("invisible");
    downPaste.classList.remove("invisible");
    downBack.classList.remove("invisible");
    finishEndingButton.classList.remove("invisible");
});

finishEndingButton.addEventListener("click", () => { 
    endContestButton.classList.remove("invisible");
    endingContainer.classList.remove("boxed");
    rankings.classList.add("invisible");
    downPaste.classList.add("invisible");
    downBack.classList.add("invisible");
    finishEndingButton.classList.add("invisible");
});

downBackAuto.addEventListener("click", () => { 
    backingUp = setTimeout(backupPrompt, interval);
    console.log(`setting Timeout`)
});

downBack.addEventListener("click", () => { 
    clearTimeout(backingUp);
});