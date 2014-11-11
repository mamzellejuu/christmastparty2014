
$('document').ready(function(){
	/* Test Socket IO Only on default url / */
	var path = window.location.pathname;
	if(path == '/'){
		var socket = io();
		socket.on('new media', function(data){
			console.log(data);
		});

		socket.on('delete media', function(data){
			console.log(data);
		});
	}
});