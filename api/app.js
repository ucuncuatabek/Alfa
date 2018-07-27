var mongoose = require('mongoose');
var db = mongoose.connection;
var express    = require('express');
const app      = express();
var cors       = require('cors')
var bodyParser = require('body-parser');
var multer     = require('multer'); // v1.0.5
var upload     = multer(); // for parsing multipart/form-data

var userRoutes        = require("./routes/user");
var restaurantRoutes  = require("./routes/restaurant");
var areaRoutes        = require("./routes/areas");

var sessions = [];

app.use(cors())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

userRoutes.init(app,db,sessions);
restaurantRoutes.init(app,db,sessions);
areaRoutes.init(app,db,sessions);
mongoose.connect('mongodb://localhost:27017/ysapp');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("baglandı"); 
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
  //insertDocuments(db); 
});

function insertDocuments(){
  //var collection = db.collection('menus');
  //collection.update({"SeoUrl" : {$regex : ".*ankara.*"}},{$set : {"CityName":"ANKARA"}},{multi:true});
  collection.insert([]);
}




 