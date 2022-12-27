import request from 'supertest';
import App from '@/app';
import { CreateUserDto } from '@dtos/users.dto';
import { authResolver } from '@/resolvers/auth.resolver';
import { userResolver } from '@/resolvers/users.resolver';
import { getConnection } from 'typeorm';

let app: App;
let userId: number;
const userData: CreateUserDto = {
  email: 'test@email.com',
  password: 'q1w2e3r4',
}

beforeAll(async () => {
  /* 
    No Entity error occurs because the App doesn't have enough time to 
    connect to the test database. We wait here so that the app can connect. 
  */
  app = new App([authResolver, userResolver]);
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));


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

  const response = await request(app.getServer()).post('/graphql').send(createUserMutation);
  userId = response.body.data.createUser.id;
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

describe('Testing User', () => {
  describe('[POST] /graphql', () => {
    it('response statusCode 200 / findAll', async () => {
      const findAllUserQuery = {
        query: `query findAllUsers {
          getUsers {
            id
            email
          }
        }`
      }

      const response = await request(app.getServer()).post('/graphql').send(findAllUserQuery);
      expect(response.statusCode).toBe(200);
      const responseUser = response.body.data.getUsers[0];
      expect(response.error).toBeFalsy();
      expect(responseUser.id).toBe(userId);
    })
  })

  describe('[POST] /graphql', () => {
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

      const response = await request(app.getServer()).post('/graphql').send(findUserByIdQuery);
      expect(response.statusCode).toBe(200);
      const responseUser = response.body.data.getUserById;
      expect(response.error).toBeFalsy();
      expect(responseUser.id).toBe(userId);
    })
  })

  describe('[POST] /graphql', () => {
    it('response statusCode 200 / updateUser', async () => {

      const newUserData = {
        email: "newemail1234@gmail.com",
        password: userData.password // typ. provide the password when changing the data.
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

      const response = await request(app.getServer()).post('/graphql').send(updateUserMutation);
      expect(response.statusCode).toBe(200);
      expect(response.error).toBeFalsy();
      const responseUser = response.body.data.updateUser;
      expect(responseUser.id).toBe(userId);
      expect(responseUser.email).toBe(newUserData.email);
    })
  })

  describe('[POST] /graphql', () => {
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

      const response = await request(app.getServer()).post('/graphql').send(deleteUserMutation);
      expect(response.statusCode).toBe(200);
      expect(response.error).toBeFalsy();
      const responseUser = response.body.data.deleteUser;
      expect(responseUser.id).toBe(userId);
    })
  })
})