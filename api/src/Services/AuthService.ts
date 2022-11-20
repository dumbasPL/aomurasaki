import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {injectable} from 'tsyringe';
import User, {UserDto} from '../Entities/User';
import {APP_SECRET} from '../env';
import {mapper} from '../mapper';
import UserService from './UserService';

@injectable()
export class AuthService {

  constructor(
    private userService: UserService,
  ) {}

  createToken(userId: number, securityStamp: string) {
    return jwt.sign({
      ss: securityStamp
    }, APP_SECRET, {
      subject: userId.toString(),
      expiresIn: '12h',
    });
  }

  async login(username: string, password: string): Promise<{ token: string; user: UserDto; } | null> {
    const user = await User.scope('auth').findOne({
      where: {name: username},
    });

    if (user == null) {
      return null;
    }

    // password will be set because we are using the auth scope
    if (!await bcrypt.compare(password, user.password!)) {
      return null;
    }

    const token = this.createToken(user.id, user.securityStamp!);

    return {
      token,
      user: mapper.map(user, User, UserDto),
    };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<string> {
    let user = await User.scope('auth').findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // password will be set because we are using the auth scope
    if (!await bcrypt.compare(currentPassword, user.password!)) {
      throw new Error('Invalid current password');
    }

    // update the password
    user = await this.userService.setPassword(user, newPassword);

    // generate a new token for the user
    const token = this.createToken(user.id, user.securityStamp!);

    return token;
  }

}
