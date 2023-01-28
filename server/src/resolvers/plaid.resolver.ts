import { Configuration, PlaidApi, Products, PlaidEnvironments, LinkTokenCreateRequest, ItemRemoveRequest, InstitutionsGetByIdRequest, CountryCode, InstitutionsGetRequest, AccountsGetRequest } from 'plaid';
import { Arg, Ctx, Mutation, Query, Resolver, Authorized } from 'type-graphql';
import { CreateUserDto } from '@dtos/users.dto';
import UserRepository from '@repositories/users.repository';
import { User } from '@entities/users.entity';
import { PLAID_ANDROID_PACKAGE_NAME, PLAID_CLIENT_ID, PLAID_COUNTRY_CODES, PLAID_ENV, PLAID_PRODUCTS, PLAID_REDIRECT_URI, PLAID_SECRET, SECRET_KEY } from '@/config';
import { ClientRequest } from 'http';
import { PlaidInfo } from '@/entities/plaid_info.entity';
import CryptoJS from 'crypto-js';
import { HttpException } from '@/exceptions/HttpException';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import dayjs from 'dayjs';
import PlaidRepository from '@/repositories/plaid.repository';

@Resolver()
export class PlaidResolver extends PlaidRepository {

  decryptAccessToken(encryptedAccessToken: string): string {
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return decryptedAccessToken;
  }

