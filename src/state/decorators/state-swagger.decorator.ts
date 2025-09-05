import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StateResponseDto } from '../dto/state-swagger.dto';

export function ApiGetAllStates() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar todos os estados',
      description:
        'Retorna a lista completa de todos os estados do Brasil ordenados alfabeticamente',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de estados encontrados',
      type: [StateResponseDto],
    }),
    ApiResponse({
      status: 401,
      description: 'Token de autenticação inválido',
    }),
  );
}
