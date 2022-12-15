import Drive from '@ioc:Adonis/Core/Drive'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PhotoUser from 'App/Models/PhotoUser'

export default class PhotoUsersController {
  public async store({ request, response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user
    const photo = request.file('photo', {
      size: '5mb',
      extnames: ['png', 'jpg'],
    })

    if (!photo) return response.status(400).json({ error: 'No file forwarded' })

    if (!photo.isValid) {
      return response.status(400).json({
        error: `Your photo must have a maximum size of 5mb and be in .png or .jpg format`,
      })
    }

    await photo.moveToDisk('images', {}, 's3')

    await PhotoUser.create({
      url: photo.fileName,
      userId: currentUser?.id,
    })

    return response.created()
  }

  public async update() {}
}
