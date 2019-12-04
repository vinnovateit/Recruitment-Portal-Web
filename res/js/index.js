
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
        $("#qd").html(querySnapshot.docs[0].data().question)

        $("#op1").html(querySnapshot.docs[0].data().option.opt1)
        $("#op2").html(querySnapshot.docs[0].data().option.opt2)
        $("#op3").html(querySnapshot.docs[0].data().option.opt3)
        $("#op4").html(querySnapshot.docs[0].data().option.opt4)

        addListenersToQuesBtn(querySnapshot.docs[i-1].data(), i);
    }



    $("#domains").css("display", "none")

    $("#questions").css("display", "block")
}
function addListenersToQuesBtn(doc, quesBtnNo) {
    
    $("#yum_" + quesBtnNo).click(() => {
        alert("sj")
        $("#qd").html(doc.question)
        $("#op1").html(doc.option.opt1)
        $("#op2").html(doc.option.opt2)
        $("#op3").html(doc.option.opt3)
        $("#op4").html(doc.option.opt4)
    })
}