import App from './app.js';

const appInstance = new App();
appInstance.app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
