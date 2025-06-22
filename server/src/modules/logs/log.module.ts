import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { MongoModule } from 'src/database/mongo/mongo.module';

@Module({
  imports: [MongoModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
