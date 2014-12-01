
function init(Schema, mongoose){
	var TheSchema = new Schema({
		jointNumber: Number,
		jointAngleRad: Number,
		jointLenghtLink: Number
	});

	return mongoose.model('RobotArm', TheSchema);
}

module.exports.init = init;