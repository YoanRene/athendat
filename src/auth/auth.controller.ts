import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';

class LoginDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales de usuario',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged in',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Body() loginDto: { username: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log(`Login attempt for user: ${loginDto.username}`);
    
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    
    const result = await this.authService.login(user);
    
    // Set JWT as HTTP-only cookie
    response.cookie('jwt', result.access_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
      sameSite: 'strict',
      path: '/',
    });
    
    return result;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User has been logged out' })
  logout(@Res({ passthrough: true }) response: Response) {
    this.logger.log('User logout');
    
    // Clear the JWT cookie
    response.clearCookie('jwt');
    
    return { message: 'Logout successful' };
  }
}