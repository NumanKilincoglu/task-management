import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { KnexService } from '../../database/knex/knex.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly knexService: KnexService,
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const knex = this.knexService.getKnex();

    const existingUser = await knex('users')
      .where('email', registerDto.email)
      .first();
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const [userId] = await knex('users').insert({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      phone: registerDto.phone || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const user = await knex('users')
      .where('id', userId)
      .select('id', 'name', 'email', 'phone', 'created_at', 'updated_at')
      .first();

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const knex = this.knexService.getKnex();

    const user = await knex('users')
      .where('email', loginDto.email)
      .select(
        'id',
        'email',
        'password',
        'name',
        'phone',
        'created_at',
        'updated_at',
      )
      .first();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;
    const accessToken = await this.jwtService.signAsync(payload);
    
    //tokeni email keyiyle redise kaydettik
    await this.redis.set(user.email, accessToken);

    return {
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    };
  }

  async logout(token: string, userEmail: string) {
    const tokenCache = await this.redis.get(userEmail);
    if (tokenCache && tokenCache === token) await this.redis.del(userEmail);
    return { message: 'Logout successful' };
  }
}
