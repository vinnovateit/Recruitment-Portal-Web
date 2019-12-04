
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
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}