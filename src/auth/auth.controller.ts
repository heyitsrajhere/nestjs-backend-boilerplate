import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterface } from 'src/interface';
import { JwtAuthGuard, RoleGuard } from './Guards';
import { Roles } from 'src/decorators';
import { ErrorMessages, Routes, SuccessMessages } from 'src/messages';
import { RolesEnum } from 'src/Enum';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post(Routes.register)
  @ApiOperation({ summary: SuccessMessages.registerUser })
  @ApiResponse({
    status: 201,
    description: SuccessMessages.registerSuccessfully,
    type: RegisterDto,
  })
  @ApiResponse({ status: 400, description: ErrorMessages.badRequest })
  async register(
    @Body() body: RegisterDto,
  ): Promise<ResponseInterface<RegisterDto>> {
    return this.authService.register(body);
  }

  @Post(Routes.login)
  @ApiOperation({ summary: SuccessMessages.loginUser })
  @ApiResponse({
    status: 200,
    description: SuccessMessages.loginSuccessfully,
    type: LoginDto,
  })
  @ApiResponse({ status: 401, description: ErrorMessages.unauthorized })
  async login(
    @Body() body: LoginDto,
  ): Promise<ResponseInterface<{ accessToken: string }>> {
    return this.authService.login(body);
  }

  @ApiBearerAuth()
  @Post(Routes.protected)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({ summary: SuccessMessages.protectedRoute })
  async protectedRoute(@Request() req) {
    return { message: SuccessMessages.routeAccessed, user: req.user };
  }
}
