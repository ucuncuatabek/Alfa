
export default {
    init(){
       
        var controller = document.querySelector('[data-controller="home"]')
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
       
        var form = e.target;
        var elements = form.getElementsByTagName("input");     
       
        var requiredFields = [];
        var i,empty = 0;

        for (i = 0; i < elements.length; i++){
            var el = elements[i];            
            if(el.getAttribute("required") != null){
                var fieldValue = el.value;
                if (fieldValue == "") { 
                    empty = 1;                    
                    el.style.borderColor = "#a94442";  
                    el.setAttribute("data-error",true)                     
                    var errorInfo = '<br><small style="color: #a94442">Lütfen ' + el.getAttribute("data-title") + ' giriniz.</small>';
                    el.closest(".form-group").insertAdjacentHTML( 'beforeend',errorInfo ); 
                }
            }
        }          

        if(empty == 1){
            return false;
        }
    },
    removeError(e){        
       
        var field = e.target;   
        console.log(field)    
        if(field.getAttribute("data-error") ==  "true"){
            field.style.borderColor = "initial"; 
            console.log(field.closest(".form-group").querySelector("small").remove())
            field.setAttribute("data-error", "false")
        }
    }
    
};