import express from 'express';
import {getPosts} from '../controllers/post.js';

const router = express.Router();

// en todas las rutas siempre estableceremos un REQ, RES, como en las promesas, que se ejecutará cuando el usuario venga a esta ruta
router.get('/', getPosts);

export default router;