import request from 'supertest';
import App from '@/app';
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
import { authResolver } from '@/resolvers/auth.resolver';
import { userResolver } from '@/resolvers/users.resolver';
import { REAssetResolver } from '@/resolvers/re_analysis.resolver';
import { PlaidResolver } from '@/resolvers/plaid.resolver';
import { TransactionResolver } from '@/resolvers/transactions.resolver';
import { dataSource } from '@/databases';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '@/config';

let app: App;
let userId: number;
let authCookie: string;

beforeAll(async () => {
  app = new App(
    '0 1 * * *' // Everday at 1 am
  );

  /* 
    No Entity error occurs because the App doesn't have enough time to 
    connect to the test database. We wait here so that the app can connect. 
  */
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  await app.init(
    [authResolver, userResolver, REAssetResolver, PlaidResolver, TransactionResolver]
  )

})

afterAll(async () => {
  /* Clean up the database after the test is done */
  const entities = dataSource.entityMetadatas;
  entities.forEach(async entity => {
    const repository = dataSource.getRepository(entity.name);
    await repository.delete({});
  })
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /api/graphql', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: CryptoJS.AES.encrypt('q1w2e3r4', SECRET_KEY).toString(),
        last_name: 'test',
        first_name: 'test'
      };

      const createUserMutation = {
        query: `mutation createUser($userData: CreateUserDto!) {
                  createUser(userData: $userData) {
                    id
                    email
                  }
                }`,
        variables: { userData: userData }
      }

      const response = await request(app.getServer()).post('/api/graphql').send(createUserMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.data.createUser.email).toBe(userData.email);
      userId = response.body.data.createUser.id;

    });
  });

  describe('[POST] /api/graphql', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: UserLoginDto = {
        email: 'test@email.com',
        password: CryptoJS.AES.encrypt('q1w2e3r4', SECRET_KEY).toString(),
      };

      const loginUserQuery = {
        query: `mutation userLogin($userData: UserLoginDto!) {
            login(userData: $userData) {
              email
          }
        }`,
        variables: { userData: userData }
      };

      const response = await request(app.getServer()).post('/api/graphql').send(loginUserQuery);
      expect(response.headers['set-cookie'][0]).toMatch(/^Authorization=.+/);
      authCookie = response.headers['set-cookie'][0].match(/^Authorization=[^;]+/)[0];
    });
  });

  describe('[POST] /api/graphql', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {

      const userData = {
        id: userId,
        email: 'test@email.com',
        password: CryptoJS.AES.encrypt('q1w2e3r4', SECRET_KEY).toString(),
      };

      const logoutUserQuery = {
        query: `mutation userLogout {
            logout {
              email
            }
        }`
      };

      const response = await request(app.getServer())
        .post('/api/graphql')
        .set("Cookie", authCookie)
        .send(logoutUserQuery);
      expect(response.body.data.logout.email).toBe(userData.email);
      expect(response.headers['set-cookie'][0].match(/Max-Age=[^;]+/)[0]).toBe("Max-Age=0");
    });
  });
});
