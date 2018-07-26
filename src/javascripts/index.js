import helper from './helper'

export default {
    timer : null,
    
    init(){
       
        var controller = document.querySelector('[data-controller="signup"]');
        if(!controller) return false;
        this.attachEvents();  
    },
    attachEvents(){       
        if(localStorage.getItem("userlogged") == 1){
            window.open("home.html?city=ISTANBUL","_self");
        }
        var citySearch      = document.querySelector("#city-search-button");
        citySearch.onclick  = this.areaSearch;        
        this.getCities();    
    },   
    getCities(){
        var citiesList = document.querySelector("#cities");       
        helper.request('POST','get-cities')
        .then((data)=>{           
           data.forEach (element => citiesList.insertAdjacentHTML('beforeend','<option value='+element.CityName+'>') );  
        })
    }, 
    areaSearch(){
        var selectedCity = document.querySelector("#city-search-field").value;
        window.open('http://localhost:3001/home.html?city='+selectedCity,"_self")
    }
   
    
};
