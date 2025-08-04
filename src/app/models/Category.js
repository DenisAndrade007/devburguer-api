import Sequelize, { Model } from "sequelize";

class Category extends Model {
  static init(sequelize) {
    console.log('Inicializando modelo Category'); // Log para depuração
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/category-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Category;