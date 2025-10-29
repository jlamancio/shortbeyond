import { test, expect } from '../../support/fixtures/index.js';
import { getUserWithLink } from '../../support/factories/user.js';
import { ulid } from 'ulid';

test.describe('DELETE /links/:id', () => {

    const user = getUserWithLink();
    let token;


    test.beforeEach(async ({ auth }) => {
        await auth.createUser(user);
        token = await auth.getToken(user);
    })

    test('Deve remover um link encurtado', async ({ links }) => {



        const linkId = await links.createAndReturnLinkId(user.link, token);

        const response = await links.removeLink(linkId, token);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe('Link excluído com sucesso');

    });

    test('Não deve removerqdo o id não existe', async ({ links }) => {

        const linkId = ulid();

        const response = await links.removeLink(linkId, token);
        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.message).toBe('Link não encontrado');

    });



});