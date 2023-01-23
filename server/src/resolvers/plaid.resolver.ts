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
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import dayjs from 'dayjs';

@Resolver()
export class PlaidResolver {

  decryptAccessToken(encryptedAccessToken: string): string {
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return decryptedAccessToken;
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the Link token as a JSON response'
  })
  async createLinkToken(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi): Promise<Object> {
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


    if (PLAID_REDIRECT_URI !== '') {
      configs.redirect_uri = PLAID_REDIRECT_URI;
    }

    if (PLAID_ANDROID_PACKAGE_NAME !== '') {
      configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
    }
    const createTokenResponse = await plaidClient.linkTokenCreate(configs);

    return createTokenResponse.data;
  }

  @Authorized()
  @Mutation(() => String, {
    description: 'Exchange the Public Token for an Access Token and Return the Item Id'
  })
  async exchangePublicToken(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi, @Arg('publicToken') publicToken: string): Promise<string> {
    let createPlaidInfo: PlaidInfo;
    const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    const ACCESS_TOKEN = tokenResponse.data.access_token;
    const ITEM_ID = tokenResponse.data.item_id;
    const encryptedAccessToken = CryptoJS.AES.encrypt(ACCESS_TOKEN, SECRET_KEY).toString();

    if (!user.plaidinfo) {
      createPlaidInfo = await PlaidInfo.create({ user: user, access_token: encryptedAccessToken, item_id: ITEM_ID }).save();
    } else {
      await PlaidInfo.update(user.plaidinfo.id, { access_token: encryptedAccessToken });
      createPlaidInfo = await PlaidInfo.findOne({ where: { id: user.plaidinfo.id } });
    }
    return createPlaidInfo.item_id;
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the User\'s accounts as a JSON string'
  })
  async getAccounts(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi): Promise<Object> {
    if (!user.plaidinfo) throw new HttpException(409, "User has not connected to an Account through Plaid");

    try {
      const accountsResponse = await plaidClient.accountsGet({
        access_token: this.decryptAccessToken(user.plaidinfo.access_token)
      })
      return accountsResponse.data;
    } catch (error) {
      return error.response;
    }
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the User\'s transactions as a JSON Object'
  })
  async getTransactions(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi): Promise<Object> {
    if (!user.plaidinfo) throw new HttpException(409, "User has not connected to an Account through Plaid");
    let cursor = null;
    let added = [];
    let modified = [];
    let removed = [];
    let hasMore = true;


    while (hasMore) {
      const request = {
        access_token: this.decryptAccessToken(user.plaidinfo.access_token),
        cursor: cursor
      };
      const response = await plaidClient.transactionsSync(request);
      const data = response.data;
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      hasMore = data.has_more;

      cursor = data.next_cursor;
    }

    return { added: added }
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the User\'s investment transactions as a JSON Object'
  })
  async getInvestmentTransactions(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi) {
    const startDate = dayjs().subtract(30, 'days').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    const configs = {
      access_token: this.decryptAccessToken(user.plaidinfo.access_token),
      start_date: startDate,
      end_date: today,
    };
    try {
      const investmentTransactionsResponse = await plaidClient.investmentsTransactionsGet(configs);
      return { investments_transactions: investmentTransactionsResponse.data };
    } catch (error) {
      return error.response;
    }
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the User\'s Current Balance'
  })
  async getBalance(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi) {
    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: this.decryptAccessToken(user.plaidinfo.access_token)
    });
    return { balance: balanceResponse.data };
  }

}