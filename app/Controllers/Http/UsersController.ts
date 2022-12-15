import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
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
    await currentUser.load('PhotoUser')
    await currentUser.load('toDoListIten')

    if (currentUser.PhotoUser) {
      const photoUrl = await Drive.getSignedUrl(currentUser.PhotoUser.url, { expiresIn: '30mins' })
      currentUser.PhotoUser.url = photoUrl
    }

    return response.ok(currentUser)
  }

  public async destroy({ response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user as User
    await currentUser.delete()

    return response.status(204)
  }
}
