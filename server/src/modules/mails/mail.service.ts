import { Injectable } from '@nestjs/common';
import { CreateMailDto } from '../../common/dto/create-mail.dto';

@Injectable()
export class MailService {
  constructor() {}

  async sendMail(data: CreateMailDto) {
    console.log(`To: ${data.recipient}`);
    console.log(`Subject: ${data.subject}`);
    console.log(`Content: ${data.text}`);
  }
}
