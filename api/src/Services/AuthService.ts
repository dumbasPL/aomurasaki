import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, {UserDto} from '../Entities/User';
import {APP_SECRET} from '../env';
import {mapper} from '../mapper';

// const BCRYPT_ROUNDS = 11;

export class AuthService {

  async login(username: string, password: string): Promise<{ token: string; user: UserDto; } | null> {
    const user = await User.scope('auth').findOne({
      where: {name: username},
    });

    if (user == null) {
      return null;
    }

    // password will be sat because we are using the auth scope
    if (!await bcrypt.compare(password, user.password!)) {
      return null;
    }

    const token = jwt.sign({
      ss: user.securityStamp!
    }, APP_SECRET, {
      subject: user.id.toString(),
      expiresIn: '12h',
    });

    return {
      token,
      user: mapper.map(user, User, UserDto),
    };
  }

}
