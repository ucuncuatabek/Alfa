
export default {
    timer : null,
    init(){
       
        var controller = document.querySelector('[data-controller="home"]');
        if(!controller) return false;
        this.attachEvents();     
         
    },
    attachEvents(){       
        var formLogin = document.querySelector('#formLogin');
        formLogin.onsubmit = this.validateLogin;

        var inputs = document.querySelectorAll('input');
        inputs.forEach(element => element.onkeyup = this.removeError);        
    },
    validateLogin(e){         
        var i, empty = 0, form = e.target, elements = form.getElementsByTagName("input");   

        for (i = 0; i < elements.length; i++) {
            var el = elements[i];            
            if(el.getAttribute("required") != null){
                var fieldValue = el.value;
                var formGroup = el.closest(".form-group");
                var hasError = formGroup.querySelector("small");
                if (fieldValue == "") { 
                    empty = 1;                    
                    el.className += "error"; 
                    el.setAttribute("data-error","true")
                    if(hasError == null){       
                        var errorInfo = '<small class = "error"> <br> Lütfen ' + el.getAttribute("data-title") + ' giriniz.</small>';
                        formGroup.insertAdjacentHTML('beforeend',errorInfo ); 
                    }
                }
            }
        }          

        if(empty == 1){
            return false;
        }
    },    
    removeError(e){        
        var field = e.target, formGroup = field.closest(".form-group");          
        var errorMessage = formGroup.querySelector("small");

        if(field.getAttribute("data-error") ==  "true"){
            field.style.borderColor = "initial"; 
            errorMessage.remove()            
            field.setAttribute("data-error", "false")
        }

        clearTimeout(this.timer);

        var errExists = formGroup.querySelector("small");     
                  
        if(errExists != null){
            errorMessage.remove();            
        }

        if(e.target.getAttribute("type") == "password"){              
            
            this.timer =  setTimeout(function() {       

                var password = field.value.toString();
                var lowerCaseLetters = /[a-z]/g;
                var UpperCaseLetters = /[A-Z]/g;
                var Numbers = /[0-9]/g;
                var length = password.length;
                
                if(!password.match(lowerCaseLetters)) {                    
                    errorMaker("En az 1 küçük harf girmelisiniz.");                    
                } 
                else if(!password.match(UpperCaseLetters)) {
                    errorMaker("En az 1 Büyük harf girmelisiniz");                    
                }   
                else if(!password.match(Numbers)) {
                    errorMaker("En az 1 Sayı girmelisiniz");
                } 
                else if(length < 8) {
                    errorMaker("Şifre en az 8 karakter olmalı");
                }  else if(length > 64){
                    errorMaker("Şifre en çok 64 karakter içermeli.");
                }              

                var errExists = formGroup.querySelector("small");                

                if(field.value != "" && errExists == null){
                    field.addClass('noError');
                    
                } 

             }, 300);  

         
        }

        if(e.target.getAttribute("type") == "email") {
            this.timer =  setTimeout(function() {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(field.value)){
                    
                } else {
                    errorMaker("Hatalı email adresi girdiniz");
                }
                var errExists = formGroup.querySelector("small"); 
                if(field.value != "" && errExists == null){
                    field.addClass( "noError");
                }
            },500);       
        }

        function errorMaker(str){
            var errorInfo = '<small style="color: #a94442"> <br>' + str + '</small>';
            formGroup.insertAdjacentHTML( 'beforeend' , errorInfo ); 
            field.style.borderColor = "#a94442";
        }

    }
    
};