//GLOBAL VARIABLES
var timeBlocks = $(".time-block")
var plansObj = {}

// on textarea click show button as unlocked
$("textarea").on("focus",function(){
  $(this)
    .next(".saveBtn")
    .children("span")
    .addClass("oi-lock-unlocked text-warning")
    .removeClass("oi-lock-locked");
});

// on save button click
$(".saveBtn").on("click",function(){
  // visually lock save button span
  $(this)
    .children("span")
    .addClass("oi-lock-locked")
    .removeClass("oi-lock-unlocked text-warning");
  // update plansObj
    key = $(this).parent().attr("id")
  value = $(this).siblings("textarea").val();
  plansObj[key] = value
  savePlans();
});

$(".clearBtn").on("click", function() {
  // gets PlansObj from local storage
  plansObj = {};
  savePlans();
  loadPlans();
});

// save plans function
var savePlans = function() {
  localStorage.setItem("work-day-scheduler", JSON.stringify(plansObj))
}

// load plans function
var loadPlans = function() {
  if(!localStorage.getItem("work-day-scheduler")) {
    plansObj = {};
    savePlans();
    loadPlans();
  } 
  else {
    // gets PlansObj from local storage
    plansObj = JSON.parse(localStorage.getItem("work-day-scheduler"))
    // for each timeBlock
    $.each(timeBlocks,function(){
      id = $(this).attr("id")
      $(this)
        .children("textarea")
        .val(plansObj[id])
    });
  }
}
// ~~~~~ SET CLASSES ~~~~~
// function to properly classes timeBlocks
var setTimeBlockClass = function(){
  // select all time block elements
  nowHour = moment().startOf("hour")
  // loop through them
  for (let i = 0; i < timeBlocks.length; i++) {
    // get id of each block (which is set to military time hour of block)
    id = timeBlocks[i].getAttribute("id")
    // use id to set timeBlockHour
    timeBlockHour = moment().startOf('day').add(id,'h')
    // compare current hour to timeBlockHour
    var hourDiff = timeBlockHour.diff(nowHour, 'h')
    // select timeBlockEl
    timeBlockEl = $("#"+id)
    timeBlockEl.removeClass("past");
    timeBlockEl.removeClass("present");
    timeBlockEl.removeClass("future");
    // set timeBlockEl style class to correct time
    if(hourDiff < 0) {
      timeBlockEl.addClass("past");
    }

    else if(hourDiff === 0) {
      timeBlockEl.addClass("present");
    }
    
    else if(hourDiff > 0) {
      timeBlockEl.addClass("future");
    }
  }
};

// ~~~~~ SET CLASSES ONCE AN HOUR ON THE HOUR START ~~~~~
var setTimeBlockClassHourly = function(){
  setTimeBlockClass();
  setInterval(setTimeBlockClass, 1000 * 60 * 60);
}

setTimeout(
  setTimeBlockClassHourly
  ,moment().endOf("h").diff(moment(),'ms')+5);

// ~~~~~ DISPLAY DATE TIME ~~~~~
var displayDateTime = function() {
  $("#currentDay")
    .text(moment().format("ddd MMM DD hh:mm A"));
}
// ~~~~~ DISPLAY DATE TIME ONCE A MINUTE ON THE MINUTE ~~~~~
var displayDateTimeEveryMinute = function(){
  displayDateTime();
  setInterval(displayDateTime, 60000);
}

setTimeout(
  displayDateTimeEveryMinute
, moment().endOf("m").diff(moment(),'ms')+5);

// ~~~~~ RUN FUNCTIONS ON LOAD ~~~~~
displayDateTime();
setTimeBlockClass();
loadPlans();
