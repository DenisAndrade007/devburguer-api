import express from 'express';
import cors from 'cors';
import { resolve } from 'path';

import './database';
import routes from './routes';

class App {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());

    // Servindo arquivos estáticos da pasta uploads
    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );

    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default App;
