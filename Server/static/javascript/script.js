const toggleButton = document.getElementsByClassName('toggleButton')[0]
const navLinks = document.getElementsByClassName('navLinks')[0]

toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active')
})

var d = new Date()
var yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
var todayOrYesterday = new Array(yesterday, d)
var weekday = new Array("Sonntag","Montag","Dienstag","Mittwoch","Donnerstag", "Freitag","Samstag");
var month = new Array("Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
                "September", "Oktober", "November", "Dezember")
var hours = new Array("00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23");

function showDate() {
    document.getElementById("currentDate").innerText = weekday[d.getDay()] + ", " + d.getDate() + ". " + month[d.getMonth()] + " " + d.getFullYear();
}

function changeBackground() {
    var x=0;
    document.getElementById("vergleichVortag").innerHTML = x;
    if (x == 0) {
        document.getElementById("vergleichVortag").style.backgroundColor = '#2997FF';
    } else if (x<0) {
        document.getElementById("vergleichVortag").style.backgroundColor = '#de0000';
    } else if (x>0) {
        document.getElementById("vergleichVortag").style.backgroundColor = '#08bf02';
    }
}

function populateWeekdays(){
    for(h=0; h<=1; h++) {
        x=h;
        console.log(x)
        const weekdaySelect = document.getElementsByClassName("weekday")[x];
        for(let i = 1; i < weekday.length; i++){
            const option = document.createElement('option');
            option.textContent = weekday[i];
            weekdaySelect.appendChild(option);
        }
        const option = document.createElement('option');
        option.textContent = weekday[0];
        weekdaySelect.appendChild(option);
        weekdaySelect.value = weekday[d.getDay()];
    }
}


//DATE DROPDOWN PICKER 1 (für Ende der anzuzeigenden Daten => ED; default ist heute)

//Create references to the dropdown's
const yearSelectED = document.getElementById("yearED");
const monthSelectED = document.getElementById("monthED");
const daySelectED = document.getElementById("dayED");

//Months are always the same
(function populateMonthsED(){
    for(let i = 0; i < month.length; i++){
        const option = document.createElement('option');
        option.textContent = month[i];
        monthSelectED.appendChild(option);
    }
    monthSelectED.value = month[d.getMonth()];
})();

let previousDayED;

function populateDaysED(month){
    //Delete all of the children of the day dropdown
    //if they do exist
    while(daySelectED.firstChild){
        daySelectED.removeChild(daySelectED.firstChild);
    }
    //Holds the number of days in the month
    let dayNumED;
    //Get the current year
    let year = yearSelectED.value;

    if(month === 'Januar' || month === 'März' || 
    month === 'Mai' || month === 'Juli' || month === 'August' 
    || month === 'Oktober' || month === 'Dezember') {
        dayNumED = 31;
    } else if(month === 'April' || month === 'Juni' 
    || month === 'September' || month === 'November') {
        dayNumED = 30;
    }else{
        //Check for a leap year
        if(new Date(year, 1, 29).getMonth() === 1){
            dayNumED = 29;
        }else{
            dayNumED = 28;
        }
    }
    //Insert the correct days into the day <select>
    for(let i = 1; i <= dayNumED; i++){
        const option = document.createElement("option");
        option.textContent = i;
        daySelectED.appendChild(option);
    }
        daySelectED.value = d.getDate();

    if(previousDayED){
        daySelectED.value = previousDayED;
        if(daySelectED.value === ""){
            daySelectED.value = previousDayED - 1;
        }
        if(daySelect.value === ""){
            daySelectED.value = previousDayED - 2;
        }
        if(daySelectED.value === ""){
            daySelectED.value = previousDayED - 3;
        }
    }
}

function populateYearsED(){
    //Get the current year as a number
    let year = d.getFullYear();
    //Make the previous 100 years be an option
    for(let i = 0; i < 101; i++){
        const option = document.createElement("option");
        option.textContent = year - i;
        yearSelectED.appendChild(option);
    }
}

populateDaysED(monthSelectED.value);
populateYearsED();

