import { execSync } from 'child_process';

try {
  console.log('Verificando dependência cmdk...');
  const result = execSync('npm list cmdk --depth=0').toString();
  if (result.includes('empty')) {
    throw new Error('A dependência "cmdk" está faltando no projeto.');
  }
  console.log('Dependência cmdk confirmada.');
} catch (error) {
  console.error('ERRO DE BUILD: Dependência "cmdk" não encontrada.');
  console.error('Por favor, execute: bun add cmdk');
  process.exit(1);
}
