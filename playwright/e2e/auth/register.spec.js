import { test, expect } from 'playwright/test';
import { getUser } from '../../support/factories/user.js';
import { authService } from '../../support/services/auth.js';


test.describe('POST / auth/register', () => {

    let auth = null;

    test.beforeEach(({ request }) => {
        auth = authService(request);
    })

    test('Deve cadastrar um novo usuário', async ({ request }) => {

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

    test('Não deve cadastrar quando o email já estiver em uso', async ({ request }) => {

        const user = getUser();

        const preCondition = await auth.createUser(user);
        expect(preCondition.status()).toBe(201);

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Este e-mail já está em uso. Por favor, tente outro.');
    });

    test('Não deve cadastrar quando o email é incorreto', async ({ request }) => {

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

    test('Não deve cadastrar quando o campo nome não é informado', async ({ request }) => {

        const user = {
            "email": "amancio.jluis&email.com",
            "password": "123456"
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Name' é obrigatório");
    });

    test('Não deve cadastrar quando o campo Email não é informado', async ({ request }) => {

        const user = {
            "name": "Jose Luis Amancio",
            "password": "123456"
        };

        const response = await auth.createUser(user);
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', "O campo 'Email' é obrigatório");
    });

    test('Não deve cadastrar quando o campo Password não é informado', async ({ request }) => {

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