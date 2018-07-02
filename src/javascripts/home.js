
export default {
    timer : null,
    init(){
       
        var controller = document.querySelector('[data-controller="signup"]');
        if(!controller) return false;
        this.attachEvents();     
         
    },
    attachEvents(){       
        var formLogin = document.querySelector('#formSignup');
        formLogin.onsubmit = this.validateLogin;

        var toggleSignup     = document.querySelector('#ButtonSignup');
        toggleSignup.onclick = this.toggleSignup;

        var inputs = document.querySelectorAll('input');
        inputs.forEach(element => element.onkeyup = this.signupControl);  

        var viewPwd = document.querySelector("#viewPwd");
        viewPwd.onclick = this.viewPassword;
        

        var pwdIcon = document.querySelector("#pwdIcon");
        pwdIcon.onmouseover = this.popupOn;     
        pwdIcon.onmouseout  = this.popupOff;       
    },
    validateLogin(e){         
        var i;
        var empty    = 0;
        var form     = e.target;
        var elements = form.getElementsByTagName("input");   

        for (i = 0; i < elements.length; i++) {
            var el = elements[i];            
            if(el.getAttribute("required") != null){
                var fieldValue  = el.value;
                var formGroup   = el.closest(".form-group");
                var hasError    = formGroup.querySelector(".empty-error");
                if (fieldValue == "") { 
                    empty = 1;             
                    el.classList.add("error");       
                    el.setAttribute("data-error","true");
                    if(hasError === null){       
                        var errorInfo = '<small class = "small-error empty-error" > <br> Lütfen ' + el.getAttribute("data-title") + ' giriniz.</small>';
                        formGroup.insertAdjacentHTML('beforeend',errorInfo ); 
                    }
                }
            }
        }          
        
        if(empty == 1){
            return false;
        }
    },    
    signupControl(e){ 

        var signupActivated = document.querySelector(".signup");     
        

            var field           = e.target;
            var formGroup       = field.closest(".form-group");          
            var errorMessage    = formGroup.querySelectorAll("small");
            

            if(field.getAttribute("data-error") ==  "true"){
                field.style.borderColor = "initial";            
                field.setAttribute("data-error", "false")
            }

        if(signupActivated.style.display === "block") {    

            clearTimeout(this.timer);

            if(e.target.getAttribute("id") == "password"){              
                
                this.timer =  setTimeout(function() {       
                    
                    var password            = field.value.toString();
                    var lowerCaseLetters    = /[a-z]/g;
                    var UpperCaseLetters    = /[A-Z]/g;
                    var Numbers             = /[0-9]/g;
                    var length              = password.length;

                    var smallLovercase = formGroup.querySelector("#lovercase");
                    var smallUppercase = formGroup.querySelector("#uppercase");
                    var smallPwdLength = formGroup.querySelector("#pwdLength");
                    var smallNumbers   = formGroup.querySelector("#numbers");

                    if(password.match(lowerCaseLetters)) {   
                        passwordError(smallLovercase,"small-noError");                          
                    } else {
                        passwordError(smallLovercase,"error");
                    }
                    if(password.match(UpperCaseLetters)) {
                        passwordError(smallUppercase,"small-noError");              
                    }  else {
                        passwordError(smallUppercase,"error");            
                    }
                    if(password.match(Numbers)) {
                        passwordError(smallNumbers,"small-noError");   
                    } else {
                        passwordError(smallNumbers,"error");   
                    }
                    if(length >= 8) {
                        passwordError(smallPwdLength,"small-noError");      
                    } else {
                        passwordError(smallPwdLength,"error");        
                    }    

                    if(field.value == ""){
                        errorMessage.classList.remove("small-noError");
                        errorMessage.classList.add("small-error");
                    }

                    var errExists = formGroup.querySelectorAll(".small-error");

                    if(field.value != "" && errExists.length == 0){
                        addToClass('noError');  
                        this.pwdIcon.classList.remove("fa-angry");
                        this.pwdIcon.classList.add("fa-smile");    
                    } else {
                        addToClass("error");
                        this.pwdIcon.classList.add("fa-angry");
                        this.pwdIcon.classList.remove("fa-smile");   
                    }                    
                    
                }, 300); 
            }    
        

            if(e.target.getAttribute("type") == "email") {
                
                this.timer =  setTimeout(function() {
                    
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(field.value)){
                        
                    } else {                       
                        errorMaker("Hatalı email adresi girdiniz");                    
                    }              
                    var errExists = formGroup.querySelector(".small-error"); 

                    if(field.value != "" && errExists == null){
                    addToClass("noError");
                    } else {
                    addToClass("error");
                    }

                    if(field.value == "" && errExists != null){
                        addToClass("noError");
                        field.style.borderColor = "initial";  
                        formGroup.querySelector(".small-error").remove()
                    }
                },500);       
            }


            function errorMaker(str){
                var errExists = formGroup.querySelector(".small-error"); 
                if(errExists == null){
                    var errorInfo = '<small class="small-error"> <br>' + str + '</small>';
                    formGroup.insertAdjacentHTML( 'beforeend' , errorInfo ); 
                }
            }

            function addToClass(str){
                if(str == "error"){
                    field.classList.add(str);
                    field.classList.remove("noError");
                } else if(str == "noError") {
                    field.classList.add(str);
                    field.classList.remove("error");
                }
            }

            function passwordError(arg,str) {
                if (str == "small-noError") {
                    arg.classList.add("small-noError");
                    arg.classList.remove("small-error");
                } else {
                    arg.classList.remove("small-noError");
                    arg.classList.add("small-error");
                }
            }
            
        }

    },
    popupOn(){
        var popup = document.getElementById("pwdInfo");
        popup.classList.toggle("show");
    },
    popupOff(){
        var popup = document.getElementById("pwdInfo");
        popup.classList.toggle("show");
    },
    toggleSignup(){
       var toggleElements =  document.querySelectorAll(".signup");
       toggleElements.forEach(element => element.style.display = "block"); 
    },
    viewPassword(){
        var x = document.querySelector("#password");
        var icon = document.querySelector("#viewPwd");
        if (x.type === "password") {
            x.type = "text";
            icon.classList.add("fa-eye-slash");
            icon.classList.remove("fa-eye");
        } else {
            x.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }
    
};
