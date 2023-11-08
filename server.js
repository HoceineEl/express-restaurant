const express = require('express');
const app = express();

//seting the vue engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

//create main route
app.get('/', (req, res) => {
    console.log('H');
    res.render('index')
});

//port
app.listen(3000);
