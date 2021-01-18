//GLOBAL VARIABLES
var timeBlocks = $(".time-block")
var plans = {}

// give currentDayEl text of current day
setInterval(function(){
  var now = moment().format("dddd, MMMM DD YYYY hh:mm:ss")
  $("#currentDay")
    .text(now)
}, 1000);

// add class past present or future to each time block
setTimeBlockElClass = function(){
  // select all time block elements
  nowHour = moment().startOf("hour")
  // loop through them
  for (let i = 0; i < timeBlocks.length; i++) {
    // get id of each block
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

// on textarea click show button as unlocked
timeBlocks.on("click","textarea",function(){
  $(this)
    .next("button")
    .children("span")
    .addClass("oi-lock-unlocked")
    .removeClass("oi-lock-locked");
});



// on page load calculate when to switch block styles and then change every hour
setTimeout(
  setInterval(
    setTimeBlockElClass
   ,1000 * 60 * 60)
   // amount of time till the hour ends
   ,moment().endOf("h").diff(moment(),'ms')+1000
);
// set timeBlockClass on page load
setTimeBlockElClass();
