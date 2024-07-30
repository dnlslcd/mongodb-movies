// importar modulos de terceros
const express = require('express');
const morgan = require('morgan');

// creamos una instancia del servidor Express
const app = express();

// usar un nuevo middleware para indicar a Express que queremos hacer peticiones POST
app.use(express.urlencoded({extended: true}));

// especificar a Express que quiero usar EJS como motor de plantillas 
app.set('view engine', 'ejs');

// usamos el middleware morgan para loggear las peticiones
app.use(morgan('dev'));

// importar un par de objetos de la biblioteca mongodb para conectarnos a la base de datos
const { MongoClient, ServerApiVersion } = require("mongodb");

// Connection string: el string donde especificámos usuario:contraseña y URL de conexión 
// URI: Unique Resource Identifier
const uri = "mongodb+srv://dani:dani@cluster0.hyxsuo4.mongodb.net/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// variable global para gestionar nuestra base de datos
let database;

// GET Cuando el usuario acceda al directorio raíz de nuestro servidor, debemos renderizar las 10 primeras películas de la base de datos
app.get("/", (req, res) => {
    res.render('home')
})





















// levanto servidor
app.listen(process.env.PORT || 3002, async () => {
    console.log('Server up, at 3002')
    
    // Cuando se levanta el servidor, nos conectamos a mongodb
    try {
        await client.connect();

        database = client.db("sample_mflix");

        // mensaje de confirmación de que nos hemos conectado a la bbdd
        console.log("Connected to MongoDB");
        
    } catch (err) {
        console.error(err);
    }
});