import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Knex from 'knex';

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
  private knex: Knex.Knex;

  constructor(private configService: ConfigService) {
    this.knex = Knex({
      client: 'mysql2',
      connection: {
        host: this.configService.get<string>('DB_HOST', 'localhost'),
        port: this.configService.get<number>('DB_PORT', 3306),
        user: this.configService.get<string>('DB_USER', 'root'),
        password: this.configService.get<string>('DB_PASSWORD', ''),
        database: this.configService.get<string>('DB_NAME', 'task_manager'),
      },
      pool: {
        min: 0,
        max: 10,
      },
      migrations: {
        directory: './src/database/knex/migrations',
        tableName: 'knex_migrations',
      },
      acquireConnectionTimeout: 1000 * 60 * 60,
    });
  }

  async onModuleInit() {
    try {
      // Baglantiyi test et
      await this.waitForDatabaseReady();
      console.log('Successfully connected to MySQL database');

      // Migrationları calistir
      await this.knex.migrate.latest();
      console.log('Database migrations applied successfully');
    } catch (error) {
      console.error(`Failed to initialize database: ${error.message}`);
      throw new Error(`Database initialization failed: ${error.message}`);
    }
  }

  getKnex(): Knex.Knex {
    return this.knex;
  }

  async onModuleDestroy() {
    try {
      await this.knex.destroy();
      console.log('Database connection closed gracefully');
    } catch (error) {
      console.error(`Failed to close database connection: ${error.message}`);
    }
  }

  //veritabani dockerda ayaga kalkarken tekrar baglanmayi dener
  async waitForDatabaseReady(retries = 10, delay = 8000) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.knex.raw('SELECT 1');
        return;
      } catch (err) {
        Logger.warn(`Database not ready yet... (${i + 1}/${retries})`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    throw new Error('Database not available after multiple retries.');
  }
}
