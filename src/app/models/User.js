import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Nome não pode estar vazio'
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          name: 'users_email_unique',
          msg: 'Email já está em uso'
        },
        validate: {
          isEmail: {
            msg: 'Formato de email inválido'
          }
        }
      },
      password: {
        type: Sequelize.VIRTUAL,
        allowNull: false,
        validate: {
          len: {
            args: [6],
            msg: 'Senha deve ter no mínimo 6 caracteres'
          }
        }
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      tableName: 'users',
      hooks: {
        beforeSave: async (user) => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8);
          }
        }
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;