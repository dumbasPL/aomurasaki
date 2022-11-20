import bcrypt from 'bcrypt';
import {BCRYPT_ROUNDS} from '../consts';
import User from '../Entities/User';
import {INITIAL_PASSWORD, INITIAL_USERNAME} from '../env';
import logger from '../logger';
import {generate as generatePassword} from 'generate-password';

export default class UserService {

  async createUser(name: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    return await User.create({
      name: name,
      password: passwordHash,
    });
  }

  async createInitialUser() {
    const usersCount = await User.count();
    if (usersCount > 0) {
      return;
    }

    const username = INITIAL_USERNAME ?? 'admin';
    let password = INITIAL_PASSWORD;

    let printPassword = false;
    if (!password) {
      logger.info('INITIAL_PASSWORD not set, generating random password for the initial user');

      password = generatePassword({
        length: 12,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: false,
        strict: false,
        excludeSimilarCharacters: true,
      });

      printPassword = true;
    }

    const user = await this.createUser(username, password);
    if (printPassword) {
      logger.info(`Initial user created (ID: ${user.id})\n\tUsername: ${username}\n\tPassword: ${password}`);
      logger.warn('PLEASE CHANGE THE PASSWORD AFTER LOGGING IN !!!');
    } else {
      logger.info(`Initial user created (ID: ${user.id}, Username: ${username})`);
    }
  }

  async setPassword(user: User, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    user.password = passwordHash;
    return await user.save();
  }

}
