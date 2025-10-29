// global.setup.js
import cleanupTestData from './playwright/support/database.js';

export default async function globalSetup() {
  console.log('Executando limpeza no banco de dados antes dos testes...');
  await cleanupTestData();
  console.log('Limpeza concluída com sucesso.');
};
