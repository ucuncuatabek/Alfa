var mongoose = require('mongoose');
var db = mongoose.connection;
var express    = require('express');
const app      = express();
var cors       = require('cors')
var bodyParser = require('body-parser');
var multer     = require('multer'); // v1.0.5
var upload     = multer(); // for parsing multipart/form-data

var sessions = [];

app.use(cors())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://localhost:27017/ysapp');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("baglandı"); 
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
  //insertDocuments(db); 
});

app.post('/get-restaurants', (req, res) => {
  res.set('Content-Type', 'application/json');      
  res.status(200);  
  
  var selectedArea  = req.body.area;
  var city          = req.body.city;
  var catalogName   = 'TR_'+city;
 

  var restaurantCollection = db.collection('restaurants');   
  if (selectedArea) {
    var restaurantInfo = restaurantCollection.find({AreaName:selectedArea}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
    });
  }else if (catalogName) {
      var restaurantInfo = restaurantCollection.find({CatalogName:catalogName}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result)});
  }
 
});

app.post('/get-restaurant-info',(req,res) =>{
  res.set('Content-Type', 'application/json');      
  res.status(200);  
  var seoUrl = req.body.SeoUrl;
  var restaurantCollection = db.collection('restaurants');   
  var restaurantInfo = restaurantCollection.find({SeoUrl:seoUrl}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result)});
});

app.post('/check-user', (req, res) => {   
  res.set('Content-Type', 'application/json');
 
  res.status(200);
  var email = req.body.email;
  var pass = req.body.password; 
  
  var collection = db.collection('users');
  var userEmail = collection.find({email:email}).toArray(function(err, result) {

    if (err) throw err;
    if (result.length >0) {
      var userPassword = collection.find({email:email,password:pass}).toArray(function(err, result) {
        if (result.length>0) {
            res.send({message:"ok",username:result[0].Name,surname:result[0].Surname});
        } else {           
          res.send({message:"password"});
        }
      });
    } else {
      res.send({message:"user"});
    }
  });  
  
});

app.post('/add-user', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200);

  var email     = req.body.email;
  var pass      = req.body.password;
  var username  = req.body.username;
  var surname   = req.body.surname;
   
  var userCollection = db.collection('users'); 
  var user = userCollection.find({email:email}).toArray(function(err, result) {
      if (err) throw err;
      if (result.length > 0) {
            res.send({message:"Email kullanımda"});
      } else {        
          userCollection.insert({email:email,password:pass,Name:username,Surname:surname});
          res.send({message:"Kayıt başarılı!"});
      }
  });
});


app.post('/get-cities',(req,res)=>{
  res.set('Content-Type', 'application/json');
  res.status(200);

  var cityCollection = db.collection('cities');

  var cities = cityCollection.find().toArray(function(err,result){
    if(err) throw err;
    if(result.length>0){
      res.send(result);
    }   
  });
});

app.post('/start-session',(req,res) =>{   
  res.set('Content-Type', 'application/json');
  res.status(200);
  var token = require('crypto').randomBytes(16).toString('hex'); 
  var task = req.body.task;

  if(task == "user"){
    var name = req.body.name;
    var surname = req.body.surname;  
    var createdId = req.body.userId;
    var user = { 
                  username: name, 
                  surname : surname,
                  basket  : {}                        
              };    
   
    user["basket"]  = sessions[createdId]["basket"];
    sessions[token] = user;
    console.log(sessions,"user")    
    res.send({token:token,username:name,surname:surname}); 
  } 
  if(task == "guest"){
      var user = {      
                    basket  : {}                        
                    };
      sessions[token] = user; 
      console.log(sessions, "guest");
      res.send({token:token}); 
  }
});

app.post('/check-session',(req,res)=>{
  res.set('Content-Type', 'application/json');
  res.status(200);
  userId = req.body.userId;
  res.send(sessions[userId]);
});

app.post('/logout',(req,res)=>{
  res.set('Content-Type', 'application/json');
  res.status(200);
  var userId = req.body.userId;    
  delete sessions[userId];  
  res.send({});
});

app.post('/get-session-data',(req,res)=>{
  res.set('Content-Type', 'application/json');
  res.status(200);  
  res.send(sessions[userId])
});

app.post('/add-delete-basket',(req,res) =>{
  res.set('Content-Type', 'application/json');
  res.status(200); 
  
  var userId = req.body.userId;  
  console.log(userId)
  console.log(sessions)
  var task = req.body.task;

  if (task == "add") {
      sessions[userId]["basket"] = req.body.basket;    
  } 
  if (task == "clear") {
    sessions[userId]["basket"] = {};
  }  
  console.log(sessions[userId])
  res.send({});
});

app.post('/get-areas',(req,res)=>{
  res.set('Content-Type', 'application/json');
  res.status(200);

  var cityName       = req.body.cityName;
  var areaCollection = db.collection('areas');

  var areas = areaCollection.find({CityName:cityName}).toArray(function(err,result){
    if(err) throw err;
    if (result.length>0) {
        res.send(result);
    }   
  });
});

app.post('/get-menu', (req, res) => {   
  res.set('Content-Type', 'application/json'); 
  res.status(200);
 
  var collection = db.collection('menus');
  var menu = collection.find({}).toArray(function(err, result) {
    if (err) throw err;
    if  (result.length >0)  {
          res.send(result);
    }
  });    
});





function insertDocuments(){
  //var collection = db.collection('menus');
  //collection.update({"SeoUrl" : {$regex : ".*ankara.*"}},{$set : {"CityName":"ANKARA"}},{multi:true});
  collection.insert([]);
}




 