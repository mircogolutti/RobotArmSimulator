
	var socket = io.connect();

	function RangeFunctionOnChange(RangeObject){	
		socket.emit('SetPositionJointMessage', RangeObject);
	}
	
	socket.on('InitAllPositionJointMessage', function(data){
		if(data.length > 4){ alert("Database Error");}
		for(var i = 0; i< data.length; i++){
			$('#joint'+data[i].jointNumber).val(data[i].jointAngleRad*360/Math.PI);
			InitJointValuePosition(data[i].jointNumber, data[i].jointAngleRad);
		}
	});	
	
	function GetAllPositiosJoints(){
		socket.emit('GetAllPositionsJointsMessage');
	}
	
	function GetPositioJoint(JointObject){
		socket.emit('GetPositionJointMessage',JointObject);
	}
	
	socket.on('SetAllPositionsJointsMessage', function(data){
		if(data.length > 4){ alert("Database Error");}
		for(var i = 0; i< data.length; i++){			
			$('#joint'+data[i].jointNumber).val(data[i].jointAngleRad*360/Math.PI);
			SetJointValuePosition(data[i].jointNumber, data[i].jointAngleRad);
		}
	});	
	

	socket.on('ChangedPositionJointMessage', function(data){
		SetJointValuePosition(data.jointNumber, data.jointAngleRad);
		$('#joint'+data.jointNumber).val(data.jointAngleRad*360/Math.PI);
	});	
	
	socket.on('CountMessage', function (data) {
		$('footer#footer').html(data.count+' users online.');
	});
 