import request from 'supertest';
import App from '@/app';
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
import { authResolver } from '@/resolvers/auth.resolver';
import { userResolver } from '@/resolvers/users.resolver';
import { CreateREAssetDto } from '@/dtos/re_asset.dto';
import { REAssetResolver } from '@/resolvers/re_analysis.resolver';
import { CreateREReceiptDto } from '@/dtos/re_receipt.dto';
import { CreateREAssumptionsDto } from '@/dtos/re_assumptions.dto';
import { PlaidResolver } from '@/resolvers/plaid.resolver';
import { TransactionResolver } from '@/resolvers/transactions.resolver';
import { dataSource } from '@/databases';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '@/config';

let app: App;
let userId: number;
let reAssetId: number;
let reAssumptionsId: number;
let reReceiptId: number;
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



describe('Testing Real Estate Asset Analysis', () => {
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

      let response = await request(app.getServer()).post('/api/graphql').send(createUserMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.data.createUser.email).toBe(userData.email);
      userId = response.body.data.createUser.id;
      /* Login */

      const userDataLogin: UserLoginDto = {
        email: 'test@email.com',
        password: CryptoJS.AES.encrypt('q1w2e3r4', SECRET_KEY).toString(),
      };
      const loginUserQuery = {
        query: `mutation userLogin($userData: UserLoginDto!) {
            login(userData: $userData) {
              email
          }
        }`,
        variables: { userData: userDataLogin }
      };

      response = await request(app.getServer()).post('/api/graphql').send(loginUserQuery);
      authCookie = response.headers['set-cookie'][0].match(/^Authorization=[^;]+/)[0];
    });
  });
  describe('[POST] create real estate asset /api/graphql', () => {
    it('should return some of the real estate asset data', async () => {


      const REAssetData: CreateREAssetDto = {
        userId: userId,
        purchase_price: 1000,
        address: "Some Fake Address",
        bathrooms: 1,
        bedrooms: 1,
        postal_code: "123-2456",
        city: "some city",
        province: "some province",
        country: "some country",
        picture_links: ["123_img.png", "3454_img.png"],
        purchase_date: new Date(),
        favorite: true,
        tracking: true
      };

      const createREAssetMutation = {
        query: `mutation upsertREAsset($REAssetData: CreateREAssetDto!) {
                  upsertREAsset(REAssetData: $REAssetData) {
                    id
                    user {
                      id
                    }
                    purchase_price
                    address
                    postal_code
                    re_assumptions {
                      id
                    }
                  }
                }`,
        variables: { REAssetData: REAssetData }
      }

      const response = await request(app.getServer()).post('/api/graphql').set("Cookie", authCookie).send(createREAssetMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.data.upsertREAsset.user.id).toBe(REAssetData.userId);
      expect(response.body.data.upsertREAsset.address).toBe(REAssetData.address);
      expect(response.body.data.upsertREAsset.purchase_price).toBe(REAssetData.purchase_price);
      expect(response.body.data.upsertREAsset.re_assumptions.id).not.toBeNull();
      reAssetId = response.body.data.upsertREAsset.id;
      reAssumptionsId = response.body.data.upsertREAsset.re_assumptions.id;
    });
  });

  describe('[POST] create real estate asset receipt /api/graphql', () => {
    it('should return some of the real estate receipt data', async () => {


      const REReceiptData: CreateREReceiptDto = {
        reAssetId: reAssetId,
        timestamp: 109889080,
        type: "gas",
        receipt_link: ["receipt_1.png", "receipt_2.png"],
        notes: "I travelled to the property back and forth!"
      };

      const createREReceiptMutation = {
        query: `mutation createREReceipt($REReceiptData: CreateREReceiptDto!) {
                  createREReceipt(REReceiptData: $REReceiptData) {
                    id
                    re_asset {
                      id
                    }
                    type
                  }
                }`,
        variables: { REReceiptData: REReceiptData }
      }

      const response = await request(app.getServer()).post('/api/graphql').set("Cookie", authCookie).send(createREReceiptMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.data.createREReceipt.re_asset.id).toBe(reAssetId);
      expect(response.body.data.createREReceipt.type).toBe(REReceiptData.type);
      reReceiptId = response.body.data.createREReceipt.id;
    });
  });


  describe('[POST] query user by id and get RE analysis info /api/graphql', () => {
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


      const response = await request(app.getServer()).post('/api/graphql').set("Cookie", authCookie).send(findUserByIdQuery);
      expect(response.error).toBeFalsy();
      expect(response.body.data.getUserById.id).toBe(userId);
      expect(response.body.data.getUserById.re_asset[0].id).toBe(reAssetId);
      expect(response.body.data.getUserById.re_asset[0].user.id).toBe(userId);
      expect(response.body.data.getUserById.re_asset[0].re_receipt[0].type).toBe(REReceiptData.type);
    });
  });

  describe('[POST] create REAssumptions', () => {
    it('should return error because alredy exists', async () => {
      const createREAssumptionsMutation = {
        query: `mutation createREAssumptions($REAssumptionsData: CreateREAssumptionsDto!) {
          createREAssumptions(REAssumptionsData: $REAssumptionsData) {
            id
            rent_inc
            property_inc
            re_asset {
              id
            }
          }
        }`,
        variables: { REAssumptionsData: { reAssetId: reAssetId } }
      }

      const response = await request(app.getServer()).post('/api/graphql').set("Cookie", authCookie).send(createREAssumptionsMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.errors[0].extensions.exception.status).toBe(409);
    });
  });

  describe('[POST] re_assumptions dto ', () => {
    it('should update the re_assumption and return id and new closing cost', async () => {
      const newAssumptionsData: CreateREAssumptionsDto = {
        reAssetId: reAssetId,
        rent_inc: 3,
        property_inc: 3,
        inflation: 5,
        rent: 500,
        maintenance_fee: 500,
        repairs: 10,
        property_tax: 3000,
        utilities: 300,
        insurance: 5,
        management_fee: 60,
        other_expenses: [1, 23],
        closing_cost: 500000,
        down_percent: 20,
        interest_rate: 5,
        hold_length: 20,
        mortgage_length: 30
      }
      const updateREAssumptionsMutation = {
        query: `mutation updateREAssumptions($assumptionId: Float!, $REAssumptionsData: CreateREAssumptionsDto!) {
          updateREAssumptions(assumptionId: $assumptionId, REAssumptionsData: $REAssumptionsData) {
            id
            closing_cost
          }
        }`,
        variables: { REAssumptionsData: newAssumptionsData, assumptionId: reAssumptionsId }
      }


      const response = await request(app.getServer()).post('/api/graphql').set("Cookie", authCookie).send(updateREAssumptionsMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.data.updateREAssumptions.closing_cost).toBe(newAssumptionsData.closing_cost);
    });
  });

  describe('[POST] delete asset', () => {
    it('should delete the asset', async () => {
      const deleteREAssetMutation = {
        query: `mutation deleteREAsset($reAssetId: Float!) {
          deleteREAsset(reAssetId: $reAssetId) {
            id
            re_assumptions {
              id
            }
            re_receipt {
              id
            }
          }
        }`,
        variables: { reAssetId: reAssetId }
      }
      let response = await request(app.getServer()).post('/api/graphql').set("Cookie", authCookie).send(deleteREAssetMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.data.deleteREAsset.id).toBe(reAssetId);

      /* Delete again but should return 409 */
      response = await request(app.getServer()).post('/api/graphql').set("Cookie", authCookie).send(deleteREAssetMutation);
      expect(response.error).toBeFalsy();
      expect(response.body.errors[0].extensions.exception.status).toBe(409);

    });
    it('should delete the assumption', async () => {

      const getREAssumptionsById = {
        query: `query getREAssumptionsById($reAssumptionsId: Float!) {
          getREAssumptionsById(reAssumptionsId: $reAssumptionsId) {
            id
          }
        }`,
        variables: { reAssumptionsId: reAssumptionsId }
      }

      const response = await request(app.getServer()).post('/api/graphql').set("Cookie", authCookie).send(getREAssumptionsById);
      expect(response.error).toBeFalsy();
      expect(response.body.errors[0].extensions.exception.status).toBe(409);
    });
    it('should NOT delete the receipts', async () => {
      const getREReceiptById = {
        query: `query getREReceiptById($reReceiptId: Float!) {
          getREReceiptById(reReceiptId: $reReceiptId) {
            id
          }
        }`,
        variables: { reReceiptId: reReceiptId }
      }

      const response = await request(app.getServer()).post('/api/graphql').set("Cookie", authCookie).send(getREReceiptById);
      expect(response.error).toBeFalsy();
      expect(response.body.data.getREReceiptById.id).toBe(reReceiptId);
    });
  });
})