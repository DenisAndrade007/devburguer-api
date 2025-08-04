import { Router } from 'express';
import upload from './config/multer'; // Ajuste o caminho conforme necessário
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';

const routes = new Router();

// Rotas públicas
routes.post('/users', UserController.store); 
routes.post('/sessions', SessionController.store);

// Middleware de autenticação para rotas protegidas
routes.use(authMiddleware);

// Rotas de produtos
routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.put('/products/:id', upload.single('file'), ProductController.update);

// Rotas de categorias
routes.post('/categories', upload.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', upload.single('file'), CategoryController.update);

// Rotas de pedidos
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

export default routes;