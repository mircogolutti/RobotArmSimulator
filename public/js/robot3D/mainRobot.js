	
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	
	var container, stats;
	var camera, scene, renderer, light;
	var base, mesh2, mesh3, mesh4, hand;  // robot parts

	// robotJoint.rotation.y  = # <- you assign a number ( you will eed to play with this to understand magnatude )
	// robotJoint1.rotation.z = #
	// robotJoint2.rotation.z = #
	// robotJoint3.rotation.z = #
	
	var robotJoint = new THREE.Object3D();  // base to body joint (rotation limited to y axis)
	var robotJoint1 = new THREE.Object3D(); // body to arm1 (rotation limited to z axis)
	var robotJoint2 = new THREE.Object3D(); // arm1 to arm2 (rotation limited to z axis)
	var robotJoint3 = new THREE.Object3D(); // arm2 to hand (rotation limited to z axis)

	var robotJointArray = [];
	var valueJointArray = [];

	valueJointArray[0] = 0;valueJointArray[1] = 0;valueJointArray[2] = 0;valueJointArray[3] = 0;
	
	// use this for keyboard control
	var tabValue = 0;
	
	var rateSizeCanvas = 1.5;

	// cameria variables
	var radious = 7000, theta = 45, phi = 60, onMouseDownTheta = 45, onMouseDownPhi = 60,
	isMouseDown = false, onMouseDownPosition, mouse3D, projector, ray;

	var loader;
	
	init();
	animate();

	window.onresize = function(event) {
					
		var widthContainer = bodyDashboard.clientWidth;
		var heightContainer = widthContainer/rateSizeCanvas;	
		
//		alert("widthContainer="+widthContainer+"  heightContainer"+heightContainer+"  (widthContainer / heightContainer)="+(widthContainer / heightContainer));
		renderer.setSize( widthContainer, heightContainer );	
		
		delete camera;			
		camera = new THREE.Camera( 50, rateSizeCanvas, 1, 10000 );
		camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
		camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.target.position.y = 200;
	};
	
	function init() {

		var widthContainer = bodyDashboard.clientWidth;
		var heightContainer = widthContainer/rateSizeCanvas;
		
//		alert("widthContainer="+widthContainer+"  heightContainer"+heightContainer+"  (widthContainer / heightContainer)="+(widthContainer / heightContainer));
		container = document.getElementById( 'container' );
		
		camera = new THREE.Camera( 50, rateSizeCanvas, 1, 10000 );
		camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
		camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.target.position.y = 200;
		//camera.lookAt(0,200,0);

		scene = new THREE.Scene();

		scene.addLight( new THREE.AmbientLight( 0x333333 )  );

		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 0, 0, 1 );
		light.position.normalize();
		scene.addLight( light );

		//load robot model
		loader = new THREE.JSONLoader();

		loader.load( { model: "js/robot3D/obj/robot_arm_base.js", callback: createBase } );
		loader.load( { model: "js/robot3D/obj/robot_arm_body.js", callback: createBody } );
		loader.load( { model: "js/robot3D/obj/robot_arm_arm1.js", callback: createArm1 } );
		loader.load( { model: "js/robot3D/obj/robot_arm_arm2.js", callback: createArm2 } );
		loader.load( { model: "js/robot3D/obj/robot_arm_hand.js", callback: createHand } );

		// renderer start
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize( widthContainer, heightContainer );

		container.appendChild( renderer.domElement );

		// add note to page
