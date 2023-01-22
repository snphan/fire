import { Configuration, PlaidApi, Products, PlaidEnvironments, LinkTokenCreateRequest } from 'plaid';
import { Arg, Ctx, Mutation, Query, Resolver, Authorized } from 'type-graphql';
import { CreateUserDto } from '@dtos/users.dto';
import UserRepository from '@repositories/users.repository';
import { User } from '@entities/users.entity';
import { PLAID_ANDROID_PACKAGE_NAME, PLAID_CLIENT_ID, PLAID_COUNTRY_CODES, PLAID_ENV, PLAID_PRODUCTS, PLAID_REDIRECT_URI, PLAID_SECRET } from '@/config';

@Resolver()
export class PlaidResolver {

  @Authorized()
  @Query(() => String, {
    description: 'Get the Link token as a JSON response'
  })
  async createLinkToken(@Ctx('user') user: User, @Ctx('plaidClient') plaidClient: PlaidApi) {
    const configs: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: 'user-id',
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

}