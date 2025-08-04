import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import configDatabase from '../config/database';

import User from '../app/models/User';
import Product from '../app/models/Product';
import Category from '../app/models/Category';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models.forEach((model) => {
      console.log('Inicializando modelo:', model.name); // Log do nome do modelo
      if (typeof model.init === 'function') {
        model.init(this.connection);
      } else {
        console.error('O modelo não possui a função init:', model);
      }
    });
    models.forEach((model) => model.associate && model.associate(this.connection.models));  
  }

  mongo() {
    this.mongoConnection = mongoose.connect('mongodb://localhost:27017/devburger', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();