//By selecting an options the other ones change accordingly
yearSelectED.onchange = function() {
    populateDaysED(monthSelectED.value);
}
monthSelectED.onchange = function() {
    populateDaysED(monthSelectED.value);
}
//Selected day stays
daySelectED.onchange = function() {
    previousDayED = daySelectED.value;
}


//DATE DROPDOWN PICKER 2 (für Start der anzuzeigenden Daten => SD; default ist gestern)

const yearSelectSD = document.getElementById("yearSD");
const monthSelectSD = document.getElementById("monthSD");
const daySelectSD = document.getElementById("daySD");

(function populateMonthsSD(){
    for(let i = 0; i < month.length; i++){
        const option = document.createElement('option');
        option.textContent = month[i];
        monthSelectSD.appendChild(option);
    }
    monthSelectSD.value = month[yesterday.getMonth()];
})();

let previousDaySD;

function populateDaysSD(month){
    
    while(daySelectSD.firstChild){
        daySelectSD.removeChild(daySelectSD.firstChild);
    }
    
    let dayNumSD;
    
    let year = yearSelectSD.value;

    if(month === 'Januar' || month === 'März' || 
    month === 'Mai' || month === 'Juli' || month === 'August' 
    || month === 'Oktober' || month === 'Dezember') {
        dayNumSD = 31;
    } else if(month === 'April' || month === 'Juni' 
    || month === 'September' || month === 'November') {
        dayNumSD = 30;
    }else{
        
        if(new Date(year, 1, 29).getMonth() === 1){
            dayNumSD = 29;
        }else{
            dayNumSD = 28;
        }
    }
    
    for(let i = 1; i <= dayNumSD; i++){
        const option = document.createElement("option");
        option.textContent = i;
        daySelectSD.appendChild(option);
    }
        daySelectSD.value = yesterday.getDate();

    if(previousDaySD){
        daySelectSD.value = previousDaySD;
        if(daySelectSD.value === ""){
            daySelectSD.value = previousDaySD - 1;
        }
        if(daySelect.value === ""){
            daySelectSD.value = previousDaySD - 2;
        }
        if(daySelectSD.value === ""){
            daySelectSD.value = previousDaySD - 3;
        }
    }
}

function populateYearsSD(){
    
    let year = yesterday.getFullYear();
    
    for(let i = 0; i < 101; i++){
        const option = document.createElement("option");
        option.textContent = year - i;
        yearSelectSD.appendChild(option);
    }
}

populateDaysSD(monthSelectSD.value);
populateYearsSD();

yearSelectSD.onchange = function() {
    populateDaysSD(monthSelectSD.value);
}
monthSelectSD.onchange = function() {
    populateDaysSD(monthSelectSD.value);
}
daySelectSD.onchange = function() {
    previousDaySD = daySelectSD.value;
}

// SET DEFAULT TIME

//timeED value
var hourED = d.getHours();
var minED = d.getMinutes();

hourED = (hourED < 10 ? "0": "") + hourED;
minED = (minED < 10 ? "0" : "") + minED;
displayTimeED = hourED + ":" + minED;

document.getElementById("timeED").value = displayTimeED;

//timeSD value 
var hourSD = yesterday.getHours();
var minSD = yesterday.getMinutes();

hourSD = (hourSD < 10 ? "0":"") + hourSD;
minSD = (minSD < 10 ? "0" : "") + minSD;
displayTimeSD = hourSD + ":" + minSD;

document.getElementById("timeSD").value = displayTimeSD;

//show and end Livefeed
function startFeed() {
    document.getElementById("hideOrShowDiv").style.display ="block";
    document.getElementById("startFeedButton").style.display ="none";
    document.getElementById("livefeed").style.backgroundColor ="transparent";
}
function endFeed() {
    document.getElementById("hideOrShowDiv").style.display ="none";
    document.getElementById("startFeedButton").style.display ="block";
    document.getElementById("livefeed").style.backgroundColor ="#daedff";
    
}

