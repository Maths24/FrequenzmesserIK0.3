const toggleButton = document.getElementsByClassName('toggleButton')[0]
const navLinks = document.getElementsByClassName('navLinks')[0]

toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active')
})

var d = new Date()
var weekday = new Array("Sonntag","Montag","Dienstag","Mittwoch","Donnerstag", "Freitag","Samstag");
var month = new Array("Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
                "September", "Oktober", "November", "Dezember")

function showDate() {
    document.getElementById("currentDate").innerText = weekday[d.getDay()] + ", " + d.getDate() + ". " + month[d.getMonth()] + " " + d.getFullYear();
}

function changeBackground() {
    var x=0;
    //document.getElementById("vergleichVortag").innerHTML = x;
    if (document.getElementById("vergleichVortag").innerHTML == 0) {
        document.getElementById("vergleichVortag").style.backgroundColor = '#2997FF';
    } else if (document.getElementById("vergleichVortag").innerHTML<0) {
        document.getElementById("vergleichVortag").style.backgroundColor = '#de0000';
    } else if (document.getElementById("vergleichVortag").innerHTML>0) {
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

//DATE DROPDOWN PICKER

//Create references to the dropdown's
const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");

//Months are always the same
(function populateMonths(){
    for(let i = 0; i < month.length; i++){
        const option = document.createElement('option');
        option.textContent = month[i];
        monthSelect.appendChild(option);
    }
    monthSelect.value = month[d.getMonth()];
})();

let previousDay;

function populateDays(month){
    //Delete all of the children of the day dropdown
    //if they do exist
    while(daySelect.firstChild){
        daySelect.removeChild(daySelect.firstChild);
    }
    //Holds the number of days in the month
    let dayNum;
    //Get the current year
    let year = yearSelect.value;

    if(month === 'Januar' || month === 'März' || 
    month === 'Mai' || month === 'Juli' || month === 'August' 
    || month === 'Oktober' || month === 'Dezember') {
        dayNum = 31;
    } else if(month === 'April' || month === 'Juni' 
    || month === 'September' || month === 'November') {
        dayNum = 30;
    }else{
        //Check for a leap year
        if(new Date(year, 1, 29).getMonth() === 1){
            dayNum = 29;
        }else{
            dayNum = 28;
        }
    }
    //Insert the correct days into the day <select>
    for(let i = 1; i <= dayNum; i++){
        const option = document.createElement("option");
        option.textContent = i;
        daySelect.appendChild(option);
    }
        daySelect.value = d.getDate();

    if(previousDay){
        daySelect.value = previousDay;
        if(daySelect.value === ""){
            daySelect.value = previousDay - 1;
        }
        if(daySelect.value === ""){
            daySelect.value = previousDay - 2;
        }
        if(daySelect.value === ""){
            daySelect.value = previousDay - 3;
        }
    }
}

function populateYears(){
    //Get the current year as a number
    let year = d.getFullYear();
    //Make the previous 100 years be an option
    for(let i = 0; i < 101; i++){
        const option = document.createElement("option");
        option.textContent = year - i;
        yearSelect.appendChild(option);
    }
}

populateDays(monthSelect.value);
populateYears();

//By selecting an options the other ones change accordingly
yearSelect.onchange = function() {
    populateDays(monthSelect.value);
}
monthSelect.onchange = function() {
    populateDays(monthSelect.value);
}
//Selected day stays
daySelect.onchange = function() {
    previousDay = daySelect.value;
}
