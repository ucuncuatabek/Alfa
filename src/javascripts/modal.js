import Basket from './basket'
export default{
    init(){
        this.attachEvents();
    },   
    showModal(text,type){
        var modal = document.getElementById('myModal');        
        var header = document.querySelector(".modal-header");
        var footer = document.querySelector(".modal-footer");
        var span = document.getElementsByClassName("close")[0];
        var content = document.querySelector(".modal-body");

        if(type == "error") {   
            header.classList.add("error");
        } else {
            header.classList.add("noError");
        }
      
            content.innerHTML = `<b class = "modal-error"> ${text}</b>`;        
        modal.style.display = "block";      
             
        span.onclick = function() {
            modal.style.display = "none";
        }
        
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        } 
    },
    checkout(){
        var modal = document.getElementById('myModal');        
        var header = document.querySelector(".modal-header");
        header.classList.add("noError");
        var footer = document.querySelector(".modal-footer");
        var span = document.getElementsByClassName("close")[0];
        var content = document.querySelector(".modal-body");          
        var basketInfo = `<table class="ys-table">
                                <thead>
                                    <tr>
                                        <th class="tdOrderName">YEMEK</th>
                                        <th class="tdOrderPrice">FİYAT</th>
                                        <th class = "tdOrderCount>ADET</th>
                                        <th class = "tdOrderTotal">TUTAR</th>
                                    </tr>
                                </thead>
                                <tbody class = "items"> 
                                </tbody>
                            </table>`;

        // {name: "Seçilmiş Menü (Kebap) ", price: 23, originalPrice: 23, count: 1}
        // {name: "Kahvaltı Tabağı", price: 10, count: 1, originalPrice: 10}

        if (localStorage.getItem("basket")) {
            var basket = JSON.parse(localStorage.getItem("basket"));
            console.log(basket)
            var keys = Object.keys(basket);
            var total = 0;
            var elements = "";
            keys.forEach((id) => {               
                elements += `<tr>
                                <td class="tdOrderName item-name">
                                    <strong>${basket[id].name}</strong>
                                </td>
                                <td class = "tdOrderPrice">
                                    ${basket[id].originalPrice} TL
                                </td>
                                <td class = "tdOrderCount item-count">
                                    <input data-product-id ="${id}" class = "modal-item-count" value = ${basket[id].count}>                                   
                                </td>
                                <td class = "tdOrderTotal">
                                    ${basket[id].price} TL
                                </td>
                            </tr>`
                total += parseFloat(basket[id].price); 
            });     
        }       
        var basketInfo = `<table class="ys-table">
                                <thead>
                                    <tr>
                                        <th class="tdOrderName">YEMEK</th>
                                        <th class="tdOrderPrice">FİYAT</th>
                                        <th class = "tdOrderCount">ADET</th>
                                        <th class = "tdOrderTotal">TUTAR</th>
                                    </tr>
                                </thead>
                                <tbody class = "items"> 
                                ${elements}
                                </tbody>
                                <tfoot>
                                    <tr class ="Summary">
                                        <td class ="tdCoupons"></td>
                                        <td></td>
                                        <td class ="tdTotalText colspan ="2">   
                                            <div class="totalText">
                                                Toplam:
                                            </div>
                                        </td>
                                        <td class = "tdTotalValues">
                                            <div class="totalValue totalPrice"> 
                                                ${total} TL
                                            </div>
                                        <td>

                                    </tr>
                                </tfoot>                                
                            </table>
                            <button type="button" class = "Sepeti-Onayla-Modal" > Sepeti Onayla</button>
                            `;        
        
        content.innerHTML = basketInfo;
        document.querySelector(".Sepeti-Onayla-Modal").onclick = function() {            
            Basket.checkBasketValidity(function(valid){               
                if(valid && parseFloat(total) >= parseFloat(localStorage.getItem("minDelivery"))  ){
                    var highlight = document.querySelector(".highlight");
                    highlight.innerHTML =   `<i class="fas fa-check-circle"></i>
                                            <h1 class="thanks"> Siparişiniz bize ulaşmıştır!</h1>
                                            <h2 class="thanks"> Teşekkür ederiz.</h2>`;
                    highlight.classList.add("thanks")
                    modal.style.display = "none"; 
                    Basket.clearBasket();    
                } 
            });   
        }
       
        modal.style.display = "block";      
             
        span.onclick = function() {
            modal.style.display = "none";
        }
        
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        } 
       
    }, 
    hideModal (){       
        modal.style.display = "none";
    }

}