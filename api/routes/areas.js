module.exports =   {    
    init(app,db,sessions) { 
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
          
    }
}