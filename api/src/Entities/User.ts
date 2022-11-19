import {AutoMap} from '@automapper/classes';
import {randomBytes} from 'crypto';
import {Optional} from 'sequelize';
import {BeforeSave, BeforeValidate, Column, CreatedAt, DataType, DefaultScope, Model, PrimaryKey, Scopes, Table, UpdatedAt} from 'sequelize-typescript';

interface UserAttributes {
  id: number;
  name: string;
  password: string;
  securityStamp: string;
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

  @UpdatedAt
  @Column
    updatedAt!: Date;

  @BeforeSave
  static beforeSaveHook(instance: User) {
    instance.securityStamp = randomBytes(16).toString('hex');
  }

  @BeforeValidate
  static beforeValidateHook(instance: User) {
    // note: this is a hack to pass validation
    // this value will be overwritten later in the beforeSaveHook
    instance.securityStamp ??= '';
  }

}

export class UserDto {

  @AutoMap()
    id!: number;

  @AutoMap()
    name!: string;

}
