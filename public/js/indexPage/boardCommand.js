
var base;
var elbow;
var arm;
var mode = 0;

elbow = new Image();
elbow.src = "../../images/robot/elbow.png";
base = new Image();
base.src = "../../images/robot/base.png";
arm = new Image();
arm.src = "../../images/robot/arm.png";


// Button Selection Methods --------------------
// ---------------------------------------------
// ---------------------------------------------

function selectMe(whichClass){
	$(".functionButton").removeClass("selected");
	
	if (whichClass == 'x1') {
			$("#x1Button").addClass("selected");
	}else if(whichClass == 'y2'){
			$("#y2Button").addClass("selected");
	}else if(whichClass == 'z3'){
			$("#z3Button").addClass("selected");
	}else if(whichClass == 'rx'){
			$("#rx4Button").addClass("selected");
	}else if(whichClass == 'ry'){
			$("#ry5Button").addClass("selected");
	}else if(whichClass == 'rz'){
			$("#rz6Button").addClass("selected");
	}else if(whichClass == 't1'){
			$("#t1Button").addClass("selected");
	}else if(whichClass == 'step'){
			$("#stepButton").addClass("selected");
	}
	
}

// Drive Methods -------------------------------
// ---------------------------------------------
// ---------------------------------------------

function forward(speed){


	
	if($('#x1Button').hasClass('selected')){
		SetJointOffsetPosition(0, speed);
	}
	if($('#y2Button').hasClass('selected')){
		SetJointOffsetPosition(1, speed);
	}
	if($('#z3Button').hasClass('selected')){
		SetJointOffsetPosition(2, speed);
	}
	if($('#rx4Button').hasClass('selected')){
		SetJointOffsetPosition(3, speed);
	}
}

function reverse(speed){
	
	if($('#x1Button').hasClass('selected')){
		SetJointOffsetPosition(0, -speed);
	}
	if($('#y2Button').hasClass('selected')){
		SetJointOffsetPosition(1, -speed);
	}
	if($('#z3Button').hasClass('selected')){
		SetJointOffsetPosition(2, -speed);
	}
	if($('#rx4Button').hasClass('selected')){
		SetJointOffsetPosition(3, -speed);
	}
}


// Switches Between Modes (Joint, World, Tool) -------------------
// ---------------------------------------------------------------
// ---------------------------------------------------------------

function nextMode(){
	$(".ledLight").removeClass('on');
	
	if(mode == 3){
		mode = 0;
	}
	
	if(mode == 0){
			$("#jointModeLight").addClass('on');
	}else if(mode == 1){
			$("#worldModeLight").addClass('on');
	}else if(mode == 2){
			$("#toolModeLight").addClass('on');
	}
	
	mode++;	
}

// LCD Display Function ----------------
// -------------------------------------
// -------------------------------------
function lcdDisplay(){
		$("#lcdContent").html('');
		
		if($("#x1Button").hasClass('selected')){
			$("#lcdContent").html('Joint 1 Selected');
		}else if($("#y2Button").hasClass('selected')){
			$("#lcdContent").html('Joint 2 Selected');
		}else if($("#z3Button").hasClass('selected')){
			$("#lcdContent").html('Joint 3 Selected');
		}else if($("#rx4Button").hasClass('selected')){
			$("#lcdContent").html('Joint 4 Selected');
		}else if($("#ry5Button").hasClass('selected')){
			$("#lcdContent").html('Joint ry Not Present');
		}else if($("#rz6Button").hasClass('selected')){
			$("#lcdContent").html('Joint rz Not Present');
		}
}



