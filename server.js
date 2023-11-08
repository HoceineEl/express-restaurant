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
    let connection = await connectionPromise;

    // Example: Select all records from the 'type_utilisateur' table

    const etatCommandData = await connection.all('SELECT * FROM etat_commande');
    console.log('etat commande Data:', etatCommandData);

    // Example: Select specific columns from the 'produit' table
    const produitData = await connection.all('SELECT id_produit,nom, prix FROM produit');
    console.log('Produit Data:', produitData);

    // You can use similar SELECT statements to retrieve data from other tables.
    // Make sure to specify the columns you want to retrieve and the table name in the query.

    return { etatCommandData, produitData };
};


// Create the main route
getSomeData(connectionPromise)
app.get('/', (req, res) => {

    res.render('index');

});

// Set the port
app.listen(3000);
