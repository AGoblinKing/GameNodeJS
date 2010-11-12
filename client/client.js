$(function(){
    //Load loading Scene
    //Setup Future Dialogs
    $('.progressBar').progressbar({value:100});
    $('#progressGUI').dialog(progressBar);
    $('#loginGUI').dialog(login);
    $('#connectGUI').dialog(connectGUI);
    //$('#messageGUI').dialog(messageGUI);
    // Connect to Game
    $('#connectGUI').dialog('open');
    //Load Game Assets
    //Generate Background Scene
    //Generate 
});

$(window).bind('resize', function() {
   $('#render').width($(window).width());
   $('#render').height($(window).height());
});
var socket = new io.Socket(null, {port: 8080, rememberTransport: false});

socket.sendJSON = function (message) {
	socket.send(JSON.stringify(message));
}
socket.on('connect', function() {
	$('#progressGUI').dialog('close');
	$('#loginGUI').dialog('open');
});
socket.on('message', function(message){
	message = JSON.parse(message);
	switch(message.action) {
		  case 'update':
			   break;
		  case 'login':
			   if(message.code == 'success' && message.data.code == 1) {
					// Good Login, Lets Fetch Assets/Load
					$('#progressGUI').dialog({title:'Loading Game Assets'});
					$('.progressbar').progressbar({value:30});
					actions.data.getAssets();
			   } else {
					$('#progressGUI').dialog('close');
					$('#loginGUI .message').html('<div class=".ui-state-error">Invalid Login</div>');
					$('#loginGUI').dialog('open');
			   }
		  default:
			   
			   console.log(message);
	}
});

var game = {
	'actions': {
		'account': {
			'login': function(name, pass) {
				socket.sendJSON({'category':'account', 'action':'login', 'name': name, 'password':pass});
			}
		},
        'data' : {
            'getAssets': function() {
                socket.sendJSON({'category':'data', 'action':'getAssets'});
            }
        }
	}
}

var connectGUI = {
	 autoOpen:false,
	 draggable: false,
	 resizable: false,
	 minHeight: 0,
	 minWidth:0,
	 title: 'Connect to Game',
	 buttons: {
		  'Connect': function() {
			   socket.connect();
			   $('#connectGUI').dialog('close');
			   $('#progressGUI').dialog('open').dialog({title:"Connecting to game..."});
		  }
	 }
}
/* GUI Elements */
//loginGUI
var login = {
	 autoOpen:false,
	 title: 'Login',
	 draggable: false,
	 resizable: false,
	 buttons: {
		  'Login':function(){
			   $('#loginGUI').dialog('close');
			   $('.progressbar').progressbar({value:15});
			   $('#progressGUI').dialog('open').dialog({title:"Logging into game..."});
			   game.actions.account.login($('#loginName').val(), $('#loginPass').val());
		  },
		  'Cancel':function(){
			   $('#loginGUI input').val('');
		  }
	 },
	 zIndex:10
};

//progressGUI
var progressBar = {
	 autoOpen:false,
	 draggable: false,
	 resizable: false,
	 minHeight: 0,
	 minWidth:0
}
