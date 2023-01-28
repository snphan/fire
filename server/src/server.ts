import App from '@/app';
import validateEnv from '@utils/validateEnv';

import { authResolver } from '@resolvers/auth.resolver';
import { userResolver } from '@resolvers/users.resolver';
import { REAssetResolver } from './resolvers/re_analysis.resolver';
import { PlaidResolver } from './resolvers/plaid.resolver';
import { createConnection } from 'typeorm';
import { dbConnection } from './databases';

// Sync Plaid
import UserRepository from '@repositories/users.repository';
import PlaidRespository from '@repositories/plaid.repository';
import { User } from './entities/users.entity';

validateEnv();

const app = new App([authResolver, userResolver, REAssetResolver, PlaidResolver]);

app.listen();

// Sync Plaid
const syncPlaid = async () => {
  const connection = await createConnection(dbConnection);
  const userRepo = new UserRepository;
  const plaidRepo = new PlaidRespository;

  const myUser = await User.findOne({ where: { id: 33 } });
  const plaidItems = await plaidRepo.getPlaidInfoByUser(myUser);
  await plaidRepo.syncTransactions(myUser, app.plaidClient);
  // console.log(plaidItems);
};

syncPlaid();
