import {Request as ExRequest} from 'express';
import {Body, Controller, Get, Post, Request, Response, Route, Security, Tags} from 'tsoa';
import {injectable} from 'tsyringe';
import {AuthError} from '../authentication';
import {UserDto} from '../Entities/User';
import {LoginModel, LoginResponseModel} from '../Models/LoginModel';
import type {UnauthorizedErrorModel} from 'shared-types';
import {AuthService} from '../Services/AuthService';

@injectable()
@Route('auth')
@Tags('User')
@Response<UnauthorizedErrorModel>(401, 'Unauthorized')
export class AuthController extends Controller {

  constructor(
    private authService: AuthService
  ) {
    super();
  }

  @Post('login')
  public async login(@Body() requestBody: LoginModel): Promise<LoginResponseModel> {
    const data = await this.authService.login(requestBody.username, requestBody.password);
    if (data == null) {
      throw new AuthError('Invalid username or password');
    }

    return data;
  }

  @Get('me')
  @Security('jwt')
  public async getUserInfo(@Request() req: ExRequest): Promise<UserDto> {
    return req.user!;
  }

}
