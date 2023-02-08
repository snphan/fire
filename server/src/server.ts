import App from '@/app';
import validateEnv from '@utils/validateEnv';

import { authResolver } from '@resolvers/auth.resolver';
import { userResolver } from '@resolvers/users.resolver';
import { REAssetResolver } from './resolvers/re_analysis.resolver';
import { PlaidResolver } from './resolvers/plaid.resolver';
import { TransactionResolver } from './resolvers/transactions.resolver';
import { dbConnection } from './databases';

validateEnv();

async function main() {

  const app = new App(
    '0 1 * * *' // Everday at 1 am
  );

  await app.init([authResolver, userResolver, REAssetResolver, PlaidResolver, TransactionResolver]);

  app.listen();
}

main();