//			addText = document.createElement( 'div' );
//			addText.style.position = 'absolute';
//			addText.style.color = '#000';
//			addText.style.top = '10px';
//			addText.style.left = '10px';
//			addText.innerHTML = 'Use Arrow Keys <- -> , toggle axis by hitting space bar';
//			container.appendChild( addText );//	
//			onMouseDownPosition = new THREE.Vector2();//	
//			document.addEventListener( 'mousemove', onDocumentMouseMove, false );
//			document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
//			document.addEventListener( 'mousedown', onDocumentMouseDown, false );
//			document.addEventListener( 'mouseup', onDocumentMouseUp, false );//	
//			document.addEventListener( 'keydown', onDocumentKeyDown, false );
//			//document.addEventListener( 'keyup', onDocumentKeyUp, false );			
	}
	
	//keyboard events
	function onDocumentKeyDown( event ) {

		switch( event.keyCode ) {

		case 32: toggleJoint(); break; // tab

		case 37: offsetScene(-1,0); break;     //arrow <-
		case 39: offsetScene( 1,0); break;     //arrow ->
		//case 38: offsetScene( 0, -1); break; //arrow /\
		//case 40: offsetScene( 0, 1 ); break; //arrow \/
		}	
	}
	
	function toggleJoint() {

		if (tabValue === robotJointArray.length - 1) {
			tabValue = 0;
		}
		else {
			tabValue++;
		}
	}
	
	function onDocumentKeyUp( event ) {

		switch( event.keyCode ) {
		//case 16: isShiftDown = false; interact(); render(); break;
		}	
	}
	
	function offsetScene( offsetX, offsetY ) {

		var mag = 0.05;
		// currently offsetY not used
		if (robotJointArray[tabValue].control === 'y') {
			robotJointArray[tabValue].rotation.y = robotJointArray[tabValue].rotation.y + Math.sin(offsetX*mag);
		}
		if (robotJointArray[tabValue].control === 'z') {
			robotJointArray[tabValue].rotation.z = robotJointArray[tabValue].rotation.z + Math.sin(offsetX*mag);
		}
		robotStat.update(robotJointArray);	    
	}
	
	// mouse events
	function onDocumentMouseWheel( event ) {

		radious -= event.wheelDeltaY;

		camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
		camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

	}
	
	function onDocumentMouseDown( event ) {

		event.preventDefault();

		isMouseDown = true;

		onMouseDownTheta = theta;
		onMouseDownPhi = phi;
		onMouseDownPosition.x = event.clientX;
		onMouseDownPosition.y = event.clientY;
	}
	
	function onDocumentMouseMove( event ) {

		event.preventDefault();

		if ( isMouseDown ) {

			theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
			phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;

			phi = Math.min( 180, Math.max( 0, phi ) );

			camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		}
	}

	function onDocumentMouseUp( event ) {

		event.preventDefault();

		isMouseDown = false;

		onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
		onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;

	}
	// --------- end mouse control --------------------

	function createBase( geometry ) {

		geometry.materials[0][0].shading = THREE.FlatShading;

		var material = new THREE.MeshFaceMaterial();

		base = new THREE.Mesh( geometry, material );

		base.scale.x = base.scale.y = base.scale.z = 75;

		// adding joint for body
		base.addChild (robotJoint);
		// control body location by moving joint x,y,z
		robotJoint.position.y = 18;
		robotJoint.control = 'y'; // y axis is controlled
		// add all robotJoint joints to an array so i can control them easier later

		robotJoint.rotation.y = valueJointArray[0];
		robotJointArray[0] = robotJoint;

	}

	function createBody( geometry ) {

		geometry.materials[0][0].shading = THREE.FlatShading;

		var material = new THREE.MeshFaceMaterial();

		mesh2 = new THREE.Mesh( geometry, material );

		robotJoint.addChild(mesh2);

		// adding joint for arm1 
		robotJoint.addChild(robotJoint1);
		robotJoint1.position.x = 0;
		robotJoint1.position.y = -8;
		robotJoint1.control = 'z'; // z axis is controlled

		robotJoint1.rotation.z = valueJointArray[1];
		robotJointArray[1] = robotJoint1;

	}

	function createArm1( geometry ) {

		geometry.materials[0][0].shading = THREE.FlatShading;

		var material = new THREE.MeshFaceMaterial();

		mesh3 = new THREE.Mesh( geometry, material );

		robotJoint1.addChild(mesh3);

		// add joint for arm 2
		robotJoint1.addChild(robotJoint2);
		// these offsets are set manually
		robotJoint2.position.x = -16.5;
		robotJoint2.position.y = 14;
		robotJoint2.control = 'z';

		robotJoint2.rotation.z = valueJointArray[2];
		robotJointArray[2] = robotJoint2;
	}
	
	function createArm2( geometry ) {

		geometry.materials[0][0].shading = THREE.FlatShading;

		var material = new THREE.MeshFaceMaterial();

		mesh4 = new THREE.Mesh( geometry, material );

		robotJoint2.addChild(mesh4);

		robotJoint2.addChild(robotJoint3);
		// these offsets are set manually
		robotJoint3.position.x = -18.5;
		robotJoint3.position.y = 5.5;
		robotJoint3.control = 'z';

		robotJoint3.rotation.z = valueJointArray[3];
		robotJointArray[3] = robotJoint3;
	}
	
	function createHand( geometry ) {

		geometry.materials[0][0].shading = THREE.FlatShading;

		var material = new THREE.MeshFaceMaterial();

		hand = new THREE.Mesh( geometry, material );

		robotJoint3.addChild(hand);

		// this line of code must be at the very end.
		scene.addObject( base );

		// this must run once the file is fully loaded
		// add robot stat widget
		robotStat.init(robotJointArray);	
	}
	
	function animate() {

		requestAnimationFrame( animate );
		render();
	}

	function render() {

		renderer.render( scene, camera );	
	}		
	
	
	function SetJointValuePosition(tabValue, offset) {
		
		valueJointArray[tabValue] = Math.PI*Math.cos(offset);		
		robotArmChangeJointValue(tabValue);    
	}
	
	function SetJointOffsetPosition(tabValue, offset) {
		
		var mag = 0.02;
		
		valueJointArray[tabValue] =  valueJointArray[tabValue] + Math.sin(offset*mag);		
		robotArmChangeJointValue(tabValue);    

	}

	function InitJointValuePosition(tabValue, offset) {
		
		valueJointArray[tabValue] = Math.PI*Math.cos(offset);
		
		updateLabelOut(valueJointArray[tabValue], tabValue);	
	}
	
	function robotArmChangeJointValue(tabValue) {
	
		if (robotJointArray[tabValue].control === 'y') {
			robotJointArray[tabValue].rotation.y = valueJointArray[tabValue];
		}
		if (robotJointArray[tabValue].control === 'z') {
			robotJointArray[tabValue].rotation.z = valueJointArray[tabValue];
		}
		
		updateLabelOut(valueJointArray[tabValue], tabValue);	    
	}
	
	function getForwardKinematics(){
		
		var x=0,y=0,z=0;
		var t1,t2,t3,t4;
		
		t1 = valueJointArray[0];
		t2 = valueJointArray[1];
		t3 = valueJointArray[2];
		t4 = valueJointArray[3];
		
		x = - 18.5*Math.cos(t1)*Math.cos(t2)*Math.cos(t3) 			- 
			5.5*Math.cos(t1)*Math.cos(t2)*Math.sin(t3) 				- 
			16.5*Math.cos(t1)*Math.cos(t2) 							+ 
			18.5*Math.cos(t1)*Math.sin(t2)*Math.sin(t3) 			-	 
			5.5*Math.cos(t1)*Math.sin(t2)*Math.cos(t3) 				- 
			14*Math.cos(t1)*Math.sin(t2) 							-
			5.5*Math.cos(t1)*Math.cos(t2)*Math.cos(t3)*Math.cos(t4) +
			5.5*Math.cos(t1)*Math.cos(t2)*Math.sin(t3)*Math.sin(t4) +
			5.5*Math.cos(t1)*Math.sin(t2)*Math.sin(t3)*Math.cos(t4) +
			5.5*Math.cos(t1)*Math.sin(t2)*Math.cos(t3)*Math.sin(t4) +
			11*Math.cos(t1)*Math.cos(t2)*Math.cos(t3)*Math.sin(t4) 	+
			11*Math.cos(t1)*Math.cos(t2)*Math.sin(t3)*Math.cos(t4) 	-
			11*Math.cos(t1)*Math.sin(t2)*Math.sin(t3)*Math.sin(t4) 	+
			11*Math.cos(t1)*Math.sin(t2)*Math.cos(t3)*Math.cos(t4);
		
		y = - 18.5*Math.sin(t2)*Math.cos(t3)                       	-
			5.5*Math.sin(t2)*Math.sin(t3)	                        -	
			16.5*Math.sin(t2)				                        -	
			18.5*Math.cos(t2)*Math.sin(t3) 	                        + 	
			5.5*Math.cos(t2)*Math.cos(t3)	                        +	
			14*Math.cos(t2)					                        +			
			10								                        -
			5.5*Math.sin(t2)*Math.cos(t3)*Math.cos(t4)              +
			5.5*Math.sin(t2)*Math.sin(t3)*Math.sin(t4)              -
			5.5*Math.cos(t2)*Math.sin(t3)*Math.cos(t4)              -
			5.5*Math.cos(t2)*Math.cos(t3)*Math.sin(t4)              +
			11*Math.sin(t2)*Math.cos(t3)*Math.sin(t4)               +
			11*Math.sin(t2)*Math.sin(t3)*Math.cos(t4)               +
			11*Math.cos(t2)*Math.sin(t3)*Math.sin(t4)               -
			11*Math.cos(t2)*Math.cos(t3)*Math.cos(t4);
		
		z = 18.5*Math.sin(t1)*Math.cos(t2)*Math.cos(t3)    			+
			5.5*Math.sin(t1)*Math.cos(t2)*Math.sin(t3)	    		+
			16.5*Math.sin(t1)*Math.cos(t2)				    		-
			18.5*Math.sin(t1)*Math.sin(t2)*Math.sin(t3)    			+
			5.5*Math.sin(t1)*Math.sin(t2)*Math.cos(t3)	    		+
			14*Math.sin(t1)*Math.sin(t2) 							+
			5.5*Math.sin(t1)*Math.cos(t2)*Math.cos(t3)*Math.cos(t4)	-
			5.5*Math.sin(t1)*Math.cos(t2)*Math.sin(t3)*Math.sin(t4)	-
			5.5*Math.sin(t1)*Math.sin(t2)*Math.sin(t3)*Math.cos(t4)	-
			5.5*Math.sin(t1)*Math.sin(t2)*Math.cos(t3)*Math.sin(t4)	-
			11*Math.sin(t1)*Math.cos(t2)*Math.cos(t3)*Math.sin(t4) 	-
			11*Math.sin(t1)*Math.cos(t2)*Math.sin(t3)*Math.cos(t4) 	+
			11*Math.sin(t1)*Math.sin(t2)*Math.sin(t3)*Math.sin(t4) 	-
			11*Math.sin(t1)*Math.sin(t2)*Math.cos(t3)*Math.cos(t4);
	
		return {
		    x: -x,
		    y: z,
		    z: y
		};
	}