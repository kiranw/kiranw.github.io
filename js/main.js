$(document).ready(function() {
    var count;
    var interval;
    var maxScrollX = $(document).width() - $('body').width();

    $("#scroll-right-detector").on('mouseover', function() {
        var div = $('body');
        console.log("being called, ",div)

        interval = setInterval(function(){
            count = count || 1;
            var pos = div.scrollLeft();
            div.scrollLeft(pos + count ** 1.2/100 + 1);
            count += 1;
            // div.scrollLeft(pos + pos ** 1.05/100 + 5);
            // Based on scroll position (absolute) rather than relative acceleration
        }, 10);
    }).on('mouseout', function() {
        clearInterval(interval);
        count = 0;
    });

    $("#scroll-left-detector").on('mouseover', function() {
        var div = $('body');
        console.log("being called, ",div)

        interval = setInterval(function(){
            count = count || 1;
            var pos = div.scrollLeft();
            div.scrollLeft(pos - count ** 1.2/100 - 1);
            count += 1;
            // div.scrollLeft(pos - ((maxScrollX - pos) ** 1.05/100 + 5));
            // Based on scroll position (absolute) rather than relative acceleration
        }, 10);
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