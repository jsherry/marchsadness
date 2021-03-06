/**
 * Created by Mike on 1/26/2015.
 */
var updateTeam = function () {
    "use strict";
    window.location.href = "/marchsadness/maketeamselections/" + event.target.value;
};

var setTabBackgrounds = function () {
    "use strict";
    var classToAdd,
        tabs = [
            '#r1tab-a',
            '#r2tab-a',
            '#r3tab-a',
            '#r4tab-a',
            '#r5tab-a',
            '#r6tab-a'
        ];
    tabs.map(function (tab) {
        if ($(tab).html()) {
            if ($(tab).html().indexOf("(Locked)") !== -1) {
                $(tab).addClass("ms-background-light-gray");
                $(tab).removeClass("ms-background-white");
                $(tab).removeClass("ms-background-yellow");
                classToAdd = "ms-background-light-gray";
            } else if ($(tab).hasClass("activeRound")) {
                $(tab).addClass("ms-background-white");
                $(tab).removeClass("ms-background-light-gray");
                $(tab).removeClass("ms-background-yellow");
                classToAdd = "ms-background-white";
            } else {
                $(tab).addClass("ms-background-yellow");
                $(tab).removeClass("ms-background-white");
                $(tab).removeClass("ms-background-light-gray");
                classToAdd = "ms-background-yellow";
            }
            $("#tableHeaderR" + tab[2]).addClass(classToAdd);
            $("#tableFooter" + tab[2]).addClass(classToAdd);
            $("#Round-table" + tab[2]).addClass(classToAdd);
        }
    });
};

var editBallot = function () {
    "use strict";
    $('.teamTextView').hide();
    $("#editBallotButton").hide();
    $('.teamSelectView').show();
    $("#cancelEditButton").show();
    $("#saveAllChangesButton").show();
};

var cancelEditBallot = function () {
    "use strict";
    $('.teamSelectView').hide();
    $("#cancelEditButton").hide();
    $("#saveAllChangesButton").hide();
    $('.teamTextView').show();
    $("#editBallotButton").show();
};

$(document).ready(function () {
    $('#UpdateTeam').on('click', updateTeam);
    $("#tabs").tabs();
    setTabBackgrounds();
    $("#editBallotButton").on("click", editBallot);
    $("#cancelEditButton").on("click", cancelEditBallot);
    $("#cancelEditButton").hide();
    $("#saveAllChangesButton").hide();
    $("#saveAllChangesButton").css("margin-right", "15px");
});

