import { test, expect } from '../../support/fixtures/index.js';
import { getUser } from '../../support/factories/user.js';

test.describe('POST /auth/login', () => {
    let auth = null;

    test('Deve fazer login com sucesso', async ({ auth }) => {
        const user = getUser();

        const respCreate = await auth.createUser(user);
        expect(respCreate.status()).toBe(201);


        const response = await auth.login(user);
        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'Login realizado com sucesso');
        expect(body.data).toHaveProperty('token');
        expect(body.data.user).toHaveProperty('id');
        expect(body.data.user).toHaveProperty('name', user.name);
        expect(body.data.user).toHaveProperty('email', user.email);
        expect(body.data.user).not.toHaveProperty('password');
    });

    test('Não deve logar com senha incorreta', async ({ auth }) => {
        const user = getUser();

        const respCreate = await auth.createUser(user);
        expect(respCreate.status()).toBe(201);

        const response = await auth.login({ ...user, password: '123456' });
        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'Credenciais inválidas');
    });

    test('Não deve logar com email não cadastrado', async ({ auth }) => {
        const user = {
            email: 'teste.401@amancio.qa',
            password: 'pwd123'
        }

        const response = await auth.login(user);
        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'Credenciais inválidas');
    });

    test('Não deve logar quando o email não é informado', async ({ auth }) => {
        const user = {
            password: 'pwd123'
        }

        const response = await auth.login(user);
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Email\' é obrigatório');
    });

    test('Não deve logar quando apassword não é informada', async ({ auth }) => {
        const user = {
            email: 'teste.401@amancio.qa'
        }

        const response = await auth.login(user);
        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body).toHaveProperty('message', 'O campo \'Password\' é obrigatório');
    });

});