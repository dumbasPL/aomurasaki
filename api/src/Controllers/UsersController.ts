import {UnauthorizedErrorModel} from 'shared-types';
import {Body, Controller, Get, Put, Response, Route, Security, Tags} from 'tsoa';
import {injectable} from 'tsyringe';
import {PermissionScopeStrings} from '../authentication';
import {mapper} from '../mapper';
import UserService from '../Services/UserService';
import User, {UserDto} from '../Entities/User';
import {CreateUserModel} from '../Models/CreateUserModel';
import {BadRequestError} from '../lib/errorHandler';

@injectable()
@Route('Users')
@Tags('Users')
@Security('jwt', [PermissionScopeStrings.admin])
@Response<UnauthorizedErrorModel>(401, 'Unauthorized')
export class UsersController extends Controller {

  constructor(
    private userService: UserService,
  ) {
    super();
  }

  @Get()
  public async list(): Promise<UserDto[]> {
    const users = await this.userService.getUserList('admin');
    return mapper.mapArray(users, User, UserDto);
  }

  @Put()
  public async createUser(@Body() model: CreateUserModel): Promise<void> {
    if (await this.userService.findUserByName(model.username) != null) {
      throw new BadRequestError('Username already taken');
    }
    await this.userService.createUser(model.username, model.password, model.permissions);
  }

}
