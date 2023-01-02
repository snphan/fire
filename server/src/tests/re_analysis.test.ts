import request from 'supertest';
import App from '@/app';
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
import { authResolver } from '@/resolvers/auth.resolver';
import { userResolver } from '@/resolvers/users.resolver';
import { getConnection } from 'typeorm';
import { CreateREAssetDto } from '@/dtos/re_asset.dto';

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
    await repository.delete({});
  })
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});



describe('Testing Real Estate Asset Analysis', () => {
  describe('[POST] /graphql', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
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

      const response = await request(app.getServer()).post('/graphql').send(createUserMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.data.createUser.email).toBe(userData.email);
      userId = response.body.data.createUser.id;
    });
  });
  describe('[POST] create real estate asset /graphql', () => {
    it('should return some of the real estate asset data', async () => {


      const REAssetData: CreateREAssetDto = {
        userId: userId,
        purchase_price: 1000,
        address: "Some Fake Address",
        postal_code: "123-2456",
        city: "some city",
        province: "some province",
        country: "some country",
        picture_links: ["123_img.png", "3454_img.png"],
        purchase_date: Date(),
        hold_length: 10,
        favorite: true,
        tracking: true
      };

      const createREAssetData = {
        query: `mutation createREAsset($REAssetData: CreateREAssetDto!) {
                  createREAsset(REAssetData: $REAssetData) {
                    user
                    purchase_price
                    address
                    postal_code
                  }
                }`,
        variables: { REAssetData: REAssetData }
      }

      const response = await request(app.getServer()).post('/graphql').send(createREAssetData);
      expect(response.error).toBeFalsy();
      expect(response.body.data.createREAsset.user).toBe(REAssetData.userId);
      expect(response.body.data.createREAsset.address).toBe(REAssetData.address);
      expect(response.body.data.createREAsset.purchase_price).toBe(REAssetData.purchase_price);
    });
  });
})