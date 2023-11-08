
import { existsSync } from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import 'dotenv/config'
// const { existsSync } = require('fs')
// const sqlite3 = require('sqlite3')
// const { open } = require('sqlite')
// const dotenv = require('dotenv')
// dotenv.config()
// Constante indiquant si la base de données existe au démarrage du serveur 
// ou non.
const IS_NEW = !existsSync(process.env.DB_FILE)
console.log(IS_NEW)

// Crée la structure de la base de données et y ajoute des données
const createDatabase = async (connectionPromise) => {
	let connection = await connectionPromise;
	console.log('is in')
	await connection.exec(`
	    DROP TABLE IF EXISTS type_utilisateur;
	    DROP TABLE IF EXISTS etat_commande;
	    DROP TABLE IF EXISTS produit;
	    DROP TABLE IF EXISTS utilisateur;
	    DROP TABLE IF EXISTS commande;
	    DROP TABLE IF EXISTS commande_produit;
	`);
	await connection.exec(
		`
		CREATE TABLE IF NOT EXISTS etat_commande(
			id_etat_commande INTEGER PRIMARY KEY,
			nom TEXT NOT NULL
		);
		
		CREATE TABLE IF NOT EXISTS produit(
			id_produit INTEGER PRIMARY KEY,
			nom TEXT,
			chemin_image TEXT,
			prix REAL
		);
		CREATE TABLE IF NOT EXISTS type_utilisateur(
			id_type_utilisateur INTEGER PRIMARY KEY,
			nom TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS utilisateur(
			id_utilisateur INTEGER PRIMARY KEY,
			id_type_utilisateur INTEGER,
			courriel TEXT,
			mot_de_passe TEXT,
			prenom TEXT,
			nom TEXT,
			FOREIGN KEY(id_type_utilisateur)
			REFERENCES type_utilisateur(id_type_utilisateur)
		);
		
		CREATE TABLE IF NOT EXISTS commande(
			id_commande INTEGER PRIMARY KEY,
			id_utilisateur INTEGER,
			id_etat_commande INTEGER,
			date INTEGER,
			FOREIGN KEY(id_utilisateur)
			REFERENCES utilisateur(id_utilisateur),
			FOREIGN KEY(id_etat_commande)
			REFERENCES etat_commande(id_etat_commande)
		);
		
		CREATE TABLE IF NOT EXISTS commande_produit(
			id_commande INTEGER,
			id_produit INTEGER,
			quantite INTEGER,
			PRIMARY KEY(id_commande, id_produit),
			FOREIGN KEY(id_commande)
			REFERENCES commande(id_commande),
			FOREIGN KEY(id_produit)
			REFERENCES produit(id_produit)
		);
		
		INSERT INTO type_utilisateur(nom) VALUES('client');
		INSERT INTO type_utilisateur(nom) VALUES('administrateur');
		
		INSERT INTO etat_commande(nom) VALUES('panier');
		INSERT INTO etat_commande(nom) VALUES('cuisine');
		INSERT INTO etat_commande(nom) VALUES('livraison');
		INSERT INTO etat_commande(nom) VALUES('terminée');
		INSERT INTO produit(nom,prix,chemin_image) VALUES('toffaha',50,"/assets/img/products/product-img-1.jpg");
		INSERT INTO produit(nom,prix,chemin_image) VALUES('toffaha',50,"/assets/img/products/product-img-2.jpg");
		INSERT INTO produit(nom,prix,chemin_image) VALUES('toffaha',50,"/assets/img/products/product-img-3.jpg");
		
		INSERT INTO utilisateur(id_type_utilisateur, courriel, mot_de_passe, prenom, nom)
		VALUES(1, 'test@test.com', 'Test1234', 'Test', 'Test');`
	);
	return connection;
};

// Base de données dans un fichier
let connectionPromise = open({
	filename: process.env.DB_FILE,
	driver: sqlite3.Database
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
	connectionPromise = createDatabase(connectionPromise);
}

export { createDatabase, connectionPromise };
