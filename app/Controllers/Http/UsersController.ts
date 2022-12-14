import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userData = await request.validate(UserValidator)
    const newUser = await User.create(userData)

    return response.created(newUser.id)
  }

  public async show({ request, response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user
    const { id } = request.params()
    const findedUser = await User.query().where({ id }).preload('PhotoUser').preload('toDoListIten')

    if (currentUser?.id !== Number(id)) return response.unauthorized()

    return response.ok(findedUser)
  }

  public async destroy({ response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user
    await currentUser?.delete()
    return response.status(204)
  }
}
