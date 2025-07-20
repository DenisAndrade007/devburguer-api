import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    console.log('Acesso negado: Token não fornecido');
    return response.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    
    request.userId = decoded.id;
    request.userAdmin = decoded.admin;
    
    return next();
  } catch (error) {
    console.log('Token inválido:', error);
    return response.status(401).json({ error: 'Token inválido' });
  }
};