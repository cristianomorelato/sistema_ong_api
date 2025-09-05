import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';
import { UpdatePrescriptionDto } from '../dto/update-prescription.dto';
import { PrescriptionResponseDto } from '../dto/prescription-response.dto';
import { Status } from '@prisma/client';

export function ApiCreatePrescription() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar prescrição',
      description: 'Cria uma nova prescrição com permissões associadas.',
    }),
    ApiBody({
      type: CreatePrescriptionDto,
      description: 'Dados da prescrição a ser criada',
      schema: {
        example: {
          patientId: 1,
          doctorId: 1,
          prescriptionDate: '2025-09-02T12:00:00.000Z',
          validityDays: 30,
          linkPrescription: 'https://meulink.com/prescricao.pdf',
          disease: 'Diabetes',
          observations: 'Tomar em jejum',
          status: 'ACTIVE',
          prescriptionPermissions: [
            { productCompoundsId: 2, productTypeId: 2, monthlyLimit: 15 },
            { productCompoundsId: 2, productTypeId: 1, monthlyLimit: 5 },
          ],
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Prescrição criada com sucesso',
      type: PrescriptionResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Token de autenticação inválido' }),
    ApiBearerAuth(),
    ApiTags('Prescriptions'),
  );
}

export function ApiUpdatePrescription() {
  return applyDecorators(
    ApiOperation({
      summary: 'Editar prescrição',
      description: 'Edita uma prescrição existente pelo identifier.',
    }),
    ApiBody({
      type: UpdatePrescriptionDto,
      description: 'Dados da prescrição a serem atualizados',
      schema: {
        example: {
          patientId: 1,
          doctorId: 1,
          prescriptionDate: '2025-09-02T12:00:00.000Z',
          validityDays: 30,
          linkPrescription: 'https://meulink.com/prescricao.pdf',
          disease: 'Diabetes',
          observations: 'Tomar em jejum',
          status: 'ACTIVE',
          prescriptionPermissions: [
            { productCompoundsId: 2, productTypeId: 2, monthlyLimit: 15 },
            { productCompoundsId: 2, productTypeId: 1, monthlyLimit: 5 },
          ],
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Prescrição atualizada com sucesso',
      type: PrescriptionResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Token de autenticação inválido' }),
    ApiBearerAuth(),
    ApiTags('Prescriptions'),
  );
}

export function ApiGetPrescriptions() {
  return applyDecorators(
    ApiOperation({
      summary: 'Consultar prescrições',
      description:
        'Consulta prescrições filtrando por paciente e outros parâmetros.',
    }),
    ApiQuery({
      name: 'patientId',
      required: true,
      type: Number,
      description: 'ID do paciente',
    }),
    ApiQuery({
      name: 'doctorId',
      required: false,
      type: Number,
      description: 'ID do médico',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: Status,
      description: 'Status da prescrição',
    }),
    ApiQuery({
      name: 'disease',
      required: false,
      type: String,
      description: 'Doença',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de prescrições encontradas',
      type: [PrescriptionResponseDto],
    }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Token de autenticação inválido' }),
    ApiBearerAuth(),
    ApiTags('Prescriptions'),
  );
}
