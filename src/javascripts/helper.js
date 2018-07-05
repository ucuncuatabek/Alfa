export default {

    request(method, url, body=null){       
        var options = {

            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method  : method,
            body    : body,
            mode    : "cors"
        }
        if(body){
            options.body = JSON.stringify(body);
        }
        
        return fetch('http://localhost:3000/'+url, options)
        .then((res) => res.json())    
       
    }
}