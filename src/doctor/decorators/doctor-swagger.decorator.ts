import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  CreateDoctorSwaggerDto,
  DoctorResponseDto,
} from '../dto/doctor-swagger.dto';
import { UpdateDoctorSwaggerDto } from '../dto/update-doctor-swagger.dto';

export function ApiCreateDoctor() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar médico',
      description: 'Cria um novo médico com endereço e usuário associados',
    }),
    ApiBody({
      type: CreateDoctorSwaggerDto,
      description: 'Dados do médico a ser criado',
    }),
    ApiResponse({
      status: 201,
      description: 'Médico criado com sucesso',
      type: DoctorResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'CPF inválido ou médico já cadastrado',
      schema: {
        example: {
          statusCode: 409,
          message: 'Médico já cadastrado com este CPF ou e-mail.',
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

export function ApiSearchDoctors() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar médicos',
      description:
        'Lista médicos da empresa com filtros opcionais. Acesso restrito a ADMIN.',
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
      example: '11987654321',
    }),
    ApiQuery({
      name: 'email',
      required: false,
      description: 'Filtrar por e-mail (busca parcial, case-insensitive)',
      example: 'doutor@empresa.com',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filtrar por status',
      enum: ['ACTIVE', 'INACTIVE'],
      example: 'ACTIVE',
    }),
    ApiQuery({
      name: 'identifier',
      required: false,
      description: 'Filtrar por identifier (UUID do médico)',
      example: 'doctor-uuid-789',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de médicos encontrados',
      type: [DoctorResponseDto],
      schema: {
        example: [
          {
            id: 1,
            identifier: 'doctor-uuid-789',
            name: 'Dr. João Santos',
            cpf: '12345678901',
            documentDoctorType: 'CRM',
            documentDoctorNumber: '123456',
            documentDoctorUf: 'SP',
            phone: '11987654321',
            observations: 'Especialista em medicina canábica',
            status: 'ACTIVE',
            userId: 1,
            companyId: 1,
            address: {
              id: 1,
              street: 'Rua dos Médicos',
              number: '789',
              complement: 'Sala 101',
              neighborhood: 'Centro Médico',
              cityId: 1,
              stateId: 1,
              zipCode: '01234567',
            },
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

export function ApiUpdateDoctor() {
  return applyDecorators(
    ApiOperation({
      summary: 'Editar médico',
      description:
        'Edita os dados do médico, usuário e endereço pelo identifier',
    }),
    ApiBody({
      type: UpdateDoctorSwaggerDto,
      description: 'Campos a serem atualizados do médico',
    }),
    ApiResponse({
      status: 200,
      description: 'Médico atualizado com sucesso',
      type: DoctorResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'CPF, documento ou e-mail já cadastrado',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe médico com este CPF, documento ou e-mail.',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Médico não encontrado',
      schema: {
        example: {
          statusCode: 404,
          message: 'Médico não encontrado.',
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
