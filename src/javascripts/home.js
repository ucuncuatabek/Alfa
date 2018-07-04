
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
        fetch('http://localhost:3000/restaurants')
        .then((res) => res.json())
        .then((data) =>{
            console.log(data[1].DisplayName);              
        });          
         
    }
};