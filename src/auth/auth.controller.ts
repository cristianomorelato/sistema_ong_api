import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { UserType } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ApiLogin } from './decorators/auth-swagger.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // @Post('register')
  // async register(
  //   @Body('user_type') useer_type: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.createUser(
  //     useer_type as UserType,
  //     email,
  //     password,
  //   );
  // }

  @Post('login')
  @ApiLogin()
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ access_token: string }> {
    const user = (await this.authService.validateUser(email, password)) as {
      identifier: string | null;
      name: string | null;
      email: string;
      userType: string;
      companyId: number;
    };
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.authService.login(user);
  }
}
