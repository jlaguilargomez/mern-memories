import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/posts.js'

// inicializamos la aplicación
const app = express();

// importamos las rutas y las ejecutamos
app.use('/posts', postRoutes)

// configuramos parámetros iniciales de la aplicación
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// conectamos el servidor con la BBDD de MONGODB (cloud-atlas)
const CONNECTION_URL = 'mongodb+srv://jlaguilargomez:7ku0hMaVhTBzHYmL@cluster0.gyvwt.mongodb.net/<dbname>?retryWrites=true&w=majority';
// HEROKU se encarga de proveernos de un puerto por defecto en su entorno, sino, 5000
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);