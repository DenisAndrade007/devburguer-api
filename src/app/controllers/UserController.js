import User from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const { name, email, password } = req.body;

      console.log(req.body); // Verifique os dados recebidos

      // Verifique se a senha é válida
      if (!password || password.length < 6) {
        return res.status(400).json({ 
          error: 'Senha é obrigatória e deve ter no mínimo 6 caracteres' 
        });
      }

      // Verifique se o usuário já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      // Crie o usuário usando o método create, que chamará o hook
      const user = await User.create({ name, email, password });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active
      });

    } catch (error) {
      console.error('[ERROR] UserController.store:', error);
      return res.status(500).json({ 
        error: error.message || 'Erro ao criar usuário' 
      });
    }
  }
}

export default new UserController();