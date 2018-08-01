import Basket from './basket'
import User from './user'
export default {
    init() {
        this.attachEvents();
    },
    showModal(text, type) {
        var modal = document.getElementById('myModal');
        var header = document.querySelector(".modal-header");
        var footer = document.querySelector(".modal-footer");
        var span = document.getElementsByClassName("close")[0];
        var content = document.querySelector(".modal-body");

        if (type == "error") {
            header.classList.add("error");
        } else {
            header.classList.add("noError");
        }

        content.innerHTML = `<b class = "modal-error"> ${text}</b>`;
        modal.style.display = "block";

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    },
    checkout() {
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
        document.querySelector(".Sepeti-Onayla-Modal").onclick = function () {
            Basket.checkBasketValidity(function (valid) {
                if (valid && parseFloat(total) >= parseFloat(localStorage.getItem("minDelivery"))) {
                    var highlight = document.querySelector(".highlight");
                    highlight.innerHTML = `<i class="fas fa-check-circle"></i>
                                            <h1 class="thanks"> Siparişiniz bize ulaşmıştır!</h1>
                                            <h2 class="thanks"> Teşekkür ederiz.</h2>`;
                    highlight.classList.add("thanks")
                    modal.style.display = "none";
                    Basket.clearBasket();
                }
            });
        }

        modal.style.display = "block";

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

    },
    hideModal() {
        modal.style.display = "none";
    },
    addAddress(name, surname) {

        var content = document.querySelector(".modal-body");
        document.querySelector("#myModal").classList.add("addAddress");
        var html = `
        <form id="address-details" action="javascript:void(0);" novalidate="novalidate" class="bv-form">
        <button type="submit" class="bv-hidden-submit" style="display: none; width: 0px; height: 0px;"></button>
        <div class="formInputs">
            <div class="form-group has-success">
                <div class="row">
                    <label for="FirstName" class="col-md-5 control-label">
                        <span class="required-label">*</span> Ad
                    </label>
                    <div class="col-md-6">
                        <input value="" class="form-control ys-input-xs" name="FirstName" id="FirstName"  data-title= "Ad" data-bv-field="FirstName" required>                       
                    </div>
                </div>
            </div>
            <div class="form-group has-success">
                <div class="row">
                    <label for="LastName" class="col-md-5 control-label">
                        <span class="required-label">*</span> Soyad
                    </label>
                    <div class="col-md-6">
                        <input value="" class="form-control ys-input-xs" name="LastName" id="LastName"   data-title="Soyad" data-bv-field="LastName" required>
                        
                    </div>
                </div>
            </div>            
            <hr>
            <div class="form-group has-success">
                <div class="row">
                    <label for="AddressType" class="col-md-5 control-label">
                        <span class="required-label">*</span>
                        Adres Türü
                    </label>
                    <div class="address-type">                
                        <input type="radio" id="address_type_Ev" checked="true" type-name="Ev" value="0" name="AddressType" data-bv-field="AddressType">
                        <label for="address_type_Ev">Ev</label>
                        <input type="radio" id="address_type_İş" type-name="İş" value="1" name="AddressType" data-bv-field="AddressType">
                        <label for="address_type_İş">İş</label>
                        <input type="radio" id="address_type_Kampüs" type-name="Kampüs" value="2" name="AddressType" data-bv-field="AddressType">
                        <label for="address_type_Kampüs">Kampüs</label>
                        <input type="radio" id="address_type_Diğer" type-name="Diğer" value="3" name="AddressType" data-bv-field="AddressType">
                        <label for="address_type_Diğer">Diğer</label>                        
                    </div>
                </div>
            </div>
            <div class="form-group has-success">
                <div class="row">
                    <label for="name" class="col-md-5 control-label">
                        <span class="required-label">*</span> Adres Başlığı</label>
                    <div class="col-md-6">
                        <input class="form-control ys-input-xs address-name form-control" type="text" name="AddressName" id="AddressName" value="Ev"
                            data-bv-field="AddressName"  data-title="Adres Adı" required>
                        <small class="help-block" data-bv-validator="notEmpty" data-bv-for="AddressName" data-bv-result="VALID" style="display: none;">Adres adı giriniz.</small>
                    </div>
                </div>
            </div>
            <div class="form-group has-error">
                <div class="row">
                    <label for="TelephoneNumber" class="col-md-5 control-label">
                        <span class="required-label">*</span> Cep Telefonu
                    </label>
                    <div class="col-md-6">
                        <input value="" class="form-control ys-input-xs" name="TelephoneNumber" id="TelephoneNumber"  data-title="Telefon Numarası" data-bv-field="TelephoneNumber" required>                        
                    </div>
                </div>
            </div>
            <div class="form-group has-success">
                <div class="row">
                    <label for="TelephoneNumber2" class="col-md-5 control-label">
                        Tel No 2
                    </label>
                    <div class="col-md-6">
                        <input value="" class="form-control ys-input-xs" name="TelephoneNumber2" id="TelephoneNumber2" data-title="TelNo2" data-bv-field="TelephoneNumber2" >
                        
                    </div>
                </div>
            </div>
            <div class="form-group has-success">
                <div class="row">
                    <label for="name" class="col-md-5 control-label">
                        <span class="required-label">*</span>
                        <span class="address-type-label">
                            Semt
                        </span>
                    </label>
                    <div class="col-md-6 areasViewContainer">
                        <select class="form-control ys-input-xs" name="Areas" id="areas"  data-title="Semt" required>
                            <option></option>
                            <option value="asddsasd">dsfsdf
                            </option>
                        </select>                    
                       
                    </div>
                </div>
            </div>
            <div class="form-group has-error">
                <div class="row">
                    <label for="AddressLine1" class="col-md-5 control-label">
                        <span class="required-label">*</span> Adres
                    </label>
                    <div class="col-md-6">
                        <textarea class="form-control ys-input-xs" name="AddressLine1" id="AddressLine1" placeholder="Mahalle/Cadde/Sokak, Bina/Daire No."
                            data-bv-field="AddressLine1" data-title="Adres" required ></textarea>
                    
                        <small class="help-block" data-bv-validator="stringLength" data-bv-for="AddressLine1"
                            data-bv-result="VALID" style="display: none;">Adres 3 karakterden az olmamalı.</small>
                        <small class="help-block" data-bv-validator="callback" data-bv-for="AddressLine1"
                            data-bv-result="VALID" style="display: none;">Adres 255 karakterden çok olmamalı.</small>
                    </div>
                </div>
            </div>
            <div class="form-group has-error">
                <div class="row">
                    <label for="Description" class="col-md-5 control-label">
                        <span class="required-label">*</span> Adres Tarifi
                    </label>
                    <div class="col-md-6">
                        <textarea class="form-control ys-input-xs" name="Description" id="Description" data-bv-field="Description" data-title="Adres Tarifi" required></textarea>
                        
                        <small class="help-block" data-bv-validator="stringLength" data-bv-for="Description"
                            data-bv-result="VALID" style="display: none;">Adres tarifi 3 karakterden az olmamalı.</small>
                        <small class="help-block" data-bv-validator="callback"
                            data-bv-for="Description" data-bv-result="VALID" style="display: none;">Adres tarifi 255 karakterden çok olmamalı.</small>
                    </div>
                </div>
            </div>            
        </div>
        <footer>
            <hr>
            <div class="row">
                
                <div class="col-md-6 text-right">
                    <button type ="submit" class="ys-btn ys-btn-default save-button">KAYDET</button>
                </div>
            </div>
        </footer>
    </form>
       `
        var modal = document.getElementById('myModal');
        content.innerHTML = html;
        modal.style.display = "block"
        document.querySelector(".save-button").onclick = User.saveAddress.bind(User);
        var radioButtons =  document.querySelectorAll("[type=radio]")
        radioButtons.forEach((button) => {button.onclick = User.radioButtonHandle.bind(button)})       
        this.modalOn();

    },
    modalOn() {
        var modal = document.getElementById('myModal');
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

}