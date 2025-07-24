import * as Yup from 'yup';
import User from '../models/User';
import bcrypt from 'bcryptjs';

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório'),
      email: Yup.string()
        .email('Digite um email válido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .min(6, 'A senha precisa ter no mínimo 6 caracteres')
        .required('Senha é obrigatória'),
      admin: Yup.boolean()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });

      const { name, email, password, admin } = request.body;
      
      // Correção do valor booleano
      const isAdmin = admin === true || admin === 'true' || admin === '1';

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return response.status(400).json({ error: 'Email já cadastrado' });
      }

      // Geração explícita do hash
      const password_hash = await bcrypt.hash(password, 8);

      const user = await User.create({
        name,
        email,
        password_hash,
        admin: isAdmin
      });

      return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin
      });

    } catch (error) {
      console.error('Erro detalhado:', error);
      return response.status(500).json({
        error: 'Erro interno no servidor',
        details: error.message
      });
    }
  }
}

export default new UserController();