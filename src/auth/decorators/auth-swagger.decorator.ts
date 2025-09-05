import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  LoginSwaggerDto,
  LoginResponseDto,
  LoginErrorDto,
} from '../dto/auth-swagger.dto';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Realizar login',
      description:
        'Autentica o usuário e retorna um token JWT para acesso aos endpoints protegidos',
    }),
    ApiBody({
      type: LoginSwaggerDto,
      description: 'Credenciais de login do usuário',
    }),
    ApiResponse({
      status: 201,
      description: 'Login realizado com sucesso',
      type: LoginResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Credenciais inválidas',
      type: LoginErrorDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Dados de entrada inválidos',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email', 'password should not be empty'],
          error: 'Bad Request',
        },
      },
    }),
  );
}
