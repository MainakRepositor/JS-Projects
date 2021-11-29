function getResult() {
    const decimalNum = parseInt(document.getElementById("Decimal").value);
    let convertedNum = undefined;
    let indexValue = document.getElementById('options').selectedIndex;
    let options = document.getElementById('options').options;
    let selectedConversionSystem = options[indexValue].text;
    if (selectedConversionSystem === 'Binary')
        convertedNum = decimalNum.toString(2);
    else if (selectedConversionSystem === 'Octal')
        convertedNum = decimalNum.toString(8);
    else if (selectedConversionSystem === 'Hexadecimal')
        convertedNum = decimalNum.toString(16);
    if (document.getElementById('result')) {
        let element = document.getElementById('result')
        element.parentNode.removeChild(element);
    }
    addElement('flex-container', 'p', 'result', decimalNum,
        convertedNum, selectedConversionSystem);
}

function addElement(parentId, elementTag, elementId,
    decimalNum, number, selectedConversionSystem) {
    let html = `Decimal number ${decimalNum} to 
    ${selectedConversionSystem} is ${number}`;
    let p = document.getElementById(parentId);
    let newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.style.color = 'black';
    newElement.style.marginTop = '520px';
    newElement.style.textAlign = 'center';
    newElement.style.display = 'flex';
    newElement.style.whiteSpace = 'nowrap';
    newElement.style.overFlow = 'hidden';
    newElement.style.fontSize = '1rem';
    newElement.innerHTML = html;
    p.appendChild(newElement);
}

