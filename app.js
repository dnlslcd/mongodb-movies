const express = require("express");
const logger = require("morgan");
// importamos 2 objetos de la biblioteca mongodb:
const {MongoClient, ServerApiVersion} = require("mongodb");

    // 1. Connection string: el string donde especificámos usuario:contraseña y URL de conexión 
    const uri = "mongodb+srv://dani:dani@cluster0.hyxsuo4.mongodb.net/";

    // 2. Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    }
    );

// variable global para gestionar la bbdd
let database;

const app = express();
app.use(logger("dev"));
app.set("view engine", "ejs");


app.get("/", async (req, res) => {
    res.render("index");

    // 1. hacer consulta a la bbdd y traer 10 pelis, ordenarlas por fecha de lanzamiento
    // de forma decreciente. Usar console.log para ver si realmente se recuperan los documentos.

    const movies = database.collection("movies");
    const query = {};
    const options = {
        projection: { sort: {year: -1}, limit: 10}
    };

    // recuperar las pelis con la query y opciones:
    const documents = await movies.find(query, options).toArray();
    console.log(documents);
    
     // 2. pasar a la vista los documentos recuperados
    res.render("index", {
        movies: documents
    });
     // 3. en el ejs, iterar por cada documento y, para cada uno, mostrar el título, imagen y año de lanzamiento.





})














app.listen(process.env.PORT || 3000, () => {
    console.log("Server up at 3000");

    // cuando levantamos el servidor nos conectamos a MongoDB
    try {
        client.connect();
        
        // seleccionamos la bbdd
        database = client.db("sample_mflix");

        // mensaje de confirmación de que nos hemos conectado a la bbdd
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
});