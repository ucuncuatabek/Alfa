import helper from './helper'
import index from './index'
import restaurant from './restaurant'
export default {
    init(){               
        var controller = document.querySelector('[data-controller="home"]');       
        if(!controller) return false;        
        this.attachEvents();        
    },
    attachEvents(){        
        var areaSearch      = document.querySelector("#area-search-button");
        areaSearch.onclick  = this.areaSearch.bind(this);
        var that    = this;
        var element = document.querySelector(".search-bar");
        var logo    = document.querySelector("#ys-logo");
        var logo2   = document.querySelector("#ys-logo-2");
        restaurant.locationHandler();
        window.onscroll = function(){            
            if(that.getOffset(element).top == 0 ){
                console.log("asdasd");
                logo.classList.add("slideUp");
                logo.classList.remove("slideDown");
                logo2.classList.remove("slideUp");
                
            } else {
                logo.classList.remove("slideUp");
                logo.classList.add("slideDown");
                logo2.classList.add("slideUp");
            }
        } 
        this.getAreas();
        this.getRestaurants();       
    },      
    getAreas(){  
        var cityName    = this.urlParser().city;        
        var areasList   = document.querySelector("#areas");

        localStorage.setItem("city", cityName);       

        helper.request('POST','get-areas',{
            cityName
        })
        .then((data) =>{
            data.forEach (element => {
                if (this.urlParser().area && element.Name == this.urlParser().area ) {
                    areasList.insertAdjacentHTML('beforeend','<option selected = true value="'+element.Name+'">'+element.Name+'</option>')
                } else {
                    areasList.insertAdjacentHTML('beforeend','<option value="'+element.Name+'">'+element.Name+'</option>')
                }                              
            })
        })      
    },
    areaSearch(){
        var selectedArea    = document.querySelector("#areas").value;
        localStorage.setItem("area",selectedArea);      
        var cityName        = this.urlParser().city;            
        window.open('http://localhost:3001/home.html?city='+cityName+'&area='+selectedArea,"_self");   
             
    },   
    getRestaurants(){
        var highlight = document.querySelector(".highlight");
        highlight.innerHTML += '<img class ="highlight-image" src="//cdn.yemeksepeti.com/App_Themes/SiteHeaders/Yemeksonuc.jpg" >'   
        var selectedArea    =  localStorage.getItem("area");
        var title = document.querySelector("#highlightTitle");
        if(selectedArea){             
            title.innerHTML += `<h1 class="ys-h2">${selectedArea} Bölgesine Gönderim Yapan Restoranlar</h1>`
        } else {
            title.innerHTML += `<h1 class="ys-h2">Tüm Semtler İçin Sonuçlar</h1>`
        }   
        var Area        = this.urlParser().area;
        var City        = this.urlParser().city
        var resListArea = document.querySelector(".res-list-items");
        var resCount    = 0;

        if (Area) {      
            helper.request('POST','get-restaurants',{area:Area})
            .then((data) =>{  
                            
                if(data.length === 0){
                    document.querySelector(".res-count").insertAdjacentHTML('beforeend','<b>Seçmiş olduğunuz kriterlere uygun restoran bulunamadı.</b>')
                    console.log("bulunamadı");
                } else {      
                    document.querySelector(".res-count").insertAdjacentHTML('beforeend','<b>Seçmiş olduğunuz kriterlere uygun <span>'+data.length+'</span> restoran listelenmiştir.</b>')
                    data.forEach(element => {                                             
                        if(element.DisplayName){ 
                            //var SeoUrl = element.SeoUrl.replace(/\//g,"");
                            element.AllPromotionImageListFullPath.forEach(el => { status += '<img src='+el+'>'})
                            var restaurant =
                            '<div class ="res-item">'
                                +'<div class="head">'
                                    +'<span class="point point9 ys-invert"> '+element.AvgRestaurantScore+' </span>'
                                    +'<a class="restaurantName" href=http://localhost:3001/restaurant.html?restaurant='+element.SeoUrl+'>  '+element.DisplayName+'</a>'
                                    +'<div class="statusImg" >'+status+'</div>'
                                    +'<span class="minimumDeliveryPrice"> min. '+element.MinimumDeliveryPrice+' TL </span>'
                                +'</div>'
                            +'</div>';
                            resListArea.insertAdjacentHTML('beforeend',restaurant); 
                            status ='';                             
                        }              
                    });
                }
            });
        }  else {    
                helper.request('POST','get-restaurants',{city:City})
                .then((data) => {
                    console.log(data)  
                    document.querySelector(".res-count").insertAdjacentHTML('beforeend','<p><b>Seçmiş olduğunuz kriterlere uygun <span>'+data.length+'</span> restoran listelenmiştir.</b></p>')
                    data.forEach(element => {
                    if(element.DisplayName){ 
                        element.AllPromotionImageListFullPath.forEach(el => { status += '<img class = "statusImg" src='+el+'>'})
                        var restaurant =
                        '<div class ="res-item">'
                            +'<div class="head">'
                                +'<span class="point point9 ys-invert"> '+element.AvgRestaurantScore+' </span>'
                                +'<a class="restaurantName" href=http://localhost:3001/restaurant.html?restaurant='+element.SeoUrl+'>  ' +element.DisplayName+ ' </a>'
                                +'<div class="status">'+status+'</div>'
                                +'<span class="minimumDeliveryPrice"> min. '+element.MinimumDeliveryPrice+' TL </span>'
                            +'</div>'
                        +'</div>';
                        resListArea.insertAdjacentHTML('beforeend',restaurant); 
                        status ='';                             
                    }              
                })
            })
        }           
    },
    urlParser(){
        var url = decodeURIComponent(location.search)
        var start = url.indexOf("city")+5; 

        if (url.indexOf("&") != -1) {
            var end = url.indexOf("&") ;
            var areaStart = url.indexOf("area")+5;
            var selectedArea = url.substring(areaStart,url.length);   
            var cityName = url.substring(start,end);
            return {city:cityName,area:selectedArea}
        } else {
            var cityName = url.substring(start,url.length);
            return {city:cityName}
        }
    },
    getOffset(el) {
        el = el.getBoundingClientRect();
        return {
          left: el.left,
          top: el.top 
        }
    }

};