import helper from './helper'
import modal from './modal'
export default {
    init(){
        var controller = document.querySelector('[data-controller="userSettings"]');       
        if(!controller) return false;        
        this.attachEvents();    
    },
    attachEvents() {
        
        this.setSelected();
    },
    getSelected(){
        var url = decodeURIComponent(location.search);
        var start = url.indexOf("?")+1;
        var selected = url.substring(start,url.length);
        return {selected};
    },
    setSelected(){
        var selected = this.getSelected().selected;
        console.log(selected)
        document.querySelector(`.${selected}`).setAttribute("checked","checked");
        this.populateSelected(selected);
    },
    populateSelected(selected){
        var token = localStorage.getItem("guestId");   
        
        helper.request('POST',`get-${selected}`,{token:token})
        .then((data) =>{
               if(selected == "addresses" && Object.keys(data).length === 0){
                    document.querySelector(".notAvailable").style = "display:block";
                    document.querySelector(".add-new-address").onclick = this.addAddress;
               } else {
                   console.log(data)
               }
        })
    },
    addAddress(){
        modal.addAddress();
       
    },
    validateAddress(){
        var form            = document.querySelector("#address-details");
        var elements       = form.getElementsByTagName("input");   
        var i;
        var empty           = 0;
        for (i = 0; i < elements.length; i++) {
            var el = elements[i];            
            if (el.getAttribute("required") != null) {

                var fieldValue  = el.value;
                var formGroup   = el.closest(".form-group");
                var hasError    = formGroup.querySelector(".empty-error");

                if (fieldValue == "") { 
                    empty = 1;                               
                    el.classList.add("error");       
                    el.setAttribute("data-error","true");
                    if(hasError === null){                               
                        var errorInfo = '<small class = "small-error empty-error" > Lütfen Bir ' + el.getAttribute("data-title") + ' giriniz.</small>';
                        formGroup.insertAdjacentHTML('beforeend',errorInfo ); 
                    }
                }
            }
        }          
    }


}