import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    this.logger.log(`Validating user: ${username}`);
    
    const user = await this.usersService.validateUser(username, password);
    
    if (!user) {
      this.logger.warn(`Invalid credentials for user: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return user;
  }

  async login(user: User) {
    this.logger.log(`Generating JWT token for user: ${user.username}`);
    
    const payload = {
      username: user.username,
      sub: user._id,
      role: user.role,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}