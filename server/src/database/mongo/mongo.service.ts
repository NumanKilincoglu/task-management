import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      if (this.connection.readyState === 1) {
        console.log('Successfully connected to MongoDB');
      } else {
        console.warn(
          'MongoDB connection not ready, current state: ' +
            this.connection.readyState,
        );
      }
    } catch (error) {
      console.error(`Failed to connect to MongoDB: ${error.message}`);
      throw new Error(`MongoDB initialization failed: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      await this.connection.close();
      console.log('MongoDB connection closed gracefully');
    } catch (error) {
      console.error(`Failed to close MongoDB connection: ${error.message}`);
    }
  }
}
