import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CityService } from './city.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiSearchCities } from './decorators/city-swagger.decorator';

@ApiTags('Cities')
@ApiBearerAuth()
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  @ApiSearchCities()
  async search(@Query('stateId') stateId: string) {
    return this.cityService.findByStateId(Number(stateId));
  }
}
