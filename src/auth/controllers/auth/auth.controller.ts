import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Render, Request, Res, UseGuards, Redirect, HttpCode, Session } from '@nestjs/common';

import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto } from '../../dto/createUser.dto';
import { LoginDto } from '../../dto/login.dto';
import { AuthService } from '../../services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { EmailVerificationDto } from '../../dto/emailVerification.dto';
import { MailService } from '../../../mail/mail.service';
import { ForgotPasswordLinkDto } from '../../dto/forgotPassword.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,

  ) { }


  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const token = Math.floor(1000 + Math.random() * 9000).toString();
      const user = await this.authService.createUser({
        ...createUserDto,
        token,
      });
      await this.mailService.sendUserConfirmation(user, token);
      
    } catch (error) {
      switch (error.status) {
        case 422:
          throw new HttpException(
            {
              error: 'Email already taken',
            },
            HttpStatus.BAD_REQUEST,
          );

        default:
          throw new HttpException(
            { error: 'Internal Server Error' },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  @Post('register')
  @HttpCode(201)
  async registerWeb(@Body() createUserDto: CreateUserDto) {
    try {
      const token = Math.floor(1000 + Math.random() * 9000).toString();
      const user = await this.authService.createUser({
        ...createUserDto,
        token,
      });
      // const token = user.id;
      await this.mailService.sendUserConfirmation(user, token);
      
      // if (user?.firstName != null) {
      //   Redirect('/api/auth/signup-success');
      // }

    
      return( {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      
    } catch (error) {
      switch (error.response.statusCode) {
        case '422':
          throw new HttpException(
            {
              error: 'Email already taken',
            },
            HttpStatus.BAD_REQUEST,
          );

        default:
          throw new HttpException(
            { error: 'Internal Server Error' },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }


  @Get('signup-view')
  @Render('signUp') // Specify the template name (without .hbs extension)
  getSignUp() {
    return {} ; // Pass data to the template
  }


  @Get('signup-success')
  @Render('signUpSuccess') // Specify the success template name (without .hbs extension)
  getSignUpSuccess() {
    return {}; // No data needs to be passed to the template
  }

  @Get('login-page')
  @Render('login') // Specify the success template name (without .hbs extension)
  loginPage() {
    return {}; // No data needs to be passed to the template
  }


  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  async login(@Body() data: LoginDto, @Request() req, @Session() session) {
    const result = await this.authService.login(req.user);

    // Store tokens in session (you can also use cookies or local storage)
    session.accessToken = result.accessToken;
    session.refreshToken = result.refreshToken;
    
    return result;
  }

  @Get('confirm')
  async confirmEmail(@Query() query: EmailVerificationDto) {
    const isVerified = await this.authService.verify(query.token);
    if (!!isVerified) {
      return '<h1>Email Verified Successfully, You can login with your credentials</h1>';
    }
    return '<h1>Something went wrong, Please try again.</h1>';
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() data: ForgotPasswordLinkDto) {
    return this.authService.forgotPassword(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get('profile')
  async getClientProfile(@Request() req) {
    return await this.authService.getProfile(req.user.id);
  }
}
