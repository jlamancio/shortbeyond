import { test, expect } from '../../support/fixtures/index.js';
import { getUser } from '../../support/factories/user.js';



test.describe('POST / auth/register', () => {

    test('Deve cadastrar um novo usuário', async ({ auth }) => {

        const user = getUser();

        const response = await auth.createUser(user);
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('Usuário cadastrado com sucesso!');
        expect(responseBody).toHaveProperty('message', 'Usuário cadastrado com sucesso!');
        expect(responseBody.user).toHaveProperty('id');
        expect(responseBody.user).toHaveProperty('name', user.name);
        expect(responseBody.user).toHaveProperty('email', user.email);
        expect(responseBody.user).not.toHaveProperty('password');
    });

    test('Não deve cadastrar quando o email já estiver em uso', async ({ auth }) => {

        const user = getUser();

        const preCondition = await auth.createUser(user);
        expect(preCondition.status()).toBe(201);

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Este e-mail já está em uso. Por favor, tente outro.');
    });

    test('Não deve cadastrar quando o email é incorreto', async ({ auth }) => {

        const user = {
            "name": "Jose Luis Amancio",
            "email": "amancio.jluis&email.com",
            "password": "123456"
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Email' deve ser um email válido");
    });

    test('Não deve cadastrar quando o campo nome não é informado', async ({ auth }) => {

        const user = {
            "email": "amancio.jluis&email.com",
            "password": "123456"
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Name' é obrigatório");
    });

    test('Não deve cadastrar quando o campo Email não é informado', async ({ auth }) => {

        const user = {
            "name": "Jose Luis Amancio",
            "password": "123456"
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Email' é obrigatório");
    });

    test('Não deve cadastrar quando o campo Password não é informado', async ({ auth }) => {

        const user = {
            "name": "Jose Luis Amancio",
            "email": "amancio.jluis@email.com"
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Password' é obrigatório");
    });

});