  @Authorized()
  @Query(() => Boolean, {
    description: 'Check if user has linked a bank account'
  })
  async bankAccountLinked(@Ctx('user') user: User) {
    const findPlaidInfo = await this.getPlaidInfoByUser(user);
    if (findPlaidInfo.length) {
      return true
    }
    return false
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the Link token as a JSON response'
  })
  async createLinkToken(@Arg('products', (type) => [String]) products: string[], @Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi): Promise<Object> {

    const formatedProducts = products.map((product: Products) => product)
    const configs: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: String(user.id),
      },
      client_name: 'Fire Cash',
      products: formatedProducts,
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
  @Mutation(() => Boolean, {
    description: 'Exchange the Public Token for an Access Token and Return the Item Id'
  })
  async exchangePublicToken(@Arg('publicToken') publicToken: string, @Arg('products', (type) => [String]) products: string[], @Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi): Promise<boolean> {

    const formatedProducts = products.map((product: Products) => product)
    let createPlaidInfo: PlaidInfo;
    const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    const ACCESS_TOKEN = tokenResponse.data.access_token;
    const ITEM_ID = tokenResponse.data.item_id;
    const encryptedAccessToken = CryptoJS.AES.encrypt(ACCESS_TOKEN, SECRET_KEY).toString();

    /* Item from request, check institution_id */
    const request: AccountsGetRequest = {
      access_token: ACCESS_TOKEN
    }
    const requestItem = (await plaidClient.accountsGet(request)).data.item;
    const requestInstitutionName = (
      await plaidClient.institutionsGetById({
        institution_id: requestItem.institution_id,
        country_codes: PLAID_COUNTRY_CODES
      })).data.institution.name;

    /* Check for duplicate items, update if institution_id matches */
    const findPlaidInfo = await this.getPlaidInfoByUser(user);
    for (const plaidInfo of findPlaidInfo) {
      if (requestItem.institution_id === plaidInfo.institution_id) {
        await PlaidInfo.update(plaidInfo.id, { products: formatedProducts, access_token: encryptedAccessToken, item_id: ITEM_ID });
        console.log("Update");
        return true;
      }
    }
    /* Create if there are no duplicates found */
    createPlaidInfo = await PlaidInfo.create({
      user: user,
      access_token: encryptedAccessToken,
      item_id: ITEM_ID,
      products: formatedProducts,
      institution_id: requestItem.institution_id,
      institution_name: requestInstitutionName
    }).save();
    return true;
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the User\'s accounts as a JSON object'
  })
  async getAccounts(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi): Promise<Object> {
    const findPlaidInfo = await this.getPlaidInfoByUser(user);
    if (!findPlaidInfo.length) throw new HttpException(409, "User has not connected to an Account through Plaid");

    try {
      let accounts = [];

      for (const plaidInfo of findPlaidInfo) {
        const accountsResponse = await plaidClient.accountsGet({
          access_token: this.decryptAccessToken(plaidInfo.access_token)
        })
        accounts = accounts.concat(accountsResponse.data.accounts);
      }

      return { accounts: accounts };
    } catch (error) {
      return error.response;
    }
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the User\'s transactions as a JSON Object'
  })
  async syncTransactions(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi): Promise<Object> {
    const findPlaidInfo = await this.getPlaidInfoByUser(user);
    if (!findPlaidInfo.length) throw new HttpException(409, "User has not connected to an Account through Plaid");
    let cursor = null;
    let added = [];
    let modified = [];
    let removed = [];
    let hasMore = true;


    for (const plaidInfo of findPlaidInfo) {
      if (plaidInfo.products.includes(Products.Transactions)) {
        while (hasMore) {
          const request = {
            access_token: this.decryptAccessToken(plaidInfo.access_token),
            cursor: cursor,
            options: {
              include_personal_finance_category: true
            }
          };
          const response = await plaidClient.transactionsSync(request);
          const data = response.data;
          added = added.concat(data.added);
          modified = modified.concat(data.modified);
          removed = removed.concat(data.removed);
          hasMore = data.has_more;

          cursor = data.next_cursor;
        }
      }
    }

    return { added: added }
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the User\'s investment transactions as a JSON Object'
  })
  async getInvestmentTransactions(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi) {
    const findPlaidInfo = await this.getPlaidInfoByUser(user);
    if (!findPlaidInfo.length) throw new HttpException(409, "User has not connected to an Account through Plaid");

    const startDate = dayjs().subtract(30, 'days').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');

    try {
      let investment_transactions = [];
      for (const plaidInfo of findPlaidInfo) {
        if (plaidInfo.products.includes(Products.Investments)) {
          const configs = {
            access_token: this.decryptAccessToken(plaidInfo.access_token),
            start_date: startDate,
            end_date: today,
          };
          const investmentTransactionsResponse = await plaidClient.investmentsTransactionsGet(configs);
          investment_transactions = investment_transactions.concat(investmentTransactionsResponse.data.investment_transactions);
        }
      }
      return { investments_transactions: investment_transactions };
    } catch (error) {
      return error.response;
    }
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Get the User\'s Current Balance'
  })
  async getBalance(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi) {
    const findPlaidInfo = await this.getPlaidInfoByUser(user);
    if (!findPlaidInfo.length) throw new HttpException(409, "User has not connected to an Account through Plaid");


    let balances = [];
    for (const plaidInfo of findPlaidInfo) {
      const balanceResponse = await plaidClient.accountsBalanceGet({
        access_token: this.decryptAccessToken(plaidInfo.access_token)
      });
      balances = balances.concat(balanceResponse.data.accounts);
    }
    return { balance: balances };
  }


  @Authorized()
  @Query(() => [String], {
    description: 'Get a list of the user\'s connected bank accounts'
  })
  async getBankNames(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi) {
    const findPlaidInfo = await this.getPlaidInfoByUser(user);
    const bankNames = findPlaidInfo.map((plaidInfo) => plaidInfo.institution_name);

    return bankNames;
  }

  @Authorized()
  @Mutation(() => Boolean, {
    description: 'Remove the user\'s item'
  })
  async unlinkBank(@Arg('bankNames', (type) => [String]) bankNames: string[], @Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi) {
    const findPlaidInfo = await this.getPlaidInfoByUser(user);

    try {
      for (const bankName of bankNames) {
        const filteredPlaidInfo = findPlaidInfo.filter((plaidInfo) => plaidInfo.institution_name === bankName)
        if (!findPlaidInfo.length) throw new HttpException(409, `${bankName} does not exist on this user`);

        console.log(filteredPlaidInfo)
        const access_token = this.decryptAccessToken(filteredPlaidInfo[0].access_token)
        const request: ItemRemoveRequest = {
          access_token: access_token
        }
        console.log(request);
        const response = await plaidClient.itemRemove(request);
        console.log(response.data);
        PlaidInfo.delete({ id: filteredPlaidInfo[0].id });
        console.log(`Delete ${filteredPlaidInfo[0].id}`)
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  @Authorized()
  @Query(() => GraphQLJSON, {
    description: 'Plaid Institution Search'
  })
  async searchInstitution(@Ctx('plaidClient') plaidClient: PlaidApi) {
    const request: InstitutionsGetRequest = {
      count: 10,
      offset: 0,
      country_codes: [CountryCode.Ca],
    };
    try {
      const response = await plaidClient.institutionsGet(request);
      const institutions = response.data.institutions;
      return { institutions: institutions };
    } catch (error) {
      return error.response;
    }
  }

}