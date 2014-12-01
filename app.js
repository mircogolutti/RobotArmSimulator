
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , io = require('socket.io')
  , mongoURI =  process.env.MONGOLAB_URI || 'mongodb://localhost/robotArmSchema'
  , db = mongoose.connect(mongoURI)
  , Schema = mongoose.Schema
  , ObjectID = Schema.ObjectId
  , RobotArmSchema = require('./models/robotArmSchema.js').init(Schema, mongoose);


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//-----------------------------------------------------------------------------
//		Socket.IO Communication
//-----------------------------------------------------------------------------

var socketIO = io.listen(server);
var users = 0;

socketIO.sockets.on('connection', function(socket) {
	
	users++;
	
	socket.emit('CountMessage', {
		count : users
	});
	socket.broadcast.emit('CountMessage', {
		count : users
	});
	
	RobotArmSchema.find({}, function(err, allJoint) {
		socket.emit('InitAllPositionJointMessage', allJoint);
	});
	
	socket.on('GetAllPositionsJointsMessage', function(data) {
		RobotArmSchema.find({}, function(err, allJoint) {
			socket.emit('SetAllPositionsJointsMessage', allJoint);
		});
	});
	
	socket.on('GetPositionJointMessage', function(data) {
		RobotArmSchema.findOne({ jointNumber: data.jointNumber }, function(err, joint) {					
			if(joint != null){		
				socket.emit('ChangedPositionJointMessage', joint);
				socket.broadcast.emit('ChangedPositionJointMessage', joint);			
			}
		});
	});
	
	socket.on('SetPositionJointMessage', function(data) {				
		RobotArmSchema.findOne({ jointNumber: data.jointNumber }, function(err, joint) {					
			if(joint != null){									//Update Item			
				joint.jointAngleRad = data.jointAngleRad;					
				joint.save(function(err) {
					if (err)
						throw err;
					socket.emit('ChangedPositionJointMessage', joint);
					socket.broadcast.emit('ChangedPositionJointMessage', joint);
				});
			}
			else{												//New Item	
				var jointNew = new RobotArmSchema({
					jointNumber: data.jointNumber,
					jointAngleRad: data.jointAngleRad
				});				
				jointNew.save(function(err) {
					if (err)
						throw err;
					socket.emit('ChangedPositionJointMessage', jointNew);
					socket.broadcast.emit('ChangedPositionJointMessage', jointNew);
				});
			}
		});
	});
	
//	setInterval(function(){
//		RobotArmSchema.find({}, function(err, allJoint) {
//			socket.emit('SetAllPositionJointMessage', allJoint);
//			socket.broadcast.emit('SetAllPositionJointMessage', allJoint);
//		});
//	}, 1000);
	
	socket.on('disconnect', function() {
		users--;
		socket.emit('CountMessage', {
			count : users
		});
		socket.broadcast.emit('CountMessage', {
			count : users
		});
	});
});

//Our index page
app.get('/', routes.index);