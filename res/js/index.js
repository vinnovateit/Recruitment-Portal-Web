


$("#aiBtn").click(function () {
    // isTextAttempted("AI")
    startTest("AI")
});

$("#androidBtn").click(function () {
    isTextAttempted("Android")

});

$("#webBtn").click(function () {
    isTextAttempted("Web")
});

$("#iotBtn").click(function () {
    isTextAttempted("IOT")
});

$("#managmentBtn").click(function () {
    isTextAttempted("Management")
});

$("#designBtn").click(function () {
    isTextAttempted("Design")
});

for (i = 1; i <= 10; i++) {
    localStorage.setItem("q" + i, "");
}

function isTextAttempted(testType) {
    let userUid = "Anonymous";
    if (firebase.auth().currentUser != null) {
        user = firebase.auth().currentUser;
        userUid = user.uid;
    }
    db = firebase.firestore()
    var docRef = db.collection("users").doc(userUid);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            if (doc.data()[testType] == "" || doc.data()[testType] == undefined)
                startTest(testType)
            else
                showMessage("You can give a test only once for each domain", time = 4000)

        } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
        }
    }).catch(function (error) {
        // console.log("Error getting document:", error);
    });


}


function startTest(testType) {
    if (testType == "Aptitude") {
        testType = "AI"
        showMessage("Starting Compulsory Aptitude Test. Please wait...", 2700)
    } else {
        showMessage("Starting Test. Please wait...", 2400)
    }




    var db = firebase.firestore();
    db.collection("backend/Questions/" + testType)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.docs = shuffle(querySnapshot.docs);
            setQuestionsData(querySnapshot);
            localStorage.setItem("domain", testType);
            startTimer(1)
            $("#text_box_heading").html(testType)
        })
        .catch(function (error) {
            // console.log("Error getting documents: ", error);
        });
}

questIdObj = {}
function setQuestionsData(querySnapshot) {
    i = 0;
    numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    numArr = shuffle(numArr)
    for (i = 0; i < numArr.length; i++) {
        $("#ques").html(querySnapshot.docs[0].data().question)
        $("#opt1").html(querySnapshot.docs[0].data().option.opt1)
        $("#opt2").html(querySnapshot.docs[0].data().option.opt2)
        $("#opt3").html(querySnapshot.docs[0].data().option.opt3)
        $("#opt4").html(querySnapshot.docs[0].data().option.opt4)

        // console.log(i + "  => " + numArr[i])
        addListenersToQuesBtn(querySnapshot.docs[numArr[i] - 1].data(), i, querySnapshot.docs[numArr[i] - 1].id);

        questIdObj["q" + i] = querySnapshot.docs[numArr[i] - 1].id
    }

    // alert(JSON.stringify(questIdObj))


    $("#domains").css("display", "none")

    $("#questions").css("display", "grid")
}

selectedQuestion = "q1"

function addListenersToQuesBtn(doc, quesBtnNo, docId) {

    $("#q" + quesBtnNo).click(() => {
        optReset([1, 2, 3, 4])
        selectedQuestion = "q" + quesBtnNo
        // console.log(quesBtnNo)
        $("#ques").html(doc.question)
        $("#opt1").html(doc.option.opt1)
        $("#opt2").html(doc.option.opt2)
        $("#opt3").html(doc.option.opt3)
        $("#opt4").html(doc.option.opt4)

        // $("#ques").addClass(docId)

        if (localStorage.getItem(selectedQuestion) != "")
            otpAnswer($("#opt" + localStorage.getItem(selectedQuestion)))
    })
}

$("#arrow").click(() => {


    if (selectedQuestion == "q2") {
        if (confirm("Are you sure you want to submit your answes?")) {
            submitAnswers()
        }
    } else {
        $("#q" + parseInt(parseInt(selectedQuestion.substring(1, selectedQuestion.length)) + 1)).click()
    }
})

function submitAnswers() {
    showMessage("Submitting your answers. Please wait...", 2000)
    selectedAnswers = {}
    for (i = 1; i <= 10; i++) {
        selectedAnswers["q" + i] = localStorage.getItem("q" + i);
    }
    domain = localStorage.getItem("domain");
    alert(JSON.stringify(selectedAnswers) + domain)
    saveAnswers(domain, selectedAnswers)
}

