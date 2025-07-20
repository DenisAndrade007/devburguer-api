import Sequelize from "sequelize";
import mongoose from "mongoose";
import configDatabase from "../config/database";

import User from "../app/models/User";
import Product from "../app/models/Product";
import Category from "../app/models/Category";

const models = [User, Product, Category];

class Database {
    constructor() {
        this.initSQL();
        this.initMongo();
    }

    initSQL() {
        this.connection = new Sequelize(configDatabase);

        models.forEach((model) => {
            model.init(this.connection);
        });

        models.forEach((model) => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }

    async initMongo() {
        try {
            await mongoose.connect("mongodb://localhost:27017/devburguer");
            console.log("MongoDB conectado com sucesso.");
        } catch (error) {
            console.error("Erro ao conectar ao MongoDB:", error.message);
        }
    }
}

export default new Database();
