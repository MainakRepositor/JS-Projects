// Change Menu
let standard_menu = document.querySelector("#standard");
let metric_menu = document.querySelector("#metric");
let standard_div = document.querySelector("#standard-form");
let metric_div = document.querySelector("#metric-form");
standard_menu.addEventListener("click", menu1);
metric_menu.addEventListener("click", menu2);
function menu1() {
  let status1 = standard_menu.getAttribute("status");
  if (status1 == "hidden") {
    //   Hide Metric div
    metric_div.style.display = "none";
    metric_menu.setAttribute("status", "hidden"); //Changed the status of metric menu so next time we click on metric menu it has status =hidden so we can display back metric div

    // Display standard div
    standard_div.style.display = "block";

    // Style metric menu
    metric_menu.classList.remove("class1");
    metric_menu.style.background = "#ecf0f1";
    metric_menu.style.color = "#9b59b6";

    // Style Standard Menu
    standard_menu.style.background = "#9b59b6";
    standard_menu.style.color = "#ecf0f1";
  }
}
function menu2() {
  let status2 = metric_menu.getAttribute("status");
  if (status2 == "hidden") {
    // Hide Standard div
    standard_div.style.display = "none";
    standard_menu.setAttribute("status", "hidden"); //Changed the status of standard menu so next time we click on standard menu it has status =hidden so we can display back standard div

    // Display Metric div
    metric_div.style.display = "block";

    // Style Standard Menu
    standard_menu.style.background = "#ecf0f1";
    standard_menu.style.color = "#9b59b6";

    // Style metric menu
    metric_menu.style.background = "#9b59b6";
    metric_menu.style.color = "#ecf0f1";
  }
}

// Calculate the Standard BMI
function cal_standard_bmi() {
  let error_box = document.querySelector("#error");
  let heightInFeet = document.querySelector("#h-in-feet").value;
  let heightInInches = document.querySelector("#h-in-inches").value;
  let height = parseInt(heightInFeet * 12) + parseInt(heightInInches);
  let weightInPounds = document.querySelector("#w-in-pounds").value;
  let standardBmi = (weightInPounds / Math.pow(height, 2)) * 703;

  if (heightInFeet == "" || heightInInches == "" || weightInPounds == "") {
    var msg =
      "Error: Please fill all the details, You can't leave any input field as blank.";
    error_box.innerHTML = `<b>${msg}</b>`;
  } else if (
    isNaN(heightInFeet) ||
    isNaN(heightInInches) ||
    isNaN(weightInPounds)
  ) {
    var msg =
      "Error: Your inputs is not a Number. Please enter only numbers inside input field.";
    error_box.innerHTML = `<b>${msg}</b>`;
    document.querySelector("#h-in-feet").value = "";
    document.querySelector("#h-in-inches").value = "";
    weightInPounds = document.querySelector("#w-in-pounds").value = "";
  } else {
    let result_box = document.querySelector(".bmi-result");
    let SBMI = standardBmi.toFixed(2);
    error_box.innerHTML = "";
    if (SBMI < 18.5) {
      result_box.innerHTML = `<div style="background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">Your BMI is ${SBMI}.<span style="color:yellow"> You are UnderWeight.Eat Some Extra Food today. Hahaha :)</span><br>
      <a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a></div>`;
    } else if (SBMI > 18.5 && SBMI < 24.9) {
      result_box.innerHTML = `<div style="background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">
      Your BMI is ${SBMI}.<span style="color:green">You have Healty Weight. Keep it up:)</span><br>
      <a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a>
      </div>`;
    } else if (SBMI > 24.9 && SBMI < 29.9) {
      result_box.innerHTML = `<div style="display:inline-block;background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">
      Your BMI is ${SBMI}.<span style="color:yellow">You are Overweight.Do some Exersise:)</span><br>
      <a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a>
      </div>`;
    } else if (SBMI > 29.9) {
      result_box.innerHTML = `<div style="display:inline-block;background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">
      Your BMI is ${SBMI}.<span style="color:red">You have Obesity or more than Overweight. Do Some Exercise :)<span><br><a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a>
      </div>`;
    } else {
      result_box.innerHTML = `<div style="background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">Your BMI is ${SBMI}.<span style="color:red">Something went wrong</span><br>
      <a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a>
      </div>`;
    }
  }
}

// Calculate Metric BMI
function cal_metric_bmi() {
  let error_box = document.querySelector("#error2");
  let heightInCentimeter = document.querySelector("#h-in-centimeter").value;
  let height = parseInt(heightInCentimeter) / 100;
  let weightInKg = document.querySelector("#w-in-kgs").value;
  let metricBmi = weightInKg / [Math.pow(height, 2)];

  if (heightInCentimeter == "" || weightInKg == "") {
    var msg =
      "Error: Please fill all the details, You can't leave any input field as blank.";
    error_box.innerHTML = `<b>${msg}</b>`;
  } else if (isNaN(heightInCentimeter) || isNaN(weightInKg)) {
    var msg =
      "Error: Your inputs is not a Number. Please enter only numbers inside input field.";
    error_box.innerHTML = `<b>${msg}</b>`;
    document.querySelector("#h-in-centimeter").value = "";
    document.querySelector("#w-in-kgs").value = "";
  } else {
    let result_box = document.querySelector(".bmi-result2");
    let MBMI = metricBmi.toFixed(2);
    error_box.innerHTML = "";
    if (MBMI < 18.5) {
      result_box.innerHTML = `<div style="background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">Your BMI is ${MBMI}.<span style="color:yellow"> You are UnderWeight.Eat Some Extra Food today. Hahaha :)</span><br>
      <a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a></div>`;
    } else if (MBMI > 18.5 && MBMI < 24.9) {
      result_box.innerHTML = `<div style="background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">
      Your BMI is ${MBMI}.<span style="color:green">You have Healty Weight. Keep it up:)</span><br>
      <a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a>
      </div>`;
    } else if (MBMI > 24.9 && MBMI < 29.9) {
      result_box.innerHTML = `<div style="display:inline-block;background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">
      Your BMI is ${MBMI}.<span style="color:yellow">You are Overweight.Do some Exersise:)</span><br>
      <a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a>
      </div>`;
    } else if (MBMI > 29.9) {
      result_box.innerHTML = `<div style="display:inline-block;background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">
      Your BMI is ${MBMI}.<span style="color:red">You have Obesity or more than Overweight. Do Some Exercise :)<span><br><a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a>
      </div>`;
    } else {
      result_box.innerHTML = `<div style="background:#1abc9c;color:#fff;box-shadow:0px 0px 5px black;border:1px solid gray;padding:1rem">Your BMI is ${MBMI}.<span style="color:red">Something went wrong</span><br>
      <a href="index.html" style="display:inline-block;background:#34495e;color:#fff;text-decoration:none;padding:10px">Refresh</a>
      </div>`;
    }
  }
}
