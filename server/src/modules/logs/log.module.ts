import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { MongoModule } from 'src/database/mongo/mongo.module';
import { LogController } from './log-controller';

@Module({
  imports: [MongoModule],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
