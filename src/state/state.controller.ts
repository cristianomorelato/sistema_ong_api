import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StateService } from './state.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiGetAllStates } from './decorators/state-swagger.decorator';

@ApiTags('States')
@ApiBearerAuth()
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiGetAllStates()
  async findAll() {
    return this.stateService.findAll();
  }
}
