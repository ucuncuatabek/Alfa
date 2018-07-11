import helper from './helper'
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
       this.getRestaurantData();
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
    getRestaurantData(){
        // console.log(location.search)
        // var seourl = location.search.substring(location.search.indexOf("/"),location.search.length);
        // console.log(seourl);
        var counter = 1;
        var menuList = document.querySelector(".restaurant-menu");
        helper.request('POST','get-menu',{})
        .then((data) => {
            
            data.forEach((category) =>{
                var productList = "";                
                category.Products.forEach((product)=> {
                    productList += '<li>'
                                        +'<div class = "table-row">'
                                            +'<input  data-product-id="'+product.ProductId+'" type="text" class="item-count" value ="1">'
                                            +'<button data-product-id="'+product.ProductId+'" class="ys-btn ys-button-success ys-btn-icon-add-to-basket"><i class="fas fa-plus"></i></button>'
                                            +'<div class="productName">'
                                                +'<a data-product-id="'+product.ProductId+'">'+product.DisplayName+'</a>'
                                            +'</div>'
                                            +'<span class="productListPrice">'+product.ListPrice+'</span>'
                                        +'</div>'
                                            +'<span class="productInfo">'
                                                +'<p>'+product.Description+'</p>'                                                
                                            +'</span>'  
                                    +'</li>';
                })
                var  menuItem = '<div class= "restaurantDetailBox" id="menu_'+counter+'">'
                                    +'<div class="head white">'
                                        +'<h2>'+category.CategoryDisplayName+'</h2>'
                                    +'</div>'
                                    +'<div class="listBody">'
                                        +'<ul>'
                                            +productList
                                        +'</ul>'
                                    +'</div>'
                                +'</div>';
                menuList.insertAdjacentHTML('beforeend',menuItem);
                counter++;
            })
        })
    } 
}