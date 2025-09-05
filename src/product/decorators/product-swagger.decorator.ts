import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import {
  CreateProductSwaggerDto,
  ProductResponseDto,
} from '../dto/product-swagger.dto';
import { UpdateProductSwaggerDto } from '../dto/update-product-swagger.dto';

export function ApiCreateProduct() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar produto',
      description: 'Cria um novo produto',
    }),
    ApiBody({
      type: CreateProductSwaggerDto,
      description: 'Dados do produto a ser criado',
    }),
    ApiResponse({
      status: 201,
      description: 'Produto criado com sucesso',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Já existe um produto com este nome nesta empresa',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe um produto com este nome nesta empresa.',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Token de autenticação inválido' }),
  );
}

export function ApiFindAllProduct() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar produtos',
      description: 'Lista todos os produtos, com filtros opcionais',
    }),
    ApiQuery({
      name: 'name',
      required: false,
      description: 'Filtrar pelo nome do produto',
      example: 'Produto X',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filtrar pelo status',
      example: 'ACTIVE',
    }),
    ApiQuery({
      name: 'productTypeId',
      required: false,
      description: 'Filtrar pelo ID do tipo de produto',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de produtos',
      type: ProductResponseDto,
      isArray: true,
    }),
    ApiResponse({ status: 401, description: 'Token de autenticação inválido' }),
  );
}

export function ApiFindProductById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar produto por ID',
      description: 'Busca um produto pelo ID',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID do produto',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Produto encontrado',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Produto não encontrado',
      schema: {
        example: {
          statusCode: 404,
          message: 'Produto não encontrado.',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Token de autenticação inválido' }),
  );
}

export function ApiUpdateProduct() {
  return applyDecorators(
    ApiOperation({
      summary: 'Editar produto',
      description: 'Edita um produto existente pelo ID',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID do produto',
      example: 1,
    }),
    ApiBody({
      type: UpdateProductSwaggerDto,
      description: 'Dados do produto a serem atualizados',
    }),
    ApiResponse({
      status: 200,
      description: 'Produto atualizado com sucesso',
      type: ProductResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Já existe um produto com este nome nesta empresa',
      schema: {
        example: {
          statusCode: 409,
          message: 'Já existe um produto com este nome nesta empresa.',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Produto não encontrado',
      schema: {
        example: {
          statusCode: 404,
          message: 'Produto não encontrado.',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Token de autenticação inválido' }),
  );
}
