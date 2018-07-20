export default{
    init(){

    },
    showModal(text,type){
        if(type =="error") {
            var modal = document.getElementById('myModal');        
            var header = document.querySelector(".modal-header");
            var footer = document.querySelector(".modal-footer");
            footer.classList.add("error")
            header.classList.add("error")
           
            var span = document.getElementsByClassName("close")[0];
            var content = document.querySelector(".modal-body");

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
        }
    }
}