import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  CreateAdministratorSwaggerDto,
  AdministratorResponseDto,
} from '../dto/administrators-swagger.dto';
import { UpdateAdministratorSwaggerDto } from '../dto/update-administrator-swagger.dto';

export function ApiCreateAdministrator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar administrador',
      description:
        'Cria um novo administrador com endereço e usuário associados',
    }),
    ApiBody({
      type: CreateAdministratorSwaggerDto,
      description: 'Dados do administrador a ser criado',
    }),
    ApiResponse({
      status: 201,
      description: 'Administrador criado com sucesso',
      type: AdministratorResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'CPF inválido ou administrador já cadastrado',
      schema: {
        example: {
          statusCode: 409,
          message: 'Administrador já cadastrado com este CPF ou e-mail.',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}

export function ApiSearchAdministrators() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar administradores',
      description:
        'Lista administradores da empresa com filtros opcionais. Acesso restrito a ADMIN e MASTER.',
    }),
    ApiQuery({
      name: 'cpf',
      required: false,
      description: 'Filtrar por CPF (com ou sem formatação)',
      example: '12345678901',
    }),
    ApiQuery({
      name: 'name',
      required: false,
      description: 'Filtrar por nome (busca parcial, case-insensitive)',
      example: 'João',
    }),
    ApiQuery({
      name: 'phone',
      required: false,
      description: 'Filtrar por telefone (com ou sem formatação)',
      example: '11999999999',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filtrar por status',
      enum: ['ACTIVE', 'INACTIVE'],
      example: 'ACTIVE',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de administradores encontrados',
      type: [AdministratorResponseDto],
      schema: {
        example: [
          {
            id: 7,
            identifier: '33fe73ff-7e5b-42ea-800c-9fda0992020a',
            name: 'ADMABEC',
            cpf: '01011509032',
            dateOfBirth: '1983-01-01T00:00:00.000Z',
            gender: 'Masculino',
            phone: '21970662055',
            observations: 'Teste',
            status: 'ACTIVE',
            userId: 112,
            companyId: 1,
            address: {
              id: 129,
              street: 'Rua das Flores',
              number: '123',
              complement: 'Apto 45',
              neighborhood: 'Centro',
              cityId: 1,
              stateId: 1,
              zipCode: '01234567',
            },
            email: 'admabec@gmail.com',
          },
        ],
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - usuário sem permissão',
      schema: {
        example: {
          statusCode: 403,
          message: 'Acesso negado',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}

export function ApiUpdateAdministrator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Editar administrador',
      description:
        'Edita os dados do administrador, usuário e endereço pelo identifier',
    }),
    ApiBody({
      type: UpdateAdministratorSwaggerDto,
      description: 'Campos a serem atualizados do administrador',
    }),
    ApiResponse({
      status: 200,
      description: 'Administrador atualizado com sucesso',
      type: AdministratorResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'CPF ou e-mail já cadastrado',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe administrador com este CPF ou e-mail.',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Administrador não encontrado',
      schema: {
        example: {
          statusCode: 404,
          message: 'Administrador não encontrado.',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}
