module.exports =   {    
    init(app,db,sessions) { 
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
          
    }
}