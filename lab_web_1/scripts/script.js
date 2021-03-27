let x, y, r;
let chosenRELement, chosenXElement;

window.onload = function () {
    let xButtons = document.querySelectorAll(".x_btn");
    xButtons.forEach(clickX);
    function clickX(element) {
        element.onclick = function () {
            x = this.value;
            console.log("x is", x)
            if(chosenXElement) chosenXElement.style.backgroundColor = "";
            chosenXElement = this;
            this.style.backgroundColor = 'springgreen';
        }
    }

    let rButtons = document.querySelectorAll(".r_btn");
    rButtons.forEach(clickR);
    function clickR(element) {
        element.onclick = function () {
            r = this.value;
            console.log("r is", r)
            if(chosenRELement) chosenRELement.style.backgroundColor = "";
            chosenRELement = this;
            this.style.backgroundColor = 'springgreen';
        }
    }
};

document.getElementById("checkButton").onclick = function () {
    if (validateX() && validateY() && validateR()) {
        let str = '?x=' + x + '&y=' + y + '&r=' + r;
        console.log(str)
        fetch("scripts/answer.php" + str, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
        }).then(response => response.text()).then(function (serverAnswer) {
            setPointer();
            document.getElementById("outputContainer").innerHTML = serverAnswer;
        }).catch(err => createNotification("Ошибка HTTP. Повторите попытку позже." + err));
    }
};

function setPointer() {
    let pointer = document.getElementById("pointer");
    pointer.style.visibility = "visible";
    pointer.setAttribute("cx", (x/r*2 * 60 + 150));
    pointer.setAttribute("cy", (-y/r*2 * 60 + 150));
}

function createNotification(message) {
    let outputContainer = document.getElementById("outputContainer");
    if (outputContainer.contains(document.querySelector(".notification"))) {
        let stub = document.querySelector(".notification");
        stub.textContent = message;
        stub.classList.replace("outputStub", "errorStub");
    } else {
        let notificationTableRow = document.createElement("h4");
        notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
        outputContainer.prepend(notificationTableRow);
        let span = document.querySelector(".notification");
        span.textContent = message;
    }
}

function validateX() {
    try {
        return isNumeric(x)
    } catch (err) {
        createNotification("Значение X не выбрано");
        return false;
    }
}

function validateY() {
    y = document.querySelector("input[name=y_in]").value.replace(",", ".");
    if (y === undefined) {
        createNotification("Y не введён");
        return false;
    } else if (!isNumeric(y)) {
        createNotification("Y не число");
        return false;
    } else if (!((y > -3) && (y < 3))) {
        createNotification("Y не входит в область допустимых значений");
        return false;
    } else return true;
}

function validateR() {
    try {
        return isNumeric(r);
    } catch (err) {
        createNotification("Значение R не выбрано");
        return false;
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
