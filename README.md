# Build and Deploy a Full Stack MERN Project

## Enlace curso

[Build and Deploy a Full Stack MERN Project - React + Redux, Node, Express, MongoDB [Part 1/2]](https://www.youtube.com/watch?v=ngc9gnGgUdA&feature=youtu.be&ab_channel=JavaScriptMastery)

## Repo

[jlaguilargomez/mearn_memories](https://github.com/jlaguilargomez/mearn_memories)

# Configuración inicial

Creamos dos proyectos (`client` y `server`) para poder manejar tanto el back como el front de la APP.

En el FRONT, creamos una react app `create-react-app .`

En el SERVER, instalamos las siguientes dependencias:

```powershell
npm install body-parser cors express mongoose nodemon
```

Quedando el `package.json`

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0beeb427-f5af-4325-905a-6cb03c223dc6/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0beeb427-f5af-4325-905a-6cb03c223dc6/Untitled.png)

Con las nuevas versiones de NODE, ya podemos utilizar la sintaxis:

```jsx
import SOMETHING from 'PATH';
```

Para ello, tenemos que configurar dicha opción en el `package.json`

```jsx
"type":"module";
```

Y aprovechamos para crear el SCRIPT que usaremos durante la aplicación:

```jsx
"start": "nodemon index.js"
```

En el lado del cliente, instalamos las siguientes librerías:

```jsx
npm install axios moment react-file-base64 redux redux-thunk
```

Para manejar peticiones con **AXIOS** y **REDUX THUNK**, formato y tamaño de imagenes con **REACT-FILE-BASE64** y estados con **REDUX**

Vamos a comenzar configurando el servidor ...

---

# Server

Configuramos parámetros iniciales de la aplicación (ver comentarios en el código).

Creamos una nueva BBDD gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_emea_spain_search_brand_atlas_desktop&utm_term=mongo%20db%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=1718986525&gclid=Cj0KCQiA-rj9BRCAARIsANB_4AAZiq45ViSefx9xLgZ54XkP6vTIKzbdX9nB4PcYSXVm1nAatzJ12PYaAsdXEALw_wcB) (ver enlace)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c8023cef-5004-4782-b6ac-d50c7feb3216/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c8023cef-5004-4782-b6ac-d50c7feb3216/Untitled.png)

Vamos a crear un CLUSTER, y luego una base de datos (investiga qué es un _cluster_...)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/71fee2d7-b911-47ef-991e-4c5dba678d00/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/71fee2d7-b911-47ef-991e-4c5dba678d00/Untitled.png)

Las credenciales son: jlaguilargomez - 7ku0hMaVhTBzHYmL

Añadimos una nueva conexión de RED:

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/981493ef-d126-4d8c-b538-0e6fb0d42274/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/981493ef-d126-4d8c-b538-0e6fb0d42274/Untitled.png)

Ahora volvemos a CLUSTER y le damos a "conectar":

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6b7fa34b-4ae1-4e96-bbfe-0ae5e69bd242/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6b7fa34b-4ae1-4e96-bbfe-0ae5e69bd242/Untitled.png)

Elegimos la opción de "Conectar nuestra aplicación" y copiamos el código para añadirlo al servidor que estamos creando en VS Code:

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a249f028-f21e-4b84-be63-83a05a6086fa/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a249f028-f21e-4b84-be63-83a05a6086fa/Untitled.png)

```jsx
// configuramos parámetros iniciales de la aplicación
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// conectamos el servidor con la BBDD de MONGODB (cloud-atlas)
const CONNECTION_URL = 'mongodb+srv://jlaguilargomez:7ku0hMaVhTBzHYmL@cluster0.gyvwt.mongodb.net/<dbname>?retryWrites=true&w=majority';
```

Evidentemente, cuando estemos creando una aplicación real no tiene ningún sentido el poner nuestras claves de forma "pública", por lo que las gestionaremos de una forma más segura mediante "VARIABLES DE ENTORNO".

Ahora vamos a generar la conexión mediante la librería de `mongoose`con la siguiente configuración:

```jsx
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  // si la conexión con la BBDD es efectiva
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  )
  // si no conseguimos conectarnos ...
  .catch((err) => {
    console.log(err.mongoose);
  });

mongoose.set('useFindAndModify', false);
```

Al lanzar la aplicación mediante el script:

```jsx
"script":"nodemon index.js"
```

Tengo el siguiente problema...

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fd701dbe-2509-46fa-97c8-2e57f3a3541e/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fd701dbe-2509-46fa-97c8-2e57f3a3541e/Untitled.png)

Actualizo la versión de NODE para solucionarlo (tenía la 12.16.1 y ahora la 14.15.0)

## Routes

Vamos a crear las rutas de nuestra aplicación (servidor):

creamos una nueva carpeta `routes` con el archivo `posts.js`

```jsx
import express from 'express';

const router = express.Router();

// en todas las rutas siempre estableceremos un REQ, RES, como en las promesas, que se ejecutará cuando el usuario venga a esta ruta
router.get('/', (req, res) => {
  res.send('THIS WORKS!');
});

export default router;
```

Y configuramos el `index.js` para que pueda trabajar con estas rutas:

```jsx
import postRoutes from './routes/posts.js';

// inicializamos la aplicación
const app = express();

// importamos las rutas y las ejecutamos
app.use('/posts', postRoutes);
```

**Atento a la ruta, le estamos diciendo que para servir el "THIS WORKS", debemos ir a la ruta _`https://localhost:5000/posts`_**

Cuidado con las importaciones en NODE, no estoy acostumbrado a poner el tipo de archivo, pero aquí sí debo ponerlo:

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/66ec200f-2a59-4ca0-89cc-fca5779b00a5/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/66ec200f-2a59-4ca0-89cc-fca5779b00a5/Untitled.png)

## Estructura de carpetas

El siguiente paso es crear una estructura de carpetas más "ESCALABLE" para el caso de que el proyecto siga creciendo.

Es importante separar la funcionalidad de las rutas del fichero de rutas en sí, ya que si la funcionalidad es muy "amplia" perderemos la visión inicial y rápida que debemos tener de todas las rutas de la aplicación:

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dd3bd498-0bf3-4e71-aa29-849dcae52fc8/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dd3bd498-0bf3-4e71-aa29-849dcae52fc8/Untitled.png)

\*\* Me quedo en el minuto 23:53 trabajando en la estructura de carpetas

[https://www.youtube.com/watch?v=ngc9gnGgUdA&feature=youtu.be&ab_channel=JavaScriptMastery](https://www.youtube.com/watch?v=ngc9gnGgUdA&feature=youtu.be&ab_channel=JavaScriptMastery)

[https://youtu.be/ngc9gnGgUdA](https://youtu.be/ngc9gnGgUdA)
