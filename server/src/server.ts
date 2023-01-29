import App from '@/app';
import validateEnv from '@utils/validateEnv';

import { authResolver } from '@resolvers/auth.resolver';
import { userResolver } from '@resolvers/users.resolver';
import { REAssetResolver } from './resolvers/re_analysis.resolver';
import { PlaidResolver } from './resolvers/plaid.resolver';

validateEnv();

/* Export the app so we can use a the DB DataSource globally. refer to typeorm docs */
export const app = new App(
  [authResolver, userResolver, REAssetResolver, PlaidResolver],
  '0 1 * * *' // Everday at 1 am
);

app.listen();

