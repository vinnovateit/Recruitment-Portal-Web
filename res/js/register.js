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

    if (!(/^[a-z0-9A-Z.]{0,}[a-zA-Z]{0,2}2019[a-zA-Z]{0,1}@vitstudent.ac.in$/i.test(emailVal))) {
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

    if (isSignupValid) {
        // document.getElementsByClassName("registration")[0].classList.add('progress');
        $(".progress").css("display", "block")
        signUpUser(args);
    }
}

function signUpUser(args) {

    firebase.auth().createUserWithEmailAndPassword(args.emailVal, args.passVal).then((user) => {
        saveUserDataToFirestore(args)
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
            $("#progressText").html("Signed Up...")
            Notify({
                content: 'Signed Up Successfully. Please wait while we redirect you.',
                color: 'green',
                rounded: true,
                timeout: 2000
            });
            window.location = "/"
        })
        .catch(function (error) {
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

    var user = firebase.auth().currentUser;

    user.updateProfile({
        displayName: firstName + " " + lastName,
    });
}
$(".loginFormField").hide()

function showLogin() {
    $(".signUpFormField").hide()
    $(".loginFormField").show()
}

function showSignUp() {
    $(".signUpFormField").show()
    $(".loginFormField").hide()
}

function onLoginClick() {
    args = {}
    args.emailVal = $("#emailLo").val()
    args.passVal = $("#passLo").val()


    isLoginValid = true
    if (!(/^[a-z0-9A-Z.]{0,}2019[a-zA-Z]{0,1}@vitstudent.ac.in$/i.test(args.emailVal))) {
        $('#emailErrLo').css("display", "block")
        isLoginValid = false
    } else {
        $("#emailErrLo").css("display", "none")
    }

    if (args.passVal == "" || args.passVal.length < 8) {
        $('#passErrLo').css("display", "block")
        isLoginValid = false
    } else {
        $("#passErrLo").css("display", "none")
    }


    if (isLoginValid) {
        $(".progress").css("display", "block")
        firebase.auth().signInWithEmailAndPassword(args.emailVal, args.passVal).then(() => {
            Notify({
                content: 'Logged Up Successfully. Please wait while we redirect you.',
                color: 'green',
                rounded: true,
                timeout: 2000
            })
            window.location = "/index.html"
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...

            Notify({
                content: errorMessage,
                color: 'red',
                rounded: true,
                timeout: 2000
            });
            $(".progress").css("display", "none")
        });
    }


}