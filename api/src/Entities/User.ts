import {AutoMap} from '@automapper/classes';
import {randomBytes} from 'crypto';
import {Optional} from 'sequelize';
import {BeforeCreate, BeforeUpdate, Column, CreatedAt, DataType, DefaultScope, Model, PrimaryKey, Scopes, Table} from 'sequelize-typescript';

interface UserAttributes {
  id: number;
  name: string;
  password: string;
  securityStamp: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<Omit<UserAttributes, 'securityStamp'>, 'id'> {}

@Table
@DefaultScope(() => ({
  attributes: {
    exclude: ['password', 'securityStamp'],
  },
}))
@Scopes(() => ({
  auth: {
    attributes: ['id', 'name', 'password', 'securityStamp'],
  },
}))
export default class User extends Model<UserAttributes, UserCreationAttributes> {

  @AutoMap()
  @PrimaryKey
  @Column
    id!: number;

  @AutoMap()
  @Column({allowNull: false})
    name!: string;

  @Column({allowNull: false})
    password?: string;

  // 16 bytes hex string
  @Column({type: DataType.STRING(16 * 2), allowNull: false})
    securityStamp?: string;

  @CreatedAt
  @Column
    createdAt!: Date;

  @CreatedAt
  @Column
    updatedAt!: Date;

  @BeforeCreate
  @BeforeUpdate
  static updateSecurityStamp(instance: User) {
    instance.securityStamp = randomBytes(16).toString('hex');
  }

}

export class UserDto {

  @AutoMap()
    id!: number;

  @AutoMap()
    name!: string;

}
