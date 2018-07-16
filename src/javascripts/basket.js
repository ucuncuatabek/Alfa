export default {
    init(){
       
    },addBasket(button){
        var basketItemList = document.querySelector("itemList");
        var productId = button.dataset.productId;
        var productCount = document.querySelector("input[data-product-id='"+productId+"']").value;   

        var items = [];
        items.push(JSON.parse(localStorage.getItem("basket")));
        items.push({itemId:productId,itemCount:productCount});
        localStorage.setItem("basket",JSON.stringify(items));
        console.log(localStorage.getItem("basket"));  
       
    }
}