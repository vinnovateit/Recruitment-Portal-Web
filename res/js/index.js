
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
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());

            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

function setQuestionsData(querySnapshot) {
    i = 0;

    for (i = 1; i <= 1; i++) {
        $("#ques").html(querySnapshot.docs[0].data().question)

        $("#opt1").html(querySnapshot.docs[0].data().option.opt1)
        $("#opt2").html(querySnapshot.docs[0].data().option.opt2)
        $("#opt3").html(querySnapshot.docs[0].data().option.opt3)
        $("#opt4").html(querySnapshot.docs[0].data().option.opt4)
    }


    $("#domains").css("display","none")

    $("#questions").css("display","block")
    
    // querySnapshot.forEach(function (doc) {
    //     // doc.data() is never undefined for query doc snapshots

    //     $("#ques").html(doc.data().questions)


    //     i += 1;

    // });
}