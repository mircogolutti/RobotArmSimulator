
	function TypeControlHandle(radio){
		
		if(radio.value == "External Control"){
			$("#joint0").prop('disabled',true);
			$("#joint1").prop('disabled',true);
			$("#joint2").prop('disabled',true);
			$("#joint3").prop('disabled',true);	
			
			$('#wrapperJointPosition').show();
			$('#teachOutside').hide();
		}
		if(radio.value == "Range Control"){
			$("#joint0").prop('disabled',false);
			$("#joint1").prop('disabled',false);
			$("#joint2").prop('disabled',false);
			$("#joint3").prop('disabled',false);	
			
			$('#wrapperJointPosition').show();
			$('#teachOutside').hide();
		}
		if(radio.value == "Button Control"){
			$("#joint0").prop('disabled',false);
			$("#joint1").prop('disabled',false);
			$("#joint2").prop('disabled',false);
			$("#joint3").prop('disabled',false);	
			
			$('#wrapperJointPosition').hide();
			$('#teachOutside').show();
		}
	}