var screen = $('#calc-screen');
var ans;
var reset;

function calc() {
    var value = screen.val();  //prints the calculated result on the screen
    
    var result; //result is the result of the calculation
    try {
        result = eval(value);  //evaluates the expression
        ans = result;   //stores the result in ans
    } catch (e) {      //if the expression is invalid [throws an error]
        result = 'Error';  //if there is an error, result is set to Error
        ans = null;  //and ans is set to null
    }
    screen.val(result); //prints the result on the screen
    $('#clear-btn').text('AC'); //changes the button text to "AC"
    reset = 1; //resets the flag
}

function enter(e) { //if enter is pressed
    var key = e.which | e.keyCode; //converts the keycode to a number
    if (/\r/.test(String.fromCharCode(key))) {  // if enter is pressed
        calc(); //calculates the expression
    }
}

$('body').keypress(function (e) { //if any key is pressed
    enter(e); //calls enter
});


$('button').keypress(function (e) { //if any key is pressed
    enter(e); //calls enter
    return false; //prevents the default action
});


$('button').click(function () { //if any button is clicked
    var key = $(this).text(); //stores the button text in key
    var value; //value is the value of the button
    console.log(key); //prints the button text
    if (reset === 1) { //if the flag is set
        screen.val(''); //clears the screen
        reset = 0; //resets the flag
    }
    if (key === '=') { //if the button is equal
        calc(); //calculates the expression
    } else if (key === 'AC') { //if the button is clear
        screen.val(''); //clears the screen
        ans = null; //and ans is set to null
        $('#clear-btn').text('CE'); //changes the button text to "CE"
    } else if (key === 'CE') {  //if the button is clear
        value = screen.val(); //prints the calculated result on the screen
        screen.val(value.substring(0, value.length - 1)); //clears the screen
    } else if (key === 'ans') { //if the button is clear
        if (ans !== undefined && ans !== null) { //if ans is defined
            value = screen.val();   //prints the calculated result on the screen
            if ((value.length + 3) < screen.attr('maxlength') - 1) {    //if the length of the expression is less than the maximum length
                screen.val(value + 'ans'); //adds the ans to the expression
            }
        }
        $('#clear-btn').text('CE');     //changes the button text to "CE"
    } else {
        value = screen.val(); //prints the calculated result on the screen
        if (value.length < screen.attr('maxlength') - 1) { //if the length of the expression is less than the maximum length
            screen.val(value + key); //adds the key to the expression
            $('#clear-btn').text('CE'); //changes the button text to "CE"
        }
    }
});

(function () { //if the page is loaded
    var screenWidth = screen.width(); //gets the screen width
    var maxLength = screenWidth * 0.049; //max length of the expression
    screen.attr('maxlength', maxLength); //sets the maximum length of the expression
}());

