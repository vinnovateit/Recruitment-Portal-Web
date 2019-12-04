function onSignupClick() {

    isSignupValid = true

    nameVal = $("#name").val()
    regNoVal = $("#regNo").val()
    mobNoVal = $("#mobNo").val()
    emailVal = $("#email").val()
    passVal = $("#pass").val()
    confPassVal = $("#confPass").val()

    args = {}
    args.nameVal = $("#name").val()
    args.regNoVal = $("#regNo").val()
    args.mobNoVal = $("#mobNo").val()
    args.emailVal = $("#email").val()
    args.passVal = $("#pass").val()
    args.confPassVal = $("#confPass").val()

    if (nameVal == "" || nameVal == null) {
        $('#nameErr').css("display", "block")
        isSignupValid = false
    } else {
        $("#nameErr").css("display", "none")
    }

    if (!/^19\w{3}\d{4}$/.test(regNoVal)) {
        $('#regNoErr').css("display", "block")
        isSignupValid = false
    } else {
        $("#regNoErr").css("display", "none")
    }

    if (!(/^\d{10}$/.test(mobNoVal))) {
        $('#mobNoErr').css("display", "block")
        isSignupValid = false
    } else {
        $("#mobNoErr").css("display", "none")
    }

    if (!(/^[a-z0-9A-Z.]{0,}2019@vitstudent.ac.in$/i.test(emailVal))) {
        $('#emailErr').css("display", "block")
        isSignupValid = false
    } else {
        $("#emailErr").css("display", "none")
    }

    if (passVal == "" || passVal.length < 8) {
        $('#passErr').css("display", "block")
        isSignupValid = false
    } else {
        $("#passErr").css("display", "none")
    }

    if (passVal != confPassVal) {
        $('#confPassErr').css("display", "block")
        isSignupValid = false
    } else {
        $("#confPassErr").css("display", "none")
    }

    if (!isSignupValid) {
        // document.getElementsByClassName("registration")[0].classList.add('progress');
        $(".progress").css("display", "block")
        signUpUser(args);
    }
}

function signUpUser(args) {

    firebase.auth().createUserWithEmailAndPassword(args.emailVal, args.passVal).then((user) => {
        $(".progress").html("Signed Up Successfully <br> Please wait while we log you in...")
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}


function saveUserDataToFirestore(args) {
    var db = firebase.firestore();
    let userUid = "Anonymous";
    if (firebase.auth().currentUser != null) {
        user = firebase.auth().currentUser;
        userUid = user.uid;
    }

    db.collection("users").doc(userUid).set({
        name: args.nameVal,
        phoneNumber: args.mobNoVal,
        email: args.emailVal,
        userUid: userUid,
        regNo: args.regNoVal
    })
        .then(function () {
            //TODO Show successfully submitted bug report show thank you message just after the button
            saveUserDataToFirestore(args)
            Notify({
                content: 'Signed Up Successfully. Please wait while we redirect you.',
                color: 'green',
                rounded: true,
                timeout: 2000
            });
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

    var user = firebase.auth().currentUser;

    user.updateProfile({
        displayName: firstName + " " + lastName,
    });
}