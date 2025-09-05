import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  CreateProductTypeSwaggerDto,
  ProductTypeResponseDto,
} from '../dto/product-type-swagger.dto';
import { UpdateProductTypeSwaggerDto } from '../dto/update-product-type-swagger.dto';

export function ApiCreateProductType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar tipo de produto',
      description: 'Cria um novo tipo de produto',
    }),
    ApiBody({
      type: CreateProductTypeSwaggerDto,
      description: 'Dados do tipo de produto a ser criado',
    }),
    ApiResponse({
      status: 201,
      description: 'Tipo de produto criado com sucesso',
      type: ProductTypeResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Já existe um tipo de produto com este nome e unidade',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe um tipo de produto com este nome e unidade.',
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

export function ApiUpdateProductType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Editar tipo de produto',
      description: 'Edita um tipo de produto existente pelo ID',
    }),
    ApiBody({
      type: UpdateProductTypeSwaggerDto,
      description: 'Dados do tipo de produto a serem atualizados',
    }),
    ApiResponse({
      status: 200,
      description: 'Tipo de produto atualizado com sucesso',
      type: ProductTypeResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Já existe um tipo de produto com este nome e unidade',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe um tipo de produto com este nome e unidade.',
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
      description: 'Tipo de produto não encontrado',
    }),
  );
}

export function ApiFindAllProductType() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar tipos de produto',
      description:
        'Lista todos os tipos de produto, com filtro opcional por nome, status e id',
    }),
    ApiQuery({
      name: 'name',
      required: false,
      description: 'Filtrar pelo nome do tipo de produto',
      example: 'Flor',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filtrar pelo status do tipo de produto',
      enum: ['ACTIVE', 'INACTIVE'],
      example: 'ACTIVE',
    }),
    ApiQuery({
      name: 'id',
      required: false,
      description: 'Filtrar pelo id do tipo de produto',
      example: 1,
      type: Number,
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de tipos de produto',
      type: ProductTypeResponseDto,
      isArray: true,
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}
