class Calculator {
    constructor(previousTextElement, currentTextElement) {
        this.previousTextElement = previousTextElement;
        this.currentTextElement = currentTextElement;
        this.clear();
    }

    clear() {
        this.current = '';
        this.previous = '';
        this.operation = undefined;
    }

    delete() {
        this.current = this.current.toString().slice(0, -1);
    }

    appendBracket(bracket) {
        if (bracket === ')' && this.current.length === 0) return;
        this.current = this.current.toString() + bracket.toString();
    }

    appendNumber(number) {
        if (number === '.' && this.current.includes('.') && !this.current.includes(this.operation)) return;
        if (this.current.toString()[0] === '0' && this.current.length === 1) {
            if (number !== '.') {
                this.current = this.current.toString() + '.';
            }
        }
        this.current = this.current.toString() + number.toString();
    }

    chooseOperation(operation) {
        this.current = this.current.toString() + operation.toString();
        this.operation = operation;
    }

    compute() {

        function calculation(buffString) {

            buffString = buffString.replace(/([^[0-9.]{1})/g, " $1 ").trim();
            buffString = buffString.replace(/ {1,}/g, " ");
            let buffArray = buffString.split(/\s/);
            let polishString = [];
            let polishStack = [];
            let stringId = -1;
            let stackId = -1;

            for (let i = 0; i < buffArray.length; i++) {
                switch (buffArray[i]) {
                    case "(":
                        stackId++;
                        polishStack[stackId] = buffArray[i];
                        break;
                    case ")":
                        while (stackId >= 0 && polishStack[stackId] != "(") {
                            stringId++;
                            polishString[stringId] = polishStack[stackId];
                            stackId--;
                        }
                        stackId--;
                        break;
                    case "+":
                        while (stackId >= 0 && (polishStack[stackId] == "+" || polishStack[stackId] == "-" || polishStack[stackId] == "*" || polishStack[stackId] == "/")) {
                            stringId++;
                            polishString[stringId] = polishStack[stackId];
                            stackId--;
                        }
                        stackId++;
                        polishStack[stackId] = buffArray[i];
                        break;
                    case "-":
                        while (stackId >= 0 && (polishStack[stackId] == "+" || polishStack[stackId] == "-" || polishStack[stackId] == "*" || polishStack[stackId] == "/")) {
                            stringId++;
                            polishString[stringId] = polishStack[stackId];
                            stackId--;
                        }
                        stackId++;
                        polishStack[stackId] = buffArray[i];
                        break;
                    case "*":
                        while (stackId >= 0 && (polishStack[stackId] == "*" || polishStack[stackId] == "/")) {
                            stringId++;
                            polishString[stringId] = polishStack[stackId];
                            stackId--;
                        }
                        stackId++;
                        polishStack[stackId] = buffArray[i];
                        break;
                    case "/":
                        while (stackId >= 0 && (polishStack[stackId] == "*" || polishStack[stackId] == "/")) {
                            stringId++;
                            polishString[stringId] = polishStack[stackId];
                            stackId--;
                        }
                        stackId++;
                        polishStack[stackId] = buffArray[i];
                        break;
                    default:
                        stringId++;
                        polishString[stringId] = buffArray[i];
                }
            }
            while (stackId >= 0) {
                stringId++;
                polishString[stringId] = polishStack[stackId];
                stackId--;
            }

            stackId = -1;
            let stringIdMax = stringId;

            for (stringId = 0; stringId <= stringIdMax; stringId++) {
                switch (polishString[stringId]) {
                    case "+":
                        stackId--;
                        polishStack[stackId] = polishStack[stackId] + polishStack[stackId + 1];
                        break;
                    case "-":
                        stackId--;
                        polishStack[stackId] = polishStack[stackId] - polishStack[stackId + 1];
                        break;
                    case "*":
                        stackId--;
                        polishStack[stackId] = polishStack[stackId] * polishStack[stackId + 1];
                        break;
                    case "/":
                        stackId--;
                        polishStack[stackId] = polishStack[stackId] / polishStack[stackId + 1];
                        break;
                    default:
                        stackId++;
                        polishStack[stackId] = parseFloat(polishString[stringId]);
                }
            }
            return polishStack[stackId];
        }

        this.previous = calculation(this.currentTextElement.innerText);
        this.current = '';
    }

    updateDisplay() {
        this.currentTextElement.innerText = this.current;
        this.previousTextElement.innerText = this.previous;
    }
}

const btnNumber = document.querySelectorAll('.number');
const btnOperation = document.querySelectorAll('.operation');
const btnEqual = document.querySelector('.equal');
const btnDelete = document.querySelector('.delete');
const btnAllClear = document.querySelector('.all_clear');
const previousTextElement = document.querySelector('.previous');
const currentTextElement = document.querySelector('.current');
const btnBracket = document.querySelectorAll('.bracket');

let inputs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "*", "/", ".", "(", ")"];

const calculator = new Calculator(previousTextElement, currentTextElement);

btnNumber.forEach(function (button) {
    button.addEventListener('click', function () {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
});

btnOperation.forEach(function (button) {
    button.addEventListener('click', function () {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
});

btnBracket.forEach(function (button) {
    button.addEventListener('click', function () {
        calculator.appendBracket(button.innerText);
        calculator.updateDisplay();
    })
})

document.addEventListener('keydown', function (event) {
    if (inputs.includes(event.key)) {
        calculator.appendNumber(event.key);
    }
    if (event.key === 'Backspace') {
        calculator.delete();
    }
    if (event.key === 'Enter') {
        calculator.compute();
    }
    calculator.updateDisplay();

});

btnEqual.addEventListener('click', function () {
    calculator.compute();
    calculator.updateDisplay();
});

btnAllClear.addEventListener('click', function () {
    calculator.clear();
    calculator.updateDisplay();
});

btnDelete.addEventListener('click', function () {
    calculator.delete();
    calculator.updateDisplay();
});