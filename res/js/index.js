
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
        .limit(10)
        .get()
        .then(function (querySnapshot) {
            setQuestionsData(querySnapshot);
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


    if (selectedQuestion == "q10") {
        alert("submitting")
    } else {
        $("#q" + parseInt(parseInt(selectedQuestion.substring(1, selectedQuestion.length)) + 1)).click()
    }
})