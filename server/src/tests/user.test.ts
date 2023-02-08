import request from 'supertest';
import App from '@/app';
import { CreateUserDto } from '@dtos/users.dto';
import { authResolver } from '@/resolvers/auth.resolver';
import { userResolver } from '@/resolvers/users.resolver';
import { REAssetResolver } from '@/resolvers/re_analysis.resolver';
import { PlaidResolver } from '@/resolvers/plaid.resolver';
import { TransactionResolver } from '@/resolvers/transactions.resolver';
import { dataSource } from '@/databases';

let app: App;
let userId: number;
const userData: CreateUserDto = {
  email: 'test@email.com',
  password: 'q1w2e3r4',
  last_name: 'test',
  first_name: 'test'
}

beforeAll(async () => {
  /* 
    No Entity error occurs because the App doesn't have enough time to 
    connect to the test database. We wait here so that the app can connect. 
  */
  app = new App(
    '0 1 * * *' // Everday at 1 am
  );


  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  await app.init(
    [authResolver, userResolver, REAssetResolver, PlaidResolver, TransactionResolver]
  )


  /* Create some users */
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
  userId = response.body.data.createUser.id;
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

describe('Testing User', () => {
  describe('[POST] /api/graphql', () => {
    it('response statusCode 200 / findAll', async () => {
      const findAllUserQuery = {
        query: `query findAllUsers {
          getUsers {
            id
            email
          }
        }`
      }

      const response = await request(app.getServer()).post('/api/graphql').send(findAllUserQuery);
      expect(response.statusCode).toBe(200);
      const responseUser = response.body.data.getUsers[0];
      expect(response.error).toBeFalsy();
      expect(responseUser.id).toBe(userId);
    })
  })

  describe('[POST] /api/graphql', () => {
    it('response statusCode 200 / findById', async () => {
      const findUserByIdQuery = {
        query: `query userById($id: Float!) {
          getUserById(userId: $id) {
            id
            email
          }
        }`,
        variables: { id: userId }
      }

      const response = await request(app.getServer()).post('/api/graphql').send(findUserByIdQuery);
      expect(response.statusCode).toBe(200);
      const responseUser = response.body.data.getUserById;
      expect(response.error).toBeFalsy();
      expect(responseUser.id).toBe(userId);
    })
  })

  describe('[POST] /api/graphql', () => {
    it('response statusCode 200 / findByEmail', async () => {
      const findUserByEmailQuery = {
        query: `query userByEmail($email: String!) {
          getUserByEmail(userEmail: $email) {
            id
            email
          }
        }`,
        variables: { email: userData.email }
      }

      /* Query that expects nothing to be returned */
      const findUserByEmailQueryNaN = {
        query: `query userByEmail($email: String!) {
          getUserByEmail(userEmail: $email) {
            id
            email
          }
        }`,
        variables: { email: 'somerandomemail@gmail.com' }
      }

      const response = await request(app.getServer()).post('/api/graphql').send(findUserByEmailQuery);
      expect(response.statusCode).toBe(200);
      const responseUser = response.body.data.getUserByEmail;
      expect(response.error).toBeFalsy();
      expect(responseUser.id).toBe(userId);

      const responseNaN = await request(app.getServer()).post('/api/graphql').send(findUserByEmailQueryNaN);
      expect(responseNaN.text).toMatch(/"status":409/);
    })
  })

  describe('[POST] /api/graphql', () => {
    it('response statusCode 200 / updateUser', async () => {

      const newUserData: CreateUserDto = {
        email: "newemail1234@gmail.com",
        password: userData.password, // typ. provide the password when changing the data.
        last_name: 'test',
        first_name: 'test'
      }

      const updateUserMutation = {
        query: `mutation updateUser($id: Float!, $userData: CreateUserDto!) {
                  updateUser(userId: $id, userData: $userData) {
                    id
                    email
                  }
                }`,
        variables: { id: userId, userData: newUserData }
      }

      const response = await request(app.getServer()).post('/api/graphql').send(updateUserMutation);
      expect(response.statusCode).toBe(200);
      expect(response.error).toBeFalsy();
      const responseUser = response.body.data.updateUser;
      expect(responseUser.id).toBe(userId);
      expect(responseUser.email).toBe(newUserData.email);
    })
  })

  describe('[POST] /api/graphql', () => {
    it('response statusCode 200 / deleteUser', async () => {

      const deleteUserMutation = {
        query: `mutation deleteUser($id: Float!) {
                  deleteUser(userId: $id) {
                    id
                    email
                  }
                }`,
        variables: { id: userId }
      }

      const response = await request(app.getServer()).post('/api/graphql').send(deleteUserMutation);
      expect(response.statusCode).toBe(200);
      expect(response.error).toBeFalsy();
      const responseUser = response.body.data.deleteUser;
      expect(responseUser.id).toBe(userId);
    })
  })
})