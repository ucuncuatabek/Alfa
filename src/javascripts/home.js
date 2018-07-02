export default {
    init(){       
        var controller = document.querySelector('[data-controller="restaurants"]');
        if(!controller) return false;
        this.attachEvents();   
    },
    attachEvents(){
       this.getRestaurants();
    },
    getRestaurants(){
           fetch('data.json')
           .then((res) => res.json())
           .then((data) =>{
               let output = '<h2> restaurants </h2>'
               var restaurants = data.d.ResultSet.searchResponseList;
               restaurants.forEach(function(restaurant) {
                   console.log(restaurant.DeliveryTime);
               });
           })
           
           
    }
};