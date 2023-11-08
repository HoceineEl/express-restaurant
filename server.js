const express = require('express');
const app = express();

//seting the vue engine
// app.set("view engine","ejs");

//create main route
app.get('/',(req,res)=>{
    console.log('H');
    res.send('hello world');
});

//port
app.listen(3000);
