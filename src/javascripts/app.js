import index from './index';
import home from './Home';
//import { Mongoose } from 'mongoose';

index.init();
home.init();
console.log(`app.js has loaded!`);

/*Mongoose.connect('mongodb://localhost/test');

Element.on('click',function(){

});

Mongoose.connection.once('open',function(){
  console.log("database connected");
}).on('error',function(error){
  console.log("Connection error:",error);
});*/
