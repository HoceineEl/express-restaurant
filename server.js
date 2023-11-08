import express from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';    
import 'dotenv/config'
import createTables from './connexion.js';

const app = express();

<<<<<<< HEAD
//seting the vue engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

//create main route
app.get('/', (req, res) => {
    console.log('H');
    res.render('index')
=======

// Set the view engine
app.set("view engine", "ejs");

// Initialize the database tables when the server starts
createTables(open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
}));

// Create the main route
app.get('/', (req, res) => {
    res.render('index');
>>>>>>> 22b5101976f9827cb10eff5d96ffaef40f2d1e18
});

// Set the port
app.listen(3000);
