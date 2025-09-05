import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CityResponseDto } from '../dto/city-swagger.dto';

export function ApiSearchCities() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar cidades por estado',
      description:
        'Lista todas as cidades de um estado específico ordenadas alfabeticamente',
    }),
    ApiQuery({
      name: 'stateId',
      required: true,
      description: 'ID do estado para filtrar as cidades',
      type: 'number',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de cidades encontradas',
      type: [CityResponseDto],
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
    ApiResponse({
      status: 400,
      description: 'Parâmetro stateId inválido',
      schema: {
        example: {
          statusCode: 400,
          message: 'stateId deve ser um número',
          error: 'Bad Request',
        },
      },
    }),
  );
}
