import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  ProductTemporaryResponseDto,
  CreateProductTemporarySwaggerDto,
  FlowerGroupedResponseDto,
  CheckStockSwaggerDto,
  AddStockSwaggerDto,
  RemoveStockSwaggerDto,
  DebitStockBatchSwaggerDto,
  ReturnStockSwaggerDto,
  StockOperationResponseDto,
  CheckStockAvailabilityDto,
} from '../dto/product-temporary-swagger.dto';

export function ApiGetFlowersGrouped() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar produtos flowers agrupados por composto',
      description:
        'Retorna produtos do tipo flower agrupados por composto (THC, CBD, etc.)',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de produtos agrupados por composto',
      type: [FlowerGroupedResponseDto],
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}

export function ApiGetAllProducts() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar todos os produtos',
      description: 'Retorna todos os produtos da empresa logada',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de todos os produtos',
      type: [ProductTemporaryResponseDto],
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}

export function ApiCreateProduct() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar novo produto',
      description: 'Cria um novo produto no sistema',
    }),
    ApiBody({
      description: 'Dados do produto a ser criado',
    }),
    ApiResponse({
      status: 201,
      description: 'Produto criado com sucesso',
      type: ProductTemporaryResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
    ApiResponse({
      status: 400,
      description: 'Dados de entrada inválidos',
    }),
  );
}

export function ApiDebitStock() {
  return applyDecorators(
    ApiOperation({
      summary: 'Debitar estoque em lote',
      description: 'Remove quantidade de múltiplos produtos do estoque',
    }),
    ApiBody({
      type: DebitStockBatchSwaggerDto,
      description: 'Lista de produtos para debitar',
    }),
    ApiResponse({
      status: 200,
      description: 'Operação agendada com sucesso',
      schema: {
        example: { scheduled: true },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}

export function ApiCheckStock() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verificar se tem estoque',
      description:
        'Verifica se um produto tem quantidade suficiente em estoque',
    }),
    ApiBody({
      type: CheckStockSwaggerDto,
      description: 'Produto e quantidade a verificar',
    }),
    ApiResponse({
      status: 200,
      description: 'Resultado da verificação de estoque',
      schema: {
        type: 'boolean',
        example: true,
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}

export function ApiCheckStockAvailability() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verificar disponibilidade de produtos',
      description:
        'Verifica disponibilidade de múltiplos produtos e retorna detalhes',
    }),
    ApiBody({
      type: CheckStockAvailabilityDto,
      description: 'Lista de produtos para verificar',
    }),
    ApiResponse({
      status: 200,
      description: 'Disponibilidade dos produtos',
      schema: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ProductAvailabilityDto',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}

export function ApiReturnStock() {
  return applyDecorators(
    ApiOperation({
      summary: 'Agendar retorno de estoque',
      description:
        'Agenda o retorno de produtos ao estoque após um tempo determinado',
    }),
    ApiBody({
      type: ReturnStockSwaggerDto,
      description: 'Produtos para retornar e ID da transação',
    }),
    ApiResponse({
      status: 200,
      description: 'Retorno agendado com sucesso',
      schema: {
        example: { scheduled: true },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}

export function ApiAddStock() {
  return applyDecorators(
    ApiOperation({
      summary: 'Adicionar estoque',
      description: 'Adiciona quantidade ao estoque de um produto específico',
    }),
    ApiBody({
      type: AddStockSwaggerDto,
      description: 'Produto e quantidade a adicionar',
    }),
    ApiResponse({
      status: 200,
      description: 'Estoque adicionado com sucesso',
      type: StockOperationResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
    ApiResponse({
      status: 404,
      description: 'Produto não encontrado',
    }),
  );
}

export function ApiRemoveStock() {
  return applyDecorators(
    ApiOperation({
      summary: 'Remover estoque',
      description: 'Remove quantidade do estoque de um produto específico',
    }),
    ApiBody({
      type: RemoveStockSwaggerDto,
      description: 'Produto e quantidade a remover',
    }),
    ApiResponse({
      status: 200,
      description: 'Estoque removido com sucesso',
      type: StockOperationResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
    ApiResponse({
      status: 404,
      description: 'Produto não encontrado',
    }),
    ApiResponse({
      status: 400,
      description: 'Estoque insuficiente',
    }),
  );
}
