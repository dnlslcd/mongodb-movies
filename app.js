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
    //res.render("index");

    // Iteración 1
    // 1.1. hacer consulta a la bbdd y traer 10 pelis, ordenarlas por fecha de lanzamiento
    // de forma decreciente. Usar console.log para ver si realmente se recuperan los documentos.

    const movies = database.collection("movies");

    // Iteración 2:
    // 2.1. obtener query string, de momento, solo del parámetro title
    const { title } = req.query; // { title } --> operador de desetructuración
    
    // 2.2. si la string trae valor, actualizar el objeto query con el filtro

    // definir un objeto que va a contener la query a la bbdd
    let query = {};

    // si el usuario quiere buscar por título, añado esta información a la query
    if (title) {
        query = {
            ...query, // ...(operador spread) --> copia los mismos campos que se tenía hasta ahora
            title: new RegExp(title) // añadimos el campo title
        }    
    }


    const options = {};
    const cursor = movies.find(query).sort({year: -1}).limit(10);

    // recuperar las pelis y transformarlas en array:
    const documents = await cursor.toArray();
    
     // 1.2. pasar a la vista los documentos recuperados
    res.render("index", {
        documents
    });
     // 1.3. en el ejs, iterar por cada documento y, para cada uno, mostrar el título, imagen y año de lanzamiento.

    



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