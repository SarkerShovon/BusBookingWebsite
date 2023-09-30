// function avg(arr)
// {
//     let sum=0;
//     for(let i=0;i<arr.length;i++)
//     {
//         sum+=arr[i];
//     }
//     return (sum/arr.length);
// }
// module.exports= {ava: avg};
// console.log('hellping')
// console.log("go to  hell");
// const express= require('express');
// const app=express();
// const localhost='127.0.0.1';
// const port=80;
// app.use('/prac',express.static('prac'));
// app.get('/',(req,res)=>
// {
//     console.log(req.url);
//     console.log(req.body);
//     res.send("My name is shovon sarker");
// })
// app.get('/about',(req,res)=>
// {
//     console.log(req.url);
//     res.send("My name is shovon sarker about");
// })
// app.post('/about',(req,res)=>
// {
//     res.send("My name is shovon sarker about post");
// })
// app.listen(port,()=>
// {
//     console.log(`The app is now open in port 80 by http://${localhost}`);
// })
// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/shovon');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log('Connection is set up perfectly')
});

const Items =new mongoose.model('Item', { Name: String, Roll: Number });
// const item1 = new Items({ Name: "Pritom Sarker", Roll: 1 });
// const item2 = new Items({ Name: "Prem Sarker", Roll: 1 });
// const item3 = new Items({ Name: "Shovon Sarker", Roll: 1 });
// //item1 = new Items({ Name: "Rupom Sarker", Roll: 4 });
// // item1.save();
// // item2.save();
// // item3.save();
// const cre = async () => {
//     const me1 = await item1.save();
//     const me2 = await item2.save();
//     const me3 = await item3.save();
//     //console.log(me);
// }
//  cre();
run();
async function run(){
  const kitty = await Items.find({Roll:3});
  console.log(kitty);
  //const c=kitty.length;
  console.log(kitty.length);
}