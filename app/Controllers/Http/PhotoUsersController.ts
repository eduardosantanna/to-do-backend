import Drive from '@ioc:Adonis/Core/Drive'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PhotoUsersController {
  public async store({ request, response, auth }: HttpContextContract) {
    const photo = request.file('photo')
    const currentUser = auth.use('api').user

    if (photo) {
      await Drive
      return response.ok('Foto recebida.')
    }

    return response.ok('Error')
  }
}
