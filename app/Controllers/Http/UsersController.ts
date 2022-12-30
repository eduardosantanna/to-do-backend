import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userData = await request.validate(UserValidator)
    const newUser = await User.create(userData)

    return response.created(newUser.id)
  }

  public async show({ response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user as User
    return response.ok(currentUser)
  }

  public async destroy({ response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user as User
    await currentUser.delete()
    return response.status(204)
  }
}
