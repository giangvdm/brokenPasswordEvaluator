var App = {
    passwordInput: document.querySelector("#password-input"),
    noPasswordAlert: document.querySelector("#no-password-alert"),
    strengthBar: document.querySelector("#password-strength-bar"),
    strengthText: document.querySelector("#password-strength-text"),
    extraResult: document.querySelector("#extra-result"),
    improvementTip: document.querySelector("#improvement-tip"),
    showPassword() {
        if (this.passwordInput.type === "password") {
            this.passwordInput.type = "text";
        }
        else {
            this.passwordInput.type = "password";
        }
    },
    evaluatePassword() {
        // Object that stores results
        var evaluationResults = { // initiate default values
            code: -1,
            grade: 0,
            failed: ["characters", "numbers", "lowercase letters", "uppercase letters", "symbols"]
        };
        var strengthGrade = 0;

        // Evaluate the length of the password
        var passwordLength = this.passwordInput.value.length;
        // If no password entered
        if (passwordLength === 0) {
            // collect result(s)
            evaluationResults.code = -1;
            // abort evaluation
            return evaluationResults;
        }
        // If password entered
        // if password too short (< 6 chars)
        else if (passwordLength < 6) {
            // collect result(s)
            evaluationResults.code = 0;
            // abort evaluation
            return evaluationResults;
        }
        // Length evaluation passed, remove the case from "failed" array
        var idx = evaluationResults.failed.indexOf("characters");
        evaluationResults.failed.splice(idx, 1);

        // Declare evaluation patterns
        var patterns = [
            { name: "numbers", val: "\\d+" },
            { name: "lowercase letters", val: "[a-z]+" },
            { name: "uppercase letters", val: "[A-Z]+" },
            { name: "symbols", val: "[^A-Za-z0-9 ]+" } // our symbols will not include white space
        ];

        // Proceed to evaluate based on 4 patterns
        for (var i = 0; i < patterns.length; i++) {
            let e = RegExp(patterns[i].val);
            var result = e.test(this.passwordInput.value);
            if (result) {
                strengthGrade++;
                // remove the passed case
                idx = evaluationResults.failed.indexOf(patterns[i].name);
                evaluationResults.failed.splice(idx, 1);
            }
            else continue;
        }

        // Evaluation completed
        // Collect result(s)        
        evaluationResults.code = 1;
        evaluationResults.grade = strengthGrade;

        return evaluationResults;
    },
    displayResult(results) {
        // Display text
        switch (results.code) {
            case -1: // no password entered
                this.noPasswordAlert.textContent = "No Password Entered!";
                // clear strength-text
                this.strengthText.textContent = "";
                break;
            case 0: // password too short
                // clear no-password-alert message if any
                this.noPasswordAlert.textContent = "";
                // display message "too short", in red
                this.strengthText.textContent = "Password too short";
                this.strengthText.style.color = "red";
                break;
            case 1: // password evaluated successfully
                // clear no-password-alert message if any
                this.noPasswordAlert.textContent = "";
                // display result based on strength grade
                switch (results.grade) {
                    case 1:
                        this.strengthText.textContent = "Too weak";
                        break;
                    case 2:
                        this.strengthText.textContent = "Weak";
                        break;
                    case 3:
                        this.strengthText.textContent = "Moderate";

                        break;
                    case 4:
                        this.strengthText.textContent = "Strong";
                        break;
                    default:
                        this.strengthText.textContent = "";
                        break;
                }
                break;
            default: // unexpected code
                // clear everything if any
                this.noPasswordAlert.textContent = "";
                this.strengthText.textContent = "";
                break;
        }

        // color
        this.switchColor(this.strengthText.textContent);

        // Display on visual bar
        this.strengthBar.value = results.grade;
    },
    switchColor(command) {
        var colorForTexts = {
            "Password too short": "#FF0000",
            "Too weak": "#B22222",
            "Weak": "#FF8C00",
            "Moderate": "#FFD700",
            "Strong": "#32CD32"
        };
        this.strengthText.style.color = colorForTexts[command];
        // cannot work on html5's progress element
        // this.strengthBar.style.color = colorForTexts[command];
    },
    displayExtra(results) {
        // If the password failed one case or more
        if (results.failed.length !== 0) {
            // Show extra section
            this.extraResult.style.display = "block";
            var tips = "";
            for (var i = 0; i < results.failed.length; i++) {
                // need to include more characters first
                if (results.failed[i] === "characters") {
                    tips += "Try including 6 or more characters.\n";
                    continue;
                }
                // other cases
                tips += "Try including one or more " + results.failed[i] + ".";
                if (i < results.failed.length) tips += "\n";
            }
            this.improvementTip.value = tips;
        }
        // if not, password is already strong, all good
        else {
            this.extraResult.style.display = "none";
        }
    }
}

document.querySelector("#show-password").addEventListener("click", function () {
    App.showPassword();
});

document.querySelector("#password-submit").addEventListener("click", function () {
    results = App.evaluatePassword();
    App.displayResult(results);
    App.displayExtra(results);
});