const pSize = 800; // packet size. payload too large error above a certain size, approx. 8000. Safety factor of 10.
const timeOutMillisecs = 500; // packet interval. Throttling happens if < 50ms, after 400 packets. Safety factor of 10.
const interval = 60000; // period in ms of repeating autobackup (60000 for 1 minute, set to 3000 for testing)
var restoreReqButton = document.getElementById("restoreReqButton"); // makes restore options appear
var restoreButton = document.getElementById("restoreButton"); // pressed after JSON text is pasted
var packetSendButton = document.getElementById("packetSendButton"); // invisible, clicked by javascript
var packetBodyHolder = document.getElementById("packetBodyHolder"); // invisible checkbox in a form POST /restore
var coachTextField = document.getElementById("restoreCoachTextField") // JSON is pasted in this field
var endContestButton = document.getElementById("endContest"); // makes ending-contest buttons appear
var finishEndingButton = document.getElementById("finishEndingContest"); // makes ending-contest buttons disappear
var endingContainer = document.getElementById("endingButtons"); // just a div, but I wanted the buttons that appear to be enclosed by a box
var rankings = document.getElementById("rankings"); // an ending-contest button
var downPaste = document.getElementById("downPaste"); // a button to download the spreadsheet pasteable contest
var downBack1 = document.getElementById("downBack1"); // a button to manually download a backup JSON and stop autobackups
var downBack2 = document.getElementById("downBack2"); // another button to manually download a backup JSON and stop autobackups
var downBackAuto = document.getElementById("downBackAuto"); // an always-invisible button clicked by javascript every minute
var beginAutoBackups = document.getElementById("beginAutoBackups"); // button to start autobackups
var progressCounter = document.getElementById("progressCounter"); // p element displaying the packet count during a restore operation
var backingUp = 0; // variable used for the name of the timer, do allow cancelation of timer
var pCnt = 0; // packet count in a restore operation
var numberOfPackets = 0; // number of packets in a restore operation
var tooLargeToSend = ""; // global variable to hold the JSON from coachTextField

// next comes the code for auto-backups--downBack and downBackAuto elements are submit buttons for a form

function backupPrompt() { 
    downBackAuto.click();
}

beginAutoBackups.addEventListener("click", () => { 
    backingUp = setTimeout(backupPrompt, interval);
});

downBackAuto.addEventListener("click", () => { 
    backingUp = setTimeout(backupPrompt, interval);
});

downBack1.addEventListener("click", () => { 
    clearTimeout(backingUp);
});

downBack2.addEventListener("click", () => { 
    clearTimeout(backingUp);
});

// code to make the restore-from-backup controls appear

restoreReqButton.addEventListener("click", () => { 
    restoreReqButton.classList.add("invisible");
    restoreButton.classList.remove("invisible");
    coachTextField.classList.remove("invisible");
});

// code to make the endingcontest buttons appear/disappear

endContestButton.addEventListener("click", () => { 
    endContestButton.classList.add("invisible");
    endingContainer.classList.add("boxed");
    rankings.classList.remove("invisible");
    downPaste.classList.remove("invisible");
    downBack1.classList.remove("invisible");
    finishEndingButton.classList.remove("invisible");
});

finishEndingButton.addEventListener("click", () => { 
    endContestButton.classList.remove("invisible");
    endingContainer.classList.remove("boxed");
    rankings.classList.add("invisible");
    downPaste.classList.add("invisible");
    downBack1.classList.add("invisible");
    finishEndingButton.classList.add("invisible");
});

// Code to compute the packetization of tooLargeToSend and start the chain of calls to sendPacket

restoreButton.addEventListener("click", () => {
    progressCounter.classList.remove("invisible");
    tooLargeToSend = coachTextField.value;
    var lengthOfString = tooLargeToSend.length;
    var extraBit = pSize - Math.round(pSize * ((lengthOfString / pSize) - Math.floor(lengthOfString / pSize)));
    if (extraBit == pSize) { extraBit = 0 }
    lengthOfString += extraBit;
    tooLargeToSend += " ".repeat(extraBit);
    numberOfPackets = lengthOfString / pSize;
    setTimeout(sendPacket, timeOutMillisecs);
});

// function to slice a packet from tooLargeToSend and submit the POST request that feeds the packet.

function sendPacket() {
    packetBody = tooLargeToSend.slice(pSize * pCnt, pSize * (pCnt + 1));
    packetBodyHolder.setAttribute("value", packetBody);
    packetStats = "p" + (pCnt + 1) + "t" + numberOfPackets + "z";
    packetSendButton.setAttribute("value", packetStats);
    packetSendButton.click();
    pCnt += 1;
    if (pCnt < numberOfPackets) { 
        progressCounter.innerText = "Send packet " + (pCnt + 1) + "/" + numberOfPackets; // progress "bar"
        setTimeout(sendPacket, timeOutMillisecs);
    }
}

// start auto-backups by default

backingUp = setTimeout(backupPrompt, interval);
