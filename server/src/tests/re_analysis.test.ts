import request from 'supertest';
import App from '@/app';
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
import { authResolver } from '@/resolvers/auth.resolver';
import { userResolver } from '@/resolvers/users.resolver';
import { getConnection } from 'typeorm';
import { CreateREAssetDto } from '@/dtos/re_asset.dto';
import { REAssetResolver } from '@/resolvers/re_asset.resolver';
import { CreateREReceiptDto } from '@/dtos/re_receipt.dto';

let app: App;
let userId: number;
let reAssetId: number;
let authCookie: string;

beforeAll(async () => {
  app = new App([authResolver, userResolver, REAssetResolver]);

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
        purchase_date: new Date(),
        hold_length: 10,
        favorite: true,
        tracking: true
      };

      const createREAssetData = {
        query: `mutation createREAsset($REAssetData: CreateREAssetDto!) {
                  createREAsset(REAssetData: $REAssetData) {
                    id
                    user {
                      id
                    }
                    purchase_price
                    address
                    postal_code
                  }
                }`,
        variables: { REAssetData: REAssetData }
      }

      const response = await request(app.getServer()).post('/graphql').send(createREAssetData);
      expect(response.error).toBeFalsy();
      expect(response.body.data.createREAsset.user.id).toBe(REAssetData.userId);
      expect(response.body.data.createREAsset.address).toBe(REAssetData.address);
      expect(response.body.data.createREAsset.purchase_price).toBe(REAssetData.purchase_price);
      reAssetId = response.body.data.createREAsset.id;
    });
  });

  describe('[POST] create real estate asset receipt /graphql', () => {
    it('should return some of the real estate receipt data', async () => {


      const REReceiptData: CreateREReceiptDto = {
        reAssetId: reAssetId,
        timestamp: 109889080,
        type: "gas",
        receipt_link: ["receipt_1.png", "receipt_2.png"],
        notes: "I travelled to the property back and forth!"
      };
      const REAssetData: CreateREAssetDto = {
        userId: userId,
        purchase_price: 1000,
        address: "Some Fake Address",
        postal_code: "123-2456",
        city: "some city",
        province: "some province",
        country: "some country",
        picture_links: ["123_img.png", "3454_img.png"],
        purchase_date: new Date(),
        hold_length: 10,
        favorite: true,
        tracking: true
      };



      const createREReceiptData = {
        query: `mutation createREReceipt($REReceiptData: CreateREReceiptDto!) {
                  createREReceipt(REReceiptData: $REReceiptData) {
                    re_asset {
                      id
                    }
                    type
                  }
                }`,
        variables: { REReceiptData: REReceiptData }
      }

      const response = await request(app.getServer()).post('/graphql').send(createREReceiptData);
      expect(response.error).toBeFalsy();
      expect(response.body.data.createREReceipt.re_asset.id).toBe(reAssetId);
      expect(response.body.data.createREReceipt.type).toBe(REReceiptData.type);
    });
  });


  describe('[POST] query user by id and get RE analysis info /graphql', () => {
    it('should return RE Asset data and RE Receipt data and parent ids', async () => {


      const REReceiptData: CreateREReceiptDto = {
        reAssetId: reAssetId,
        timestamp: 109889080,
        type: "gas",
        receipt_link: ["receipt_1.png", "receipt_2.png"],
        notes: "I travelled to the property back and forth!"
      };

      const createREReceiptData = {
        query: `mutation createREReceipt($REReceiptData: CreateREReceiptDto!) {
                  createREReceipt(REReceiptData: $REReceiptData) {
                    re_asset {
                      id
                    }
                    type
                  }
                }`,
        variables: { REReceiptData: REReceiptData }
      }

      const findUserByIdQuery = {
        query: `query userById($id: Float!) {
          getUserById(userId: $id) {
            id
            email
            re_asset {
              id
              user {
                id
              }
              re_receipt {
                type
              }
            }
          }
        }`,
        variables: { id: userId }
      }


      const response = await request(app.getServer()).post('/graphql').send(findUserByIdQuery);
      expect(response.error).toBeFalsy();
      expect(response.body.data.getUserById.id).toBe(userId);
      expect(response.body.data.getUserById.re_asset[0].id).toBe(reAssetId);
      expect(response.body.data.getUserById.re_asset[0].user.id).toBe(userId);
      expect(response.body.data.getUserById.re_asset[0].re_receipt[0].type).toBe(REReceiptData.type);
    });
  });


})