import helper from './helper'
import addToBasket from './basket'
export default {
    init(){ 
                    
        var controller = document.querySelector('[data-controller="restaurant"]');       
        if(!controller) return false;        
        this.attachEvents(); 
    },
    attachEvents(){        
        this.getAreas();
        var areaSearch = document.querySelector("#area-search-button");
        areaSearch.onclick = this.areaSearch.bind(this);
            
        var basketLocation = document.querySelector(".location");
        basketLocation.insertAdjacentHTML('beforeend','<span>'+localStorage.getItem("area")+'</span>')
        this.getRestaurantMenu();
        this.getRestaurantInfo(); 

        var that = this;
        var element = document.querySelector(".search-bar");
        var logo = document.querySelector("#ys-logo");
        var logo2 = document.querySelector("#ys-logo-2");
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
        
    }, 
    getAreas(){ 
       
        var cityName = localStorage.getItem("city");
        var selectedArea = localStorage.getItem("area");
        var areasList = document.querySelector("#areas");
        helper.request('POST','get-areas',{
            cityName
        })
        .then((data) =>{
            data.forEach (element => {                
                if(element.Name == selectedArea ){
                    areasList.insertAdjacentHTML('beforeend','<option selected = true value="'+element.Name+'">'+element.Name+'</option>')
                } else {
                    areasList.insertAdjacentHTML('beforeend','<option value="'+element.Name+'">'+element.Name+'</option>')
                }                              
            })
        })      
    },
    areaSearch(){
        var selectedArea = document.querySelector("#areas").value;
        localStorage.setItem("area",selectedArea)
        var cityName = localStorage.getItem("city");           
        window.open('http://localhost:3001/home.html?city='+cityName+'&area='+selectedArea,"_self");   
            
    },  
    getRestaurantMenu(){
        var counter = 1;
        var menuList = document.querySelector(".restaurant-menu");    
        helper.request('POST','get-menu',{})
        .then((data) => {                       
            data.forEach((category) =>{
                var productList = "";                
                category.Products.forEach((product)=> {                                
                    productList += `<li>
                                        <div class = "table-row">
                                            <input  data-product-id="${product.ProductId}" type="text" class="item-count" value ="1">
                                            <button data-product-id="${product.ProductId}"  class="ys-btn ys-button-success ys-btn-icon-add-to-basket btn-addtobasket"><i class="fas fa-plus ys-icon-plus"></i></button>
                                            <div class="productName">
                                                <a data-product-id="${product.ProductId}">${product.DisplayName}</a>
                                            </div>                                            
                                        </div>                                        
                                        <span class="productInfo">
                                            <p>${product.Description}</p>                                                
                                        </span>  
                                        <span class="productListPrice">${product.ListPrice} TL </span>
                                    </li>`;
                })
                var  menuItem = `<div class= "restaurantDetailBox" id="menu_${counter}">
                                    <div class="head white">
                                        <h2><b>${category.CategoryDisplayName}</b></h2>
                                    </div>
                                    <div class="listBody">
                                        <ul>
                                            ${productList}
                                        </ul>
                                    </div>
                                </div>`;
                menuList.insertAdjacentHTML('beforeend',menuItem);
                
                counter++;
            });
            
            var basketButtons = document.querySelectorAll(".btn-addtobasket")
            basketButtons.forEach(element => element.onclick = addToBasket.addBasket.bind(this, element));
            
        });
        
    },
    getRestaurantInfo(){
        
        var url = location.search
        var seoUrl =url.substring(url.indexOf('/'),url.length);
        var Points = document.querySelector(".resPoints")
        var Infos = document.querySelector(".shortInfo")
        var logo = document.querySelector(".resLogo")
        helper.request('POST','get-restaurant-info',{SeoUrl:seoUrl})
        .then((data)=> {
            
            var resPoints =  `<b class="grayText">Restoran Puanları</b>
                                <div class="points">
                                    <div class = "point ys-invert">
                                        <span>Hız</span>
                                        <span class = "spanPoint">${data[0].DetailedSpeed}</span>
                                    </div>
                                    <div class= "point ys-invert">
                                        <span>Servis</span>
                                        <span class="spanPoint">${data[0].DetailedServing}</span>
                                    </div>
                                    <div class ="point ys-invert">
                                        <span >Lezzet</span>
                                        <span class="spanPoint">${data[0].DetailedFlavour}</span>
                                    </div>
                                </div>`;
                
                var resInfos =     `<div class="shortInfos">
                                        <div class = "shortInfoItem">
                                            <div class ="iconHolder"><i class="fas fa-coins"></i></div>
                                            <div class = "shortInfoTitle">Minimum Paket Tutarı</div>
                                            <div class = "description"><b class="descriptionB">${data[0].MinimumDeliveryPriceText} TL</b></div>
                                        </div> 
                                        <div class ="shortInfoItem">
                                            <div class ="iconHolder"><i class="far fa-clock"></i></div>
                                            <div class = "shortInfoTitle">Çalışma Saatleri(bugün)</div>
                                            <div class = "description"><b class="descriptionB">${data[0].WorkHoursText}</b></div>
                                        </div>
                                        <div class ="shortInfoItem">
                                            <div class ="iconHolder"><i class="fas fa-motorcycle"></i></div>
                                            <div class = "shortInfoTitle">Servis Süresi (ortalama)</div>
                                            <div class = "description"><b class="descriptionB">${data[0].DeliveryTime} dk.</b></div>
                                        </div>
                                    </div>`;    
                var resLogo = `<img src ="${ data[0].ImageFullPath}">`;                           
            
        Points.insertAdjacentHTML('beforeend',resPoints)
        Infos.insertAdjacentHTML('beforeend',resInfos)
        logo.insertAdjacentHTML('beforeend',resLogo)
        
       })
       
    },
    getOffset(el) {
        el = el.getBoundingClientRect();
        return {
          left: el.left,
          top: el.top 
        }
      }
   

    
    
}