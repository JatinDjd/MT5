import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';

@ApiTags('Manager')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) { }


  // @Roles('customer')
  // @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Post('create-group')
  createGroup(@Body() createManagerDto: CreateGroupDto, @Request() req) {
    const userId = req.user.id;
    return this.managerService.createGroup(createManagerDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get('groups')
  findAllGroups() {
    return this.managerService.findAllGroups();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Patch('groups/:id')
  updateGroup(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managerService.updateGroup(+id, updateManagerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Delete('groups/:id')
  removeGroup(@Param('id') id: string) {
    return this.managerService.removeGroup(id);
  }
}
