import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

class User extends Model {
  static init(sequelize) {
    console.log('Inicializando modelo User');
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: () => uuidv4(),
          primaryKey: true,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Nome completo é obrigatório'
            },
            len: {
              args: [3, 100],
              msg: 'Nome deve ter entre 3 e 100 caracteres'
            }
          }
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: {
            name: 'users_email_unique',
            msg: 'E-mail já está em uso'
          },
          validate: {
            isEmail: {
              msg: 'Forneça um e-mail válido'
            },
            notEmpty: {
              msg: 'E-mail é obrigatório'
            }
          }
        },
        password: {
          type: Sequelize.VIRTUAL,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Senha é obrigatória'
            },
            len: {
              args: [6, 50],
              msg: 'Senha deve ter entre 6 e 50 caracteres'
            }
          }
        },
        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Hash da senha não pode ser nulo'
            }
          }
        },
        admin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        timestamps: true,
        hooks: {
          beforeSave: async (user) => {
            console.log('[DEBUG] BeforeSave - Senha recebida:', user.password);
            if (user.password) {
              console.log('[DEBUG] Gerando hash para:', user.email);
              user.password_hash = await bcrypt.hash(user.password, 12);
            } else if (user.isNewRecord && !user.password_hash) {
              throw new Error('Senha é obrigatória para novos usuários');
            }
          }
        },
        defaultScope: {
          attributes: {
            exclude: ['password_hash', 'deleted_at']
          }
        },
        scopes: {
          withPassword: {
            attributes: { include: ['password_hash'] }
          },
          withTrashed: {
            paranoid: false
          }
        },
        indexes: [
          {
            unique: true,
            fields: ['email'],
            where: { deleted_at: null }
          }
        ]
      }
    );

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.password_hash;
    delete values.deleted_at;
    return values;
  }
}

export default User;