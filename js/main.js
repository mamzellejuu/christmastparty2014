$('document').ready(function(){
	/* Test Socket IO Only on default url / */
	var path = window.location.pathname;
	if(path == '/'){
		var socket = io();
		socket.on('new media', function(data){
			console.log('Socket - main.js : ' + JSON.stringify(data));
		});

		socket.on('delete media', function(data){
			console.log(data);
		});
	}
	
	try {
		var g = Grid.configure({}).run();
	} catch(e){
		console.log(e);
	}
});


var section1 = $('section#one');
var section2 = $('section#dos');
var section3 = $('section#trio');
var section4 = $('section#quatro');
var section = $('section');
var body = $('body');





// function HideAllShowOne(number){
// 	section.addClass('hidden');
// 	$('section #dos').toggleClass('hidden');
// }

function scrollTo(number){
    $('html body').animate({
        scrollTop: number.offset().top
    }, 300);
}


$('#one-step').click(function() {
	scrollTo(section2);
});
$('#two-step').click(function() {
	scrollTo(section3);
});

function init(){
	$("html, body").animate({ scrollTop: 0 }, "slow");
}



$('document').ready(function(){
	init();
});
