import 'reflect-metadata';
import https from 'https';
import fs from 'fs';
import { ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS, PLAID_ENV, PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PRODUCTS, PLAID_COUNTRY_CODES, PLAID_REDIRECT_URI, PLAID_ANDROID_PACKAGE_NAME } from '@config';
import { dbConnection } from '@databases';
import { authMiddleware, authChecker } from '@middlewares/auth.middleware';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, responseLogger, errorLogger } from '@utils/logger';
import { createREAssetLoader } from '@utils/REAssetLoader';
import { createREReceiptLoader } from './utils/REReceiptLoader';
import { Configuration, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments } from 'plaid';
import { User } from './entities/users.entity';
import PlaidRepository from './repositories/plaid.repository';
import UserRepository from './repositories/users.repository';
import cron from 'node-cron';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public plaidClient: PlaidApi;
  public appDataSource: DataSource;
  private plaidSyncRate: string;

  constructor(resolvers, plaidSyncRate: string) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.plaidSyncRate = plaidSyncRate;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initPlaid();
    this.initApolloServer(resolvers);
    this.initializeErrorHandling();
  }

  // Sync Plaid
  syncPlaid = async () => {
    logger.info("Running Sync Plaid Scheduled Job");
    const userRepo = new UserRepository;
    const plaidRepo = new PlaidRepository;

    const findUsers = await User.find();
    for (const user of findUsers) {
      console.log(user);
      await plaidRepo.syncTransactions(user, this.plaidClient);
    }

    logger.info("Plaid Information Synced");
  };

  public async listen() {
    if (this.env === "production") {
      https.createServer(
        {
          key: fs.readFileSync("/etc/ssl/live/firecash.app/privkey.pem"),
          cert: fs.readFileSync("/etc/ssl/live/firecash.app/fullchain.pem"),
        },
        this.app
      ).listen(this.port, () => {
        logger.info(`=================================`);
        logger.info(`======= ENV: ${this.env} =======`);
        logger.info(`🚀 App listening on the port ${this.port}`);
        logger.info(`🎮 https://localhost:${this.port}/api/graphql`);
        logger.info(`=================================`);
        cron.schedule(this.plaidSyncRate, async () => this.syncPlaid());
      });
    } else {
      this.app.listen(this.port, () => {
        logger.info(`=================================`);
        logger.info(`======= ENV: ${this.env} =======`);
        logger.info(`🚀 App listening on the port ${this.port}`);
        logger.info(`🎮 http://localhost:${this.port}/api/graphql`);
        logger.info(`=================================`);

        cron.schedule(this.plaidSyncRate, async () => this.syncPlaid());
      });
    }
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    this.appDataSource = new DataSource(dbConnection);
    await this.appDataSource.initialize();
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(hpp());
      this.app.use(helmet());
    }

    this.app.use(cors({ origin: ['https://studio.apollographql.com', 'http://localhost:8000', 'http://localhost:3000'], credentials: CREDENTIALS }));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private async initPlaid() {
    /* Init the Plaid API */
    const configuration = new Configuration({
      basePath: PlaidEnvironments[PLAID_ENV],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_SECRET,
          'Plaid-Version': '2020-09-14'
        }
      }
    })

    this.plaidClient = new PlaidApi(configuration);
  }

  private async initApolloServer(resolvers) {
    const schema = await buildSchema({
      resolvers: resolvers,
      authChecker: authChecker,
    });

    const apolloServer = new ApolloServer({
      schema: schema,
      plugins: [
        this.env === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ],
      context: async ({ req, res }) => {
        try {
          const user = await authMiddleware(req);
          return {
            user,
            res,
            REAssetLoader: createREAssetLoader(),
            REReceiptLoader: createREReceiptLoader(),
            plaidClient: this.plaidClient
          };
        } catch (error) {
          throw new Error(error);
        }
      },
      formatResponse: (response, request) => {
        if (this.env != "test") {
          responseLogger(request);
        }

        return response;
      },
      formatError: error => {
        if (this.env != "test") {
          errorLogger(error);
        }

        return error;
      },

    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app: this.app, cors: ORIGIN, path: '/api/graphql' });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
