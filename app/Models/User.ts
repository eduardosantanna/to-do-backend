import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import ToDoListIten from './ToDoListIten'
import PhotoUser from './PhotoUser'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'firstName' })
  public firstName: string

  @column({ serializeAs: 'lastName' })
  public lastName: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @hasMany(() => ToDoListIten)
  public toDoListIten: HasMany<typeof ToDoListIten>

  @hasOne(() => PhotoUser)
  public PhotoUser: HasOne<typeof PhotoUser>

  @column({ serializeAs: 'rememberMeToken' })
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
