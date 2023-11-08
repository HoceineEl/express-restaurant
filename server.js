import express from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import 'dotenv/config';
import { createDatabase, connectionPromise } from './connexion.js';
import path from 'path';
import url from 'url';


// dotenv.config()
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

console.log(path.join(__dirname, 'public'));
// Set the view engine
app.set("view engine", "ejs");

// Initialize the database tables when the server starts


createDatabase(open({ // Correct the function name here
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
}));
const getSomeData = async (connectionPromise) => {
    try {
        let connection = await connectionPromise;
        const etatCommandData = await connection.all('SELECT * FROM etat_commande');
        const produitData = await connection.all('SELECT * FROM produit');

        return { etatCommandData, produitData };
    } catch (error) {
        throw error; // Propagate the error to the caller
    }
};


// Create the main route
getSomeData(connectionPromise)
app.get('/', async (req, res) => {
    try {
        const { produitData } = await getSomeData(connectionPromise);

        res.render('index', { produitData });
    } catch (error) {
        console.error('Error fetching produit data:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
});

// Set the port
app.listen(3000);
