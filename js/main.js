$(document).ready(function() {
    var count;
    var interval;


    $("#scroll-right-detector").on('mouseover', function() {
        var div = $('body');
        console.log("being called, ",div)

        interval = setInterval(function(){
            count = count || 5;
            var pos = div.scrollLeft();
            div.scrollLeft(pos + count);
        }, 15);
    }).click(function() {
        count < 10 && count++;
    }).on('mouseout', function() {
        clearInterval(interval);
        count = 0;
    });

    $("#scroll-left-detector").on('mouseover', function() {
        var div = $('body');
        console.log("being called, ",div)

        interval = setInterval(function(){
            count = count || 5;
            var pos = div.scrollLeft();
            div.scrollLeft(pos - count);
        }, 15);
    }).click(function() {
        count < 10 && count++;
    }).on('mouseout', function() {
        clearInterval(interval);
        count = 0;
    });

});


function getCursorXY(e) {
    var xPosition = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    var yPosition = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    console.log(xPosition, yPosition);
}