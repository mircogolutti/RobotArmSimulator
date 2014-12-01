function updateLabelOut (valueJoint, position) {
	
	document.getElementById("labelX"+(position+1)).innerHTML = valueJoint;
 
	var fowordKinmatics = getForwardKinematics();

	document.getElementById("labelToolX").innerHTML = fowordKinmatics.x;
	document.getElementById("labelToolY").innerHTML = fowordKinmatics.y;
	document.getElementById("labelToolZ").innerHTML = fowordKinmatics.z;
}

