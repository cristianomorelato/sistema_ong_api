import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  CreateReceptionSwaggerDto,
  ReceptionResponseDto,
} from '../dto/reception-swagger.dto';
import { UpdateReceptionSwaggerDto } from '../dto/update-reception-swagger.dto';

export function ApiCreateReception() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar recepcionista',
      description:
        'Cria um novo recepcionista com endereço e usuário associados',
    }),
    ApiBody({
      type: CreateReceptionSwaggerDto,
      description: 'Dados do recepcionista a ser criado',
    }),
    ApiResponse({
      status: 201,
      description: 'Recepcionista criado com sucesso',
      type: ReceptionResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'CPF inválido ou recepcionista já cadastrado',
      schema: {
        example: {
          statusCode: 409,
          message: 'Acolhimento já cadastrado com este CPF ou e-mail.',
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

export function ApiSearchReceptions() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar recepcionistas',
      description:
        'Lista recepcionistas da empresa com filtros opcionais. Acesso restrito a ADMIN e RECEPTION.',
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
      example: 'Maria',
    }),
    ApiQuery({
      name: 'phone',
      required: false,
      description: 'Filtrar por telefone (com ou sem formatação)',
      example: '11988887777',
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
      description: 'Lista de recepcionistas encontrados',
      type: [ReceptionResponseDto],
      schema: {
        example: [
          {
            id: 10,
            identifier: 'ee86e987-7114-4484-94b0-fe2c587d016a',
            name: 'Maria Oliveira',
            cpf: '54845132001',
            dateOfBirth: '1990-05-20T00:00:00.000Z',
            gender: 'Feminino',
            phone: '11999998888',
            observations: 'Atualização via Postman',
            status: 'ACTIVE',
            userId: 104,
            companyId: 1,
            address: {
              id: 121,
              street: 'Rua das Palmeiras',
              number: '456',
              complement: 'Casa 2',
              neighborhood: 'Jardim América',
              cityId: 2,
              stateId: 1,
              zipCode: '01234567',
            },
            email: 'acolhiedfd@email.com',
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

export function ApiUpdateReception() {
  return applyDecorators(
    ApiOperation({
      summary: 'Editar acolhimento',
      description:
        'Edita os dados do acolhido, usuário e endereço pelo identifier',
    }),
    ApiBody({
      type: UpdateReceptionSwaggerDto,
      description: 'Dados do acolhido a serem atualizados',
    }),
    ApiResponse({
      status: 200,
      description: 'Acolhido atualizado com sucesso',
      type: ReceptionResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'CPF ou e-mail já cadastrado',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe acolhimento com este CPF ou e-mail.',
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
