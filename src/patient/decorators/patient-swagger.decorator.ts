import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  CreatePatientSwaggerDto,
  PatientResponseDto,
} from '../dto/patient-swagger.dto';
import { UpdatePatientSwaggerDto } from '../dto/update-patient-swagger.dto';

export function ApiCreatePatient() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar paciente',
      description: 'Cria um novo paciente com endereço e usuário associados',
    }),
    ApiBody({
      type: CreatePatientSwaggerDto,
      description: 'Dados do paciente a ser criado',
    }),
    ApiResponse({
      status: 201,
      description: 'Paciente criado com sucesso',
      type: PatientResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'CPF inválido ou paciente já cadastrado',
      schema: {
        example: {
          statusCode: 409,
          message: 'Paciente já cadastrado com este CPF ou e-mail.',
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

export function ApiSearchPatients() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar pacientes',
      description:
        'Lista pacientes da empresa com filtros opcionais. Acesso restrito a ADMIN e RECEPTION.',
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
      example: 'Carlos',
    }),
    ApiQuery({
      name: 'phone',
      required: false,
      description: 'Filtrar por telefone (com ou sem formatação)',
      example: '11977889900',
    }),
    ApiQuery({
      name: 'email',
      required: false,
      description: 'Filtrar por e-mail (busca parcial, case-insensitive)',
      example: 'paciente@email.com',
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
      description: 'Lista de pacientes encontrados',
      type: [PatientResponseDto],
      schema: {
        example: [
          {
            id: 1,
            identifier: 'patient-uuid-321',
            name: 'Carlos Silva',
            cpf: '12345678901',
            dateOfBirth: '1985-12-10T00:00:00.000Z',
            gender: 'Masculino',
            phone: '11977889900',
            observations: 'Paciente com histórico de ansiedade',
            status: 'ACTIVE',
            userId: 1,
            companyId: 1,
            doctorId: 1,
            address: {
              id: 1,
              street: 'Rua das Acácias',
              number: '321',
              complement: 'Bloco B Apt 302',
              neighborhood: 'Vila Nova',
              cityId: 3,
              stateId: 1,
              zipCode: '01234567',
            },
            email: 'paciente@email.com',
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

export function ApiUpdatePatient() {
  return applyDecorators(
    ApiOperation({
      summary: 'Editar paciente',
      description:
        'Edita os dados do paciente, usuário e endereço pelo identifier',
    }),
    ApiBody({
      type: UpdatePatientSwaggerDto,
      description: 'Dados do paciente a serem atualizados',
    }),
    ApiResponse({
      status: 200,
      description: 'Paciente atualizado com sucesso',
      type: PatientResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'CPF ou e-mail já cadastrado',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe paciente com este CPF ou e-mail.',
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
