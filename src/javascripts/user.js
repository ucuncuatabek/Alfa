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
               
                console.log(Object.keys(data.addresses).length)
               if(selected == "addresses" && Object.keys(data.addresses).length === 0){
                    document.querySelector(".notAvailable").style.display = "block";
                    document.querySelector(".add-new-address").onclick = this.addAddress;
               } else {
                    var addressTab = document.querySelector(".address-exists");
                    var addressHTML = ``;
                    var logos = {"Ev":"home","İş":"building","Kampüs":"graduation-cap"}
                    addressTab.style.display ="block";
                    data.addresses.forEach((address) => {
                       console.log(address);
                       var type = logos[address.AddressType];
                       addressHTML += `
                       <div class="address-item">
                            <div class ="address-header">
                                <i class="fas fa-${type}"></i>
                                <b class="Address" >${address.AddressType}</b>
                                <button class="delete-address" id = "${address.ID}" "type="button"> <i class=" far fa-trash-alt "></i> </button>
                            </div>
                            <div class ="address-detail">
                                <div class="top">
                                <b class="name" > ${address.Name} ${address.Surname}</b>
                                </div>
                                <div class="bottom">
                                    <div class="Left">
                                        <p class="address" > ${address.address}</p>
                                        <p class="address-info"> ${address.addressInfo}</p>
                                    </div>
                                    <div class ="Right" >
                                        ${address.cell}
                                    </div>
                                </div>
                            </div>
                        </div>
                       `
                    });
                   
                    addressTab.innerHTML += addressHTML;
                    
                    document.querySelector(".add-address").onclick = this.addAddress;
                    var deleteButton = document.querySelectorAll(".delete-address");
                    deleteButton.forEach((button) =>{ button. onclick = this.deleteAddress.bind(button)});
               }
        })
    },
    addAddress(){
        modal.addAddress();
    },
    saveAddress(){
        var address = {};
        if(this.validateAddress()){
            var form            = document.querySelector("#address-details");
            var elements        = form.querySelectorAll(".ys-input-xs"); 
            elements.forEach((el) =>{
                address[el.dataset["title"]] = el.value;               
            });
            console.log(address)      
            var token = localStorage.getItem("guestId")
            helper.request('POST','add-address',{address,token}).then((data) =>{ 
                if(data.message === "ok"){
                   this.hideModal();
                }
            })     
        } 
    },
    validateAddress(){
        var form            = document.querySelector("#address-details");
        var elements        = form.querySelectorAll(".ys-input-xs");           
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
    
        if(empty == 0){
            return true;
        }  else {
            return false;
        } 
    },
    radioButtonHandle(){
        var selectedRadio = this.getAttribute("type-name");
        document.querySelector("#AddressName").value = selectedRadio;
    },
    hideModal() {
        var modal = document.getElementById('myModal');
        modal.style.display = "none";
    },
    deleteAddress(){
        alert()
        var token = localStorage.getItem("guestId");
        var addressID = this.getAttribute("id");
        helper.request('POST',`delete-address`,{token:token,addressID:addressID});
    }

   



}