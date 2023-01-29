import App from '@/app';
import validateEnv from '@utils/validateEnv';

import { authResolver } from '@resolvers/auth.resolver';
import { userResolver } from '@resolvers/users.resolver';
import { REAssetResolver } from './resolvers/re_analysis.resolver';
import { PlaidResolver } from './resolvers/plaid.resolver';

validateEnv();

const app = new App(
  [authResolver, userResolver, REAssetResolver, PlaidResolver],
  '*/30 * * * * *'
);

app.listen();

