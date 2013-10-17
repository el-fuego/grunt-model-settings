Model.prototype = {
    isUnbelievable: function () {
        return this.isWorkingDay() && this.isWeekend();
    },
    isWeekend: function () {
        return ((/^sat(urday)?|^sun(day)?/i).test(this.attributes.dayOfWeekName) || (/6/i).test(this.attributes.dayOfWeek) || this.isSunday());
    },
    isSunday: function () {
        return ((/7/i).test(this.attributes.dayOfWeek));
    },
    isWorkingDay: function () {
        return !(this.isWeekend());
    },
    is31FebruaryExists: function () {
        return false;
    },
    is01JanuaryExists: function () {
        return true;
    },
    returnNull: function () {
        return null;
    }
};
