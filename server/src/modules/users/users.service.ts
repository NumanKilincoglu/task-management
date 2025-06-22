import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/database/knex/knex.service';

@Injectable()
export class UsersService {
  constructor(private readonly knexService: KnexService) {}

  async findOne(id: number) {
    const knex = this.knexService.getKnex();
    return knex('users').where({ id }).first();
  }
}
