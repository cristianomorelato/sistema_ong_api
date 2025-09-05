import { ApiProperty } from '@nestjs/swagger';

export class LoginSwaggerDto {
  @ApiProperty({
    example: 'admin@empresa.com',
    description: 'E-mail do usuário para login',
  })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha do usuário',
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT para autenticação',
  })
  access_token: string;
}

export class LoginErrorDto {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Credenciais inválidas' })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}
