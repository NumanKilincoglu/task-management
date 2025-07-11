import { Module, Global } from '@nestjs/common';
import { KnexService } from './knex.service';

@Global()
@Module({
  providers: [KnexService],
  exports: [KnexService],
})
export class KnexModule {}
