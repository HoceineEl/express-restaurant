import express from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';    
import 'dotenv/config'
import createTables from './connexion.js';

const app = express();


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
});

// Set the port
app.listen(3000);
