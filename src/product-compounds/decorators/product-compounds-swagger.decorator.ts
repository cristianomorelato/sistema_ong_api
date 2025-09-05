import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  CreateProductCompoundsSwaggerDto,
  ProductCompoundsResponseDto,
} from '../dto/product-compounds-swagger.dto';
import { UpdateProductCompoundsSwaggerDto } from '../dto/update-product-compounds-swagger.dto';

export function ApiCreateProductCompounds() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar composto de produto',
      description: 'Cria um novo composto de produto',
    }),
    ApiBody({
      type: CreateProductCompoundsSwaggerDto,
      description: 'Dados do composto a ser criado',
    }),
    ApiResponse({
      status: 201,
      description: 'Composto criado com sucesso',
      type: ProductCompoundsResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Já existe um composto com este nome',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe um composto com este nome.',
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

export function ApiUpdateProductCompounds() {
  return applyDecorators(
    ApiOperation({
      summary: 'Editar composto de produto',
      description: 'Edita um composto de produto existente pelo ID',
    }),
    ApiBody({
      type: UpdateProductCompoundsSwaggerDto,
      description: 'Dados do composto a serem atualizados',
    }),
    ApiResponse({
      status: 200,
      description: 'Composto atualizado com sucesso',
      type: ProductCompoundsResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Já existe um composto com este nome',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe um composto com este nome.',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
    ApiResponse({
      status: 404,
      description: 'Composto não encontrado',
    }),
  );
}

export function ApiFindAllProductCompounds() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar compostos de produto',
      description:
        'Lista todos os compostos de produto, com filtro opcional por nome, status e id',
    }),
    ApiQuery({
      name: 'name',
      required: false,
      description: 'Filtrar pelo nome do composto',
      example: 'CBD',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filtrar pelo status do composto',
      enum: ['ACTIVE', 'INACTIVE'],
      example: 'ACTIVE',
    }),
    ApiQuery({
      name: 'id',
      required: false,
      description: 'Filtrar pelo id do composto',
      example: 1,
      type: Number,
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de compostos de produto',
      type: ProductCompoundsResponseDto,
      isArray: true,
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}
