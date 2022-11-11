import {Request as ExRequest} from 'express';
import {Body, Controller, Post, Route, Tags, Get, Security, Request} from 'tsoa';
import {injectable} from 'tsyringe';
import {AuthError} from '../authentication';
import {UserDto} from '../Entities/User';
import {LoginModel, LoginResponseModel} from '../Models/LoginModel';
import {AuthService} from '../Services/AuthService';

@injectable()
@Route('auth')
@Tags('User')
export class AuthController extends Controller {

  constructor(
    private authService: AuthService
  ) {
    super();
  }

  /**
   * @param unauthorizedResponse Unauthorized
   */
  @Post('login')
  public async login(@Body() requestBody: LoginModel): Promise<LoginResponseModel> {
    const data = await this.authService.login(requestBody.password, requestBody.password);
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
