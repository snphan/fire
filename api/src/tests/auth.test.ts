import request from 'supertest';
import App from '@/app';
import { CreateUserDto } from '@dtos/users.dto';
import { authResolver } from '@/resolvers/auth.resolver';
import { userResolver } from '@/resolvers/users.resolver';
import { getConnection } from 'typeorm';

let app: App;
let userId: number;
let authCookie: string;

beforeAll(async () => {
  app = new App([authResolver, userResolver]);

  /* 
    No Entity error occurs because the App doesn't have enough time to 
    connect to the test database. We wait here so that the app can connect. 
  */
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
})

afterAll(async () => {
  /* Clean up the database after the test is done */
  const entities = getConnection().entityMetadatas;
  entities.forEach(async entity => {
    const repository = getConnection().getRepository(entity.name);
    await repository.clear();
  })
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /graphql', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
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

      const response = await request(app.getServer()).post('/graphql').send(createUserMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.data.createUser.email).toBe(userData.email);
      userId = response.body.data.createUser.id;

    });
  });

  describe('[POST] /graphql', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const loginUserQuery = {
        query: `mutation userLogin($userData: CreateUserDto!) {
            login(userData: $userData) {
              email
          }
        }`,
        variables: { userData: userData }
      };

      const response = await request(app.getServer()).post('/graphql').send(loginUserQuery);
      expect(response.headers['set-cookie'][0]).toMatch(/^Authorization=.+/);
      authCookie = response.headers['set-cookie'][0].match(/^Authorization=[^;]+/)[0];
    });
  });

  describe('[POST] /graphql', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {

      const userData = {
        id: userId,
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const logoutUserQuery = {
        query: `mutation userLogout {
            logout {
              email
            }
        }`
      };

      const response = await request(app.getServer())
        .post('/graphql')
        .set("Cookie", authCookie)
        .send(logoutUserQuery);
      expect(response.body.data.logout.email).toBe(userData.email);
      expect(response.headers['set-cookie'][0].match(/Max-Age=[^;]+/)[0]).toBe("Max-Age=0");
    });
  });
});
