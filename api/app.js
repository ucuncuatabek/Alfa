var mongoose = require('mongoose');
var db = mongoose.connection;
var express = require('express');

const app = express();
var cors = require('cors')

app.use(cors())

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://localhost:27017/ysapp');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("baglandı");
 
  app.get('/restaurants', (req, res) => {
      res.set('Content-Type', 'application/json');
      res.set("Access-Control-Allow-Origin","*");
      res.status(200);
    
      var restaurantCollection = db.collection('restaurants'); 
      var restaurantInfo = restaurantCollection.find({},{}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result)
      });
  });
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
  // insertDocuments(db);
});

app.post('/check-user', (req, res) => {   
  res.set('Content-Type', 'application/json');
 
  res.status(200);
  var email = req.body.email;
  var pass = req.body.password; 
  
  var collection = db.collection('users');
  var userEmail = collection.find({email:email}).toArray(function(err, result) {
    if (err) throw err;
    if(result.length >0){
      var userPassword = collection.find({email:email,password:pass}).toArray(function(err, result) {
        if(result.length>0){
          res.send({message:"ok"});
        } else {           
          res.send({message:"Şifre yanlış"});
        }
      });
    } else {
      res.send({message:"Kullanıcı bulunamadı"});
    }
  });  
  
});

app.post('/add-user', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200);

  var email = req.body.email;
  var pass = req.body.password;
   
  var userCollection = db.collection('users'); 
  var user = userCollection.find({email:email}).toArray(function(err, result) {
      if (err) throw err;
      if(result.length > 0){
          res.send({message:"Email kullanımda"});
      } else {        
          userCollection.insert({email:email,password:pass});
          res.send({message:"Kayıt başarılı!"});
      }
  });

});





 