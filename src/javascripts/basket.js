import helper from './helper'
import restaurant from './restaurant'
import modal from './modal'

export default {
    timer:null,
    init(){       
        this.insertItems();
        var trash           = document.querySelector(".emptyBasket");
        trash.onmouseover   = this.emptyBasketPopupOn;
        trash.onmouseout    = this.emptyBasketPopupOff;
        trash.onclick       = this.clearBasket.bind(this);
        var checkOut        = document.querySelector(".sepeti-onayla");        
        checkOut.onclick    = this.checkOut.bind(this);       
    },
    addBasket(button){           

        var trash   = document.querySelector(".emptyBasket");
        trash.style = "display:block";

        var productId       = button.dataset.productId;
        var productName     = button.dataset.name;
        var productCount    = parseInt(document.querySelector("input[id='"+productId+"']").value);
        
        
        var userId = localStorage.getItem("guestId");   
      
        var productPrice    = parseFloat(button.dataset.price.replace(",","."))

        var newItem = {
                        [productId]: {
                            "name"          :productName,
                            "price"         :productPrice*productCount,
                            "originalPrice" :productPrice,
                            "count"         :productCount
                        }
                    };      
              
        if (localStorage.getItem("basket")) {
            var basket = JSON.parse(localStorage.getItem("basket"));
        }       
       
        var exists = 0;
       
        
        var url             = location.search;
        var seoUrl          = url.substring(url.indexOf("/"),url.length); 
        console.log(localStorage.getItem("currentRestaurant"),"hoop")
        if(localStorage.getItem("currentRestaurant") == ""){
            localStorage.setItem("currentRestaurant",seoUrl);           
            restaurant.locationHandler();
            if (basket) {
                var keys = Object.keys(basket);               
                keys.forEach((id) => {               
                    if (id === productId) { 
                        //console.log(productCount,productPrice, parseFloat(basket[id]["price"]))
                        exists = 1;   
                        
                        if(productCount + parseFloat(basket[id]["count"]) >= 1000 ){
                            basket[id]["count"] = 1;
                            basket[id]["price"] = productPrice;
                        } else {
                            basket[id]["price"] = productCount*productPrice + parseFloat(basket[id]["price"]);
                            basket[id]["count"] = productCount + parseFloat(basket[id]["count"])
                        }
                       
                    } 
                });     
                if (exists == 0) {                
                    basket[productId] = {
                        "name"          :productName,
                        "price"         :productPrice*productCount,
                        "count"         :productCount,
                        "originalPrice" :productPrice
                    }                
                }    
                localStorage.setItem("basket",JSON.stringify(basket));   
                helper.request('POST','add-delete-basket',{basket,userId,task:"add"}).then(this.insertItems()); 
                        
            } else {
                localStorage.setItem("basket",JSON.stringify(newItem)); 
                var basket = newItem               
                helper.request('POST','add-delete-basket',{basket,userId,task:"add"}).then(this.insertItems());                  
            }
            
        } else {
            console.log(seoUrl,localStorage.getItem("currentRestaurant"))
            if(seoUrl != localStorage.getItem("currentRestaurant")){
                modal.showModal("Sepetinizde başka restorant'a ait ürünler mevcut","error");
            } else {
                if (basket) {
                    var keys = Object.keys(basket);
                   
                    keys.forEach((id) => {               
                        if (id === productId) { 
                            console.log(productCount,productPrice, parseFloat(basket[id]["price"]))
                            exists = 1;   
                            if(productCount + parseFloat(basket[id]["count"]) >= 1000 ){
                                basket[id]["count"] = 1;
                                basket[id]["price"] = productPrice;
                            } else {
                                basket[id]["price"] = productCount*productPrice + parseFloat(basket[id]["price"]);
                                basket[id]["count"] = productCount + parseFloat(basket[id]["count"])
                            }
                        } 
                    });     
                    if (exists == 0) {                
                        basket[productId] = {
                            "name"          :productName,
                            "price"         :productPrice*productCount,
                            "count"         :productCount,
                            "originalPrice" :productPrice
                        }                
                    }    
                    localStorage.setItem("basket",JSON.stringify(basket)); 

                    helper.request('POST','add-delete-basket',{basket,userId, task:"add"}).then(this.insertItems());                       
                } else {
                    localStorage.setItem("basket",JSON.stringify(newItem));
                    var basket = newItem
                    helper.request('POST','add-delete-basket',{basket,userId,task:"add"}).then(this.insertItems());                     
                }
                this.insertItems();
            }
        }       
       
        
    },
    clearBasket() {        
        localStorage.setItem("basket","");
        if  (localStorage.getItem("guestId")){
            var userId = localStorage.getItem("guestId")
            helper.request('POST','add-delete-basket',{userId, task:"clear"});
        }                
        this.insertItems();
        localStorage.setItem("currentRestaurant","");
        restaurant.locationHandler();
        var trash   = document.querySelector(".emptyBasket");
        trash.style ="display:none";
    },
    deleteItem(button) {
        var basket = JSON.parse(localStorage.getItem("basket"));
        
        delete basket[button.dataset.productId];
        localStorage.setItem("basket",JSON.stringify(basket));  
        var keys = Object.keys(basket);

        if (keys.length == 0) {                                 
            this.clearBasket();
        } else {
            this.insertItems();
        }
    },
    changeCountBasket(input) {  
        var that = this;      
        window.onmousedown = function(){
            if (input.value == 0 || input.value == "" || input.value > 99 || isNaN(input.value)) {
                        input.value = 1;
            } else {                
                var basket = JSON.parse(localStorage.getItem("basket"));
                var productId = input.dataset.productId;                
                basket[productId]["count"] = parseInt(input.value); 
                basket[productId]["price"] = input.value*parseInt(basket[productId]["originalPrice"])     
                localStorage.setItem("basket",JSON.stringify(basket));
                that.insertItems(); 
            }    
        }       
    },
    changeCountMenu(input) {
        window.onmousedown = function(){
            if (input.value == 0 || input.value == "" || input.value > 99 || isNaN(input.value)) {
                        input.value = 1;
            }
        }
    },
    insertItems(){
        var basketItemList  = document.querySelector(".items");
        var itemExists      = document.querySelectorAll(".exists");
        var emptyList       = document.querySelector(".no-item");

        if (localStorage.getItem("basket")) {

            var basket      = JSON.parse(localStorage.getItem("basket"));
            var keys        = Object.keys(basket);
            var total       = document.querySelector(".totalPrice");
            var totalPrice  = 0;
            var tbodyItem   = "";
            
            keys.forEach((id) => {               
                tbodyItem += `<tr>
                                <td class="item-name">
                                        <a>${basket[id]["name"]}</a>
                                        <span></span>
                                    </td>
                                <td class = "">                              
                                    <input type="number"  data-product-id = "${id}" name="txtCount" class="txtCount ys-input-mini" title="Ürün Adedi" value="${basket[id]["count"]}">                                
                                </td>                           
                                <td class="item-price">
                                    ${basket[id]["price"]} TL
                                </td>
                                <td class ="item-actions">
                                    <button class="rmv-basket ys-pullRight" data-product-id = "${id}" ><i  class="fas fa-times"></i></button>
                                </td>
                            </tr>`;      
                totalPrice += parseFloat(basket[id]["price"]);        
            });     

            total.innerHTML             = totalPrice + " TL";
            basketItemList.innerHTML    = tbodyItem;  

            itemExists.forEach( (el) => {el.style  = "display:block"});  

            emptyList.style =   "display:none";            
            var trash       =   document.querySelector(".emptyBasket");
            trash.style     =   "display:block";

            var minDeliveryPrice = localStorage.getItem("minDelivery");

            if (totalPrice<minDeliveryPrice) {
                var shouldAdd = minDeliveryPrice-totalPrice;                
                document.querySelector(".sepeti-onayla").setAttribute("disabled","disabled");
                var message = `<span class="basketMessage">Minimum paket tutarının altındasınız. Siparişinizi tamamlamak için sepetinize <b>${shouldAdd} TL</b> değerinde daha ürün eklemeniz gerekmektedir.
                                </span>`
                document.querySelector(".message").innerHTML=message;

            } else {
                if (document.querySelector(".basketMessage")) {
                    document.querySelector(".basketMessage").remove();
                    document.querySelector(".sepeti-onayla").removeAttribute("disabled");
                }
            }
        } else {
            basketItemList.innerHTML = "";
            itemExists.forEach((el) => {el.style  = "display:none"});     
            emptyList.style ="display:block" ;
        }

        var deleteButtons = document.querySelectorAll(".rmv-basket");   
        deleteButtons.forEach(element => element.onclick = this.deleteItem.bind(this,element));

        var BasketProductCounts = document.querySelectorAll(".txtCount");                
        BasketProductCounts.forEach(element => element.onkeyup = this.changeCountBasket.bind(this,element));     
    },
    emptyBasketPopupOn(){
        var popup = document.getElementById("emptyBasket");
        popup.classList.add("show");
    },
    emptyBasketPopupOff(){
        var popup = document.getElementById("emptyBasket");        
        popup.classList.remove("show");
    },
    checkOut(){
        
        if (localStorage.getItem("userlogged") == 0) {
            document.querySelector(".form-block").classList.add("glow")
        } else {
            
            modal.checkout();
            this.insertItems()
            var modalInputs =  document.querySelectorAll(".modal-item-count");
            modalInputs.forEach((element) => {               
            element.onkeyup = this.changeCountBasket.bind(this,element)
           
            });
        } 
    },
    checkBasketValidity(cb) {
        var userId = localStorage.getItem("guestId")
        var basket = JSON.parse(localStorage.getItem("basket"));              
        helper.request('POST','check-basket-validity',{userId,basket})
        .then((data) => {           
            if ( data.message == "valid"){
                cb(true);
            } else {
                //console.log(basket)
                console.log(data)
                var keys = Object.keys(data);               
                keys.forEach((id) => { 
                    basket[id]["price"] = data[id]
                    console.log(id)
                });    
                console.log(basket)
                localStorage.setItem("basket",JSON.stringify(basket));
                location.reload();
            }
        });      
    },
   
}