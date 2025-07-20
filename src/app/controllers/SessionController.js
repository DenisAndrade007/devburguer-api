import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .required('Senha é obrigatória')
    });

    try {
      await schema.validate(request.body, { abortEarly: false });

      const { email, password } = request.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log(`Usuário não encontrado: ${email}`);
        return response.status(401).json({ error: 'Credenciais inválidas' });
      }

      console.log(`Verificando senha para: ${email}`);
      if (!(await user.checkPassword(password))) {
        return response.status(401).json({ error: 'Credenciais inválidas' });
      }

      const { id, name, admin } = user;

      const token = jwt.sign(
        { id, admin },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      return response.json({
        user: { id, name, email, admin },
        token
      });

    } catch (error) {
      console.error('Erro no login:', error);
      return response.status(400).json({
        error: 'Erro de validação',
        details: error.errors || [error.message]
      });
    }
  }
}

export default new SessionController();