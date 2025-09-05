import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { identifier, name } = (() => {
        switch (user.userType) {
          case 'ADMIN':
            return user.administrators?.[0] ?? { identifier: null, name: null };
          case 'DOCTOR':
            return user.doctor?.[0] ?? { identifier: null, name: null };
          case 'PATIENT':
            return user.patients?.[0] ?? { identifier: null, name: null };
          case 'RECEPTION':
            return user.reception?.[0] ?? { identifier: null, name: null };
          default:
            return { identifier: null, name: null };
        }
      })();

      let companyId: number | null = null;
      switch (user.userType) {
        case 'ADMIN':
          companyId = user.administrators?.[0]?.companyId;
          break;
        case 'PATIENT':
          companyId = user.patients?.[0]?.companyId ?? null;
          break;
        case 'RECEPTION':
          companyId = user.reception?.[0]?.companyId ?? null;
          break;
        default:
          companyId = null;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return { ...result, identifier, name, companyId };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  login(user: {
    identifier: string | null;
    name: string | null;
    email: string;
    userType: string;
    companyId: number | null;
  }) {
    const payload = {
      identifier: user.identifier,
      name: user.name,
      email: user.email,
      userType: user.userType,
      company_id: user.companyId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
