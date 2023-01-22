import { Configuration, PlaidApi, Products, PlaidEnvironments, LinkTokenCreateRequest } from 'plaid';
import { Arg, Ctx, Mutation, Query, Resolver, Authorized } from 'type-graphql';
import { CreateUserDto } from '@dtos/users.dto';
import UserRepository from '@repositories/users.repository';
import { User } from '@entities/users.entity';
import { PLAID_ANDROID_PACKAGE_NAME, PLAID_CLIENT_ID, PLAID_COUNTRY_CODES, PLAID_ENV, PLAID_PRODUCTS, PLAID_REDIRECT_URI, PLAID_SECRET, SECRET_KEY } from '@/config';
import { ClientRequest } from 'http';
import { PlaidInfo } from '@/entities/plaid_auth.entity';
import CryptoJS from 'crypto-js';
import { HttpException } from '@/exceptions/HttpException';

@Resolver()
export class PlaidResolver {

  @Authorized()
  @Query(() => String, {
    description: 'Get the Link token as a JSON response'
  })
  async createLinkToken(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi): Promise<String> {
    const configs: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: String(user.id),
      },
      client_name: 'Plaid Quickstart',
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: 'en',
    };

    console.log(user);

    if (PLAID_REDIRECT_URI !== '') {
      configs.redirect_uri = PLAID_REDIRECT_URI;
    }

    if (PLAID_ANDROID_PACKAGE_NAME !== '') {
      configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
    }
    const createTokenResponse = await plaidClient.linkTokenCreate(configs);

    return JSON.stringify(createTokenResponse.data);
  }

  @Authorized()
  @Query(() => String, {
    description: 'Exchange the Public Token for an Access Token and Return the Item Id'
  })
  async exchangePublicToken(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi, @Arg('publicToken') publicToken: string): Promise<string> {
    let createPlaidInfo: PlaidInfo;
    if (!user.plaidinfo) {
      const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
      const ACCESS_TOKEN = tokenResponse.data.access_token;
      const ITEM_ID = tokenResponse.data.item_id;

      const encryptedAccessToken = CryptoJS.AES.encrypt(ACCESS_TOKEN, SECRET_KEY).toString();
      createPlaidInfo = await PlaidInfo.create({ user: user, access_token: encryptedAccessToken, item_id: ITEM_ID }).save();
    } else {
      createPlaidInfo = user.plaidinfo;
    }
    return createPlaidInfo.item_id;
  }

  @Authorized()
  @Query(() => String, {
    description: 'Get the User\'s accounts as a JSON string'
  })
  async getAccounts(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi) {
    console.log(user);
    if (!user.plaidinfo) throw new HttpException(409, "User has not connected to an Account through Plaid");

    const decryptedAccessToken = CryptoJS.AES.decrypt(user.plaidinfo.access_token, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    try {

      const accountsResponse = await plaidClient.accountsGet({
        access_token: decryptedAccessToken
      })
      return JSON.stringify(accountsResponse.data);
    } catch (error) {
      return JSON.stringify(error.response);
    }

  }
}