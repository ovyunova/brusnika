"use strict";

// function ready(fn) {
//   if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }
//
// ready(function(){
//   console.log('DOM ready');
// });
$(function () {
  var MultiDate = {
    datepickerDiv: "#datepicker",
    startDateField: "#start_date",
    endDateField: "#end_date",
    periodField: "#period",
    clearButton: "#clear",
    startDate: null,
    endDate: null,
    clearEndWhenSelectingStart: true,
    disableOutsideDates: false,
    numberOfMonths: 3,
    // Set either the start or the end date
    _changeDate: function _changeDate() {
      var date = this.value;
      var startDate = MultiDate.startDate;
      var endDate = MultiDate.endDate;
      var dateTime = moment(MultiDate._convertStringToJSDate(date));

      if (startDate && dateTime.isSame(startDate)) {
        MultiDate._clearStartDate();
      } else if (endDate && dateTime.isSame(endDate)) {
        MultiDate._clearEndDate();
      } else if (startDate && dateTime.isBefore(startDate)) {
        MultiDate.setStartDate(date);
      } else if (endDate && dateTime.isAfter(endDate)) {
        MultiDate.setEndDate(date);
      } else if (startDate && !endDate) {
        MultiDate.setEndDate(date);
      } else {
        MultiDate.setStartDate(date);
      }
    },
    _updateStartDateEvent: function _updateStartDateEvent(e) {
      var date = MultiDate._convertStringToJSDate(e.target.value, true);

      if (date !== MultiDate.startDate) {
        MultiDate.startDate = date;
        MultiDate.$datepicker.datepicker("refresh");
        MultiDate.moveToFirstDay();
      }
    },
    _updateEndDateEvent: function _updateEndDateEvent(e) {
      var date = MultiDate._convertStringToJSDate(e.target.value, true);

      if (date !== MultiDate.endDate) {
        MultiDate.endDate = date;
        MultiDate.$datepicker.datepicker("refresh");
      }
    },
    // Clear the end date
    _clearEndDate: function _clearEndDate() {
      MultiDate.endDate = null;
      MultiDate.$endDate.val("");

      if (MultiDate.disableOutsideDates) {
        MultiDate.$datepicker.datepicker("option", "maxDate", "");
      }
    },
    _clearStartDate: function _clearStartDate() {
      MultiDate.startDate = null;
      MultiDate.$startDate.val("");

      if (MultiDate.disableOutsideDates) {
        MultiDate.$datepicker.datepicker("option", "minDate", "");
      }
    },
    _convertStringToJSDate: function _convertStringToJSDate(date, asMoment) {
      asMoment = asMoment || false;

      if (date) {
        var split = date.split("/");
        var day = split[0];
        var month = split[1] - 1;
        var year = split[2];

        if (asMoment) {
          return moment(new Date(year, month, day));
        } else {
          return new Date(year, month, day);
        }
      } else {
        return null;
      }
    },
    _shouldDateBeSelected: function _shouldDateBeSelected(date) {
      var startDate = MultiDate.startDate;
      var endDate = MultiDate.endDate;

      if (!moment.isMoment(date)) {
        date = moment(date);
      }

      if (startDate && endDate && date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate)) {
        return true;
      } else if (startDate && date.isSame(startDate) || endDate && date.isSame(endDate)) {
        return true;
      } else {
        return false;
      }
    },
    _disableInputs: function _disableInputs() {
      MultiDate.$startDate[0].disabled = true;
      MultiDate.$endDate[0].disabled = true;
    },
    _enableInputs: function _enableInputs() {
      MultiDate.$startDate[0].disabled = false;
      MultiDate.$endDate[0].disabled = false;
    },
    _choosePeriodEvent: function _choosePeriodEvent(e) {
      var value = e.target.value;

      if (value === "custom") {
        MultiDate._enableInputs();

        MultiDate.$startDate.focus();
      } else {
        MultiDate._disableInputs();

        if (value === "last7") {
          MultiDate.startDate = moment().subtract(7, "days").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
          MultiDate.endDate = moment().subtract(1, "days").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
        } else if (value === "last30") {
          MultiDate.startDate = moment().subtract(30, "days").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
          MultiDate.endDate = moment().subtract(1, "days").set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0);
        }
      }

      MultiDate.sendDatesToInputs();
      MultiDate.moveToFirstDay();
      MultiDate.$datepicker.datepicker("refresh");
    },
    _clearDatesEvent: function _clearDatesEvent(e) {
      e.preventDefault();

      MultiDate._clearStartDate();

      MultiDate._clearEndDate();

      MultiDate.$period.val("custom");

      MultiDate._enableInputs();

      MultiDate.$datepicker.datepicker("refresh");
    },
    sendDatesToInputs: function sendDatesToInputs() {
      if (MultiDate.startDate) {
        MultiDate.$startDate.val(MultiDate.startDate.format("DD/MM/YYYY"));
      }

      if (MultiDate.endDate) {
        MultiDate.$endDate.val(MultiDate.endDate.format("DD/MM/YYYY"));
      }
    },
    setStartDate: function setStartDate(value, keepEndDate) {
      keepEndDate = keepEndDate || false;

      if (!keepEndDate && MultiDate.clearEndWhenSelectingStart) {
        MultiDate._clearEndDate();
      }

      MultiDate.$period[0].value = "custom";
      MultiDate.startDate = moment(MultiDate._convertStringToJSDate(value));
      MultiDate.sendDatesToInputs();

      if (MultiDate.disableOutsideDates) {
        MultiDate.$datepicker.datepicker("option", "minDate", value);
      }
    },
    setEndDate: function setEndDate(value) {
      MultiDate.endDate = moment(MultiDate._convertStringToJSDate(value));
      MultiDate.sendDatesToInputs();

      if (MultiDate.disableOutsideDates) {
        MultiDate.$datepicker.datepicker("option", "maxDate", value);
      }
    },
    moveToFirstDay: function moveToFirstDay() {
      if (MultiDate.startDate) {
        MultiDate.$datepicker.datepicker("setDate", MultiDate.startDate.toDate());
      }
    },
    getNumberOfCalendars: function getNumberOfCalendars() {
      var numberOfCalendars = 1;
      return numberOfCalendars;
    },
    resizeCalendar: function resizeCalendar() {
      var currentNumber = MultiDate.numberOfMonths;
      var newNumber = MultiDate.getNumberOfCalendars();

      if (currentNumber !== newNumber) {
        MultiDate.$datepicker.datepicker('option', "numberOfMonths", newNumber);
        MultiDate.numberOfMonths = newNumber;
        MultiDate.moveToFirstDay();
      }
    },
    init: function init() {
      var numberOfMonths = MultiDate.getNumberOfCalendars();
      MultiDate.datePickerSettings = {
        beforeShowDay: function beforeShowDay(date) {
          var className = MultiDate._shouldDateBeSelected(date) ? "active" : "";
          return [true, className];
        },
        numberOfMonths: numberOfMonths,
        dateFormat: "dd/mm/yy"
      }; // Setting elements

      MultiDate.$startDate = $(MultiDate.startDateField);
      MultiDate.$endDate = $(MultiDate.endDateField);
      MultiDate.$period = $(MultiDate.periodField);
      MultiDate.$clear = $(MultiDate.clearButton); // Binding Datepicker

      MultiDate.$datepicker = $(MultiDate.datepickerDiv).datepicker(MultiDate.datePickerSettings);
      MultiDate.$datepicker.on("change", MultiDate._changeDate); // Binding inputs

      MultiDate.$startDate.on("blur", MultiDate._updateStartDateEvent);
      MultiDate.$endDate.on("blur", MultiDate._updateEndDateEvent); // Binding period selector

      MultiDate.$period.on("change", MultiDate._choosePeriodEvent);
      MultiDate.$clear.on("click", MultiDate._clearDatesEvent);
    }
  };
  MultiDate.init();
  window.MultiDate = MultiDate;
  window.addEventListener("resize", MultiDate.resizeCalendar);
});
$("#start_date").on("change", function () {
  console.log($("#start_date").value);
});
$('.slider').slick({
  arrows: false,
  autoplay: true,
  speed: 300
});