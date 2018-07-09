import helper from './helper'
import index from './index'
export default {
    init(){               
        var controller = document.querySelector('[data-controller="home"]');       
        if(!controller) return false;        
        this.attachEvents();     
         
    },
    attachEvents(){        
        var userLogged = localStorage.getItem("userlogged");  
        if(userLogged == 1){
            this.knownUser();
        }       
        var areaSearch = document.querySelector("#area-search-button");
        areaSearch.onclick = this.areaSearch;
        this.getAreas();
        this.getRestaurants();
    },   
    knownUser(){
        alert("known")
    },
    getAreas(){
        var url = location.search;
        var start = url.indexOf("city")+5; 
        if(url.indexOf("&") != -1){
            var end = url.indexOf("&") ;
            var cityName = url.substring(start,end);
        }else {
            var cityName = url.substring(start,url.length);
        }
        console.log(cityName);
        var areasList = document.querySelector("#areas")
        helper.request('POST','get-areas',{
            cityName
        })
        .then((data) =>{
            data.forEach (element => areasList.insertAdjacentHTML('beforeend','<option value="'+element.Name+'">'+element.Name+'</option>'))
        })        
    },
    areaSearch(){
        var selectedArea = document.querySelector("#areas").value
        localStorage.setItem("SelectedArea",selectedArea);        
        window.open(location.href +'&area='+selectedArea,"_self");        
    }, 
    getRestaurants(){       
        var url = decodeURIComponent(location.search);       
        var start = url.indexOf("area")+5;
        if(url.indexOf("area")!= -1){           
            var selectedArea = url.substring(start,url.length);                       
            helper.request('POST','get-restaurants',{selectedArea})
            .then((data) =>{ 
                if(data.length === 0){
                    console.log("bulunamadı");
                } else {           
                    data.forEach(element => element.DisplayName)
                }
            })   
        }         
    },
};