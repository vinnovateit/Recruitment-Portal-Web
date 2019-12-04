
$("#aiBtn").click(function () {
    startTest("AI")
});

$("#androidBtn").click(function () {
    startTest("Android")
});

$("#webBtn").click(function () {
    startTest("Web")
});

$("#iotBtn").click(function () {
    startTest("IOT")
});

$("#managmentBtn").click(function () {
    startTest("Management")
});

$("#designBtn").click(function () {
    startTest("Design")
});


function startTest(testType) {
    var db = firebase.firestore();
    db.collection("backend/Questions/" + testType)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.docs = shuffle(querySnapshot.docs);
            setQuestionsData(querySnapshot);
            localStorage.setItem("domain", testType);
            startTimer(1)
            $("#text_box_heading").html(testType)
            // querySnapshot.forEach(function (doc) {
            //     // doc.data() is never undefined for query doc snapshots
            //     console.log(doc.id, " => ", doc.data());

            // });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

function setQuestionsData(querySnapshot) {
    i = 0;

    for (i = 1; i <= 2; i++) {
        $("#ques").html(querySnapshot.docs[0].data().question)

        $("#opt1").html(querySnapshot.docs[0].data().option.opt1)
        $("#opt2").html(querySnapshot.docs[0].data().option.opt2)
        $("#opt3").html(querySnapshot.docs[0].data().option.opt3)
        $("#opt4").html(querySnapshot.docs[0].data().option.opt4)

        addListenersToQuesBtn(querySnapshot.docs[i - 1].data(), i);
    }



    $("#domains").css("display", "none")

    $("#questions").css("display", "grid")
}

selectedQuestion = "q1"

function addListenersToQuesBtn(doc, quesBtnNo) {

    $("#q" + quesBtnNo).click(() => {
        selectedQuestion = "q" + quesBtnNo
        console.log(quesBtnNo)
        $("#ques").html(doc.question)
        $("#opt1").html(doc.option.opt1)
        $("#opt2").html(doc.option.opt2)
        $("#opt3").html(doc.option.opt3)
        $("#opt4").html(doc.option.opt4)
    })
}

$("#arrow").click(() => {


    if (selectedQuestion == "q2") {
        submitAnswers()
    } else {
        $("#q" + parseInt(parseInt(selectedQuestion.substring(1, selectedQuestion.length)) + 1)).click()
    }
})

function submitAnswers() {
    alert("submitting")
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
    alert(userUid)
    db.collection("users").doc(userUid).add(
        data
    ).then(function () {
        //TODO Show successfully submitted bug report show thank you message just after the button
        Notify({
            content: 'Submitted. Please wait while we redirect you.',
            color: 'green',
            rounded: true,
            timeout: 2000
        });
    }).catch(function (error) {
        var errorMessage = error.message;
        console.error("Error writing document: ", error);
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
    localStorage.setItem(selectedQuestion, "a");
})
$("#opt2").click(() => {
    localStorage.setItem(selectedQuestion, "b");
})
$("#opt3").click(() => {
    localStorage.setItem(selectedQuestion, "c");
})
$("#opt4").click(() => {
    localStorage.setItem(selectedQuestion, "d");
})




function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

function startTimer(till = 11) {
    var now = new Date();
    now.setMinutes(now.getMinutes() + till); // timestamp
    now = new Date(now); // Date object
    console.log(now);

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
        // document.getElementById("timer").innerHTML = days + "d " + hours + "h "
        //     + minutes + "m " + seconds + "s ";

        console.log(days + "d " + hours + "h " + minutes + "m " + seconds + "s ")

        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(x);
            // document.getElementById("timer").innerHTML = "Time Out!";
            submitAnswers()

        }
    }, 1000);
}

// localStorage.setItem("domain","")
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
        setUserDisplayName(user.uid)
    } else {
        // No user is signed in.
        // or user signed out
        window.location.href = "/signUp.html?isLoggedIn=false";
    }
});

function setUserDisplayName(uid) {
    db = firebase.firestore()
    var docRef = db.collection("users").doc(uid);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data().name);
            $("#logOut").html("LogOut, " + doc.data().name+ "")
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

}