function saveAnswers(domain, selectedAnswers) {
    var db = firebase.firestore();
    let userUid = "Anonymous";
    if (firebase.auth().currentUser != null) {
        user = firebase.auth().currentUser;
        userUid = user.uid;
    }
    data = {}
    data[domain] = selectedAnswers
    // alert(userUid)
    db.collection("users").doc(userUid).update(
        data
    ).then(function () {
        //TODO Show successfully submitted bug report show thank you message just after the button
        Notify({
            content: 'Submitted. Please wait while we redirect you.',
            color: 'green',
            rounded: true,
            timeout: 2000
        });
        location.reload(true)
    }).catch(function (error) {
        var errorMessage = error.message;
        // console.error("Error writing document: ", error);
        Notify({
            content: errorMessage,
            color: 'red',
            rounded: true,
            timeout: 2000
        });
        $(".progress").css("display", "none")
    });
}
$("#opt1").click(() => {
    localStorage.setItem(questIdObj[selectedQuestion], "1");
    optReset([2, 3, 4])
    otpAnswer($("#opt1"))
})
$("#opt2").click(() => {
    localStorage.setItem(questIdObj[selectedQuestion], "2");
    optReset([1, 3, 4])
    otpAnswer($("#opt2"))
})
$("#opt3").click(() => {
    localStorage.setItem(questIdObj[selectedQuestion], "3");
    optReset([1, 2, 4])
    otpAnswer($("#opt3"))
})
$("#opt4").click(() => {

    localStorage.setItem(questIdObj[selectedQuestion], "4");
    optReset([1, 2, 3])
    otpAnswer($("#opt4"))
})

function otpAnswer(ele) {
    ele.css({
        "background-color": "#D7BDE2",
        "color": "#5F4D93",
        "font-weight": 600
    })
}
function optReset(arr) {

    for (i = 0; i < arr.length; i++) {
        // $("#opt"  + obj[i]).css("")
        $("#opt" + arr[i]).css({
            "background-color": "",
            "color": "",
            "font-weight": 400
        })
    }
}

function shuffle(a) {
    // console.log(a)
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    // console.log(a)
    return a;
}

function startTimer(till = 11) {
    $("#timer").css("display", "block")
    var now = new Date();
    now.setMinutes(now.getMinutes() + till); // timestamp
    now = new Date(now); // Date object
    // console.log(now);

    // Set the date we're counting down to
    var countDownDate = new Date(now).getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        document.getElementById("timer").innerHTML = "Time Left: " + minutes + "m " + seconds + "s ";

        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("timer").innerHTML = "Time Out!";
            submitAnswers()

        }
    }, 1000);
}

localStorage.setItem("domain", "")
// onVisibilityChange(function (visible) {
//     if (!visible) {
//         if (localStorage.getItem("domain") != "") {
//             alert("Uh oh! You moved out. Cancelling Test.")
//             localStorage.setItem("domain", "")
//             location.reload(true);
//         }
//     }
//     // console.log('the page is now', visible ? 'focused' : 'unfocused');
// });


function onVisibilityChange(callback) {
    var visible = true;

    if (!callback) {
        throw new Error('no callback given');
    }

    function focused() {
        if (!visible) {
            callback(visible = true);
        }
    }

    function unfocused() {
        if (visible) {
            callback(visible = false);
        }
    }

    // Standards:
    if ('hidden' in document) {
        document.addEventListener('visibilitychange',
            function () { (document.hidden ? unfocused : focused)() });
    }
    if ('mozHidden' in document) {
        document.addEventListener('mozvisibilitychange',
            function () { (document.mozHidden ? unfocused : focused)() });
    }
    if ('webkitHidden' in document) {
        document.addEventListener('webkitvisibilitychange',
            function () { (document.webkitHidden ? unfocused : focused)() });
    }
    if ('msHidden' in document) {
        document.addEventListener('msvisibilitychange',
            function () { (document.msHidden ? unfocused : focused)() });
    }
    // IE 9 and lower:
    if ('onfocusin' in document) {
        document.onfocusin = focused;
        document.onfocusout = unfocused;
    }
    // All others:
    window.onpageshow = window.onfocus = focused;
    window.onpagehide = window.onblur = unfocused;
};



firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        // fetchAndDisplayOldJudgement();
        setUserDisplayNameAndCheckAptTest(user.uid)
    } else {
        // No user is signed in.
        // or user signed out
        window.location.href = "/signUp.html?isLoggedIn=false";
    }
});

function setUserDisplayNameAndCheckAptTest(uid) {
    db = firebase.firestore()
    var docRef = db.collection("users").doc(uid);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            if (doc.data().apt == "" || doc.data().apt == undefined) {
                // startTest("Aptitude")
                isTextAttempted("Aptitude")
            }
            $("#logOut").html("LogOut, " + doc.data().name + "")
        } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

}

$("#logOut").click(function () {
    firebase.auth().signOut()
        .then(function () {
            showMessage("Logged Out Successfully!")
        })
        .catch(function (error) {
            showMessage("Error logging you out :(")
        });
})

function showMessage(message, time = 2000, color = "green") {
    Notify({
        content: message,
        color: color,
        rounded: true,
        timeout: time
    });
}