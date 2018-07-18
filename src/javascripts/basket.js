export default {
    init(){
       
        this.insertItems()
       //this.clearBasket();       
    },
    addBasket(button){      
        var productId       = button.dataset.productId;
        var productName     = button.dataset.name;
        var productCount    = parseInt(document.querySelector("input[data-product-id='"+productId+"']").value); 
        var productPrice    = parseFloat(button.dataset.price.replace(",","."))

        var newItem = {
                            [productId]: {
                                "name":productName,
                                "price":productPrice,
                                "count":productCount
                            }
                        };      
              
        if(localStorage.getItem("basket")){
            var basket = JSON.parse(localStorage.getItem("basket"));
        }
       
        var exists = 0;
        if(basket){
            var keys = Object.keys(basket);
            keys.forEach((id) => {               
                if(id === productId) { 
                    exists = 1;   
                    basket[id]["price"] = productCount*productPrice + parseFloat(basket[id]["price"]);
                    basket[id]["count"] = productCount + parseFloat(basket[id]["count"])
                } 
            });     
            if(exists == 0) {                
                basket[productId] = {
                    "name":productName,
                    "price":productPrice,
                    "count":productCount
                }                
            }    
            localStorage.setItem("basket",JSON.stringify(basket));             
        } else {
            localStorage.setItem("basket",JSON.stringify(newItem));
        }
        console.log(JSON.parse(localStorage.getItem("basket")));
        this.insertItems();      
    },
    clearBasket(){
        localStorage.setItem("basket","");
    },
    deleteItem(button){
        var basket          =  JSON.parse(localStorage.getItem("basket"));          
        delete basket[button.id];
        localStorage.setItem("basket",JSON.stringify(basket));
        this.insertItems();
    },
    insertItems(){
        var basketItemList  = document.querySelector(".items");
        var basket          =  JSON.parse(localStorage.getItem("basket"));
        var keys            = Object.keys(basket);
        var total = document.querySelector(".totalPrice");
        var totalPrice = 0;
        var tbodyItem =""
        keys.forEach((id) => {               
            tbodyItem += `<tr>
           
                            <td class="item-name">
                                    <a>${basket[id]["name"]}</a>
                                    <span></span>
                                </td>
                            <td class = "item-count">                              
                                <input type="text" name="txtCount" class="txtCount ys-input-mini" title="Ürün Adedi" value="${basket[id]["count"]}">                                
                            </td>
                           
                            <td class="item-price">
                                 ${basket[id]["price"]} TL
                            </td>
                            <td class ="item-actions">
                                <button class="rmv-basket ys-pullRight" id = "${id}" ><i  class="fas fa-times"></i></button>
                            </td>
                           
                        </tr>`;      
            totalPrice += parseFloat(basket[id]["price"]);        
        });     
        console.log(totalPrice);
        total.innerHTML = totalPrice + " TL";
        basketItemList.innerHTML = tbodyItem;
        var deleteButtons = document.querySelectorAll(".rmv-basket");   
        deleteButtons.forEach(element => element.onclick = this.deleteItem.bind(this,element));
        // 
        // var items = [];
        // items.push(JSON.parse(localStorage.getItem("basket")));
        // items.push({itemId:productId,itemCount:productCount});
        // localStorage.setItem("basket",JSON.stringify(items));
        // console.log(localStorage.getItem("basket"));  
       
       
    }

}