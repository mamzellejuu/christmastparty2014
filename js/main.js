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