//deactivate and update Frequenzmesser
function deactivateFIK () {
    var inputDay = document.getElementById("deactivateWeekday").value;
    if (httpGet("deactivateFIK/" + inputDay))
    {
        alert("Deaktivieren erfolgt: Der Frequenzmesser schaltet sich an jedem "+ dayToNumber(inputDay) + " nicht (mehr) ein.")
    }
}
function updateFIK () {
    var inputStartTime = document.getElementById("updateStart").value;
    var inputEndTime = document.getElementById("updateEnde").value;
    var inputDay = document.getElementById("updateWeekday").value;
    if (inputStartTime == '' || inputEndTime == '') {
        alert("Es wurden keine Zeiten angegeben.")
    } else {
        if (inputStartTime > inputEndTime) {
            alert("Ungültige Eingabe.");
        } else {
            if (httpGet("updateFIK/" + inputDay + "/" + inputStartTime + "/" + inputEndTime))
            {
                alert("Aktualisieren erfolgt: An jedem "+ dayToNumber(inputDay) +" schaltet sich der Frequenzmesser um "+ String(inputStartTime) +" Uhr ein und um "+ String(inputEndTime)+" Uhr aus.");
            }
        }
    }
    document.getElementById("infoRowStart").style.display = "auto";
    document.getElementById("infoRowEnde").style.display = "auto";
}

//move Linie
function moveUp () {
    httpGet("movelineup");
}
function moveDown () {
    httpGet("movelinedown");
}

// hide Infotext
/* 
function hideStartInfo() {
    document.getElementById("infoRowStart").style.display = "none";
}
function hideEndeInfo() {
    document.getElementById("infoRowEnde").style.display = "none";
}*/

function showData() {

    inputDaySD = document.getElementById("daySD").value;
    inputMonthnameSD = document.getElementById("monthSD").value;
    inputMonthSD = month.indexOf(document.getElementById("monthSD").value, 0)+1;
    inputYearSD = document.getElementById("yearSD").value;
    inputTimeSD = document.getElementById("timeSD").value;

    inputDayED = document.getElementById("dayED").value;
    inputMonthnameED = document.getElementById("monthED").value;
    inputMonthED = month.indexOf(document.getElementById("monthED").value, 0)+1;
    inputYearED = document.getElementById("yearED").value;
    inputTimeED = document.getElementById("timeED").value;

  google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
    //alert("Testausgabe \n"+
     //   "Intervallstart: "+inputDaySD+" "+inputMonthnameSD+"("+inputMonthSD+") "+inputYearSD+" "+inputTimeSD+" Uhr"+
       // "\n"+"Intervallende: "+inputDayED+" "+inputMonthnameED+"("+inputMonthED+") "+inputYearED+" "+inputTimeED+" Uhr");
    
    var datafromApi = httpGet("chart/"+ inputYearSD + "-" + inputMonthSD + "-" + inputDaySD + " " + inputTimeSD +"/" + inputYearED + "-" + inputMonthED + "-" + inputDayED + " " + inputTimeED);
    var dataforchart = JSON.parse(datafromApi);
   
    var data = google.visualization.arrayToDataTable(dataforchart);
        
    var options = {
      title: 'Besucher in Laden',
      hAxis: {title: 'Uhrzeit',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0},
      colors:['de0000', '#2997FF']
    };

    var chart = new google.visualization.AreaChart(document.getElementById('diagramm1'));
    chart.draw(data, options);
    console.log("Draw Chart")     
    
}

//API communication

function httpGet(url) {
    var xmlHTTP =new XMLHttpRequest();
    xmlHTTP.open("GET", url, false);
    xmlHTTP.send(null);
    return xmlHTTP.response;
}

function dayToNumber(day) {
    if (day == "Montag")
    {
        return 0;
    }
    if (day == "Dienstag")
    {
        return 1;
    }
    if (day == "Mittwoch")
    {
        return 2;
    }
    if (day == "Donnerstag")
    {
        return 3;
    }
    if (day == "Freitag")
    {
        return 4;
    }
    if (day == "Samstag")
    {
        return 5;
    }
    if (day == "Sonntag")
    {
        return 6;
    }
}
