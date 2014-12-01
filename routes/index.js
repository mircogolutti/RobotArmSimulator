
/*
 * GET home page.
 */

var fs = require('fs');
var file = 'public/json/menu.json';
var menuItemConfiguration;

fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
 
  menuItemConfiguration = JSON.parse(data);

});

exports.index = function(req, res){
	res.render('index', { title: 'GoluTech', menu: menuItemConfiguration });  
};

