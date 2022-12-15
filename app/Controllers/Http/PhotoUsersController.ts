import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import PhotoUser from 'App/Models/PhotoUser'
import User from 'App/Models/User'

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

  public async update({ request, response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user as User
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

    const photoUser = await PhotoUser.findBy('user_id', currentUser.id)

    if (photoUser) {
      await Drive.delete(photoUser.url)
      await photo.moveToDisk('images', {}, 's3')
      await photoUser.merge({ url: photo.fileName }).save()
      return response.status(200)
    } else {
      return response.badRequest({ error: 'User does not have registered photos to be updated' })
    }
  }

  public async destroy({ response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user as User
    const photoUserCurrent = await PhotoUser.findBy('user_id', currentUser.id)

    if (!photoUserCurrent) {
      return response.status(204)
    }

    await photoUserCurrent.delete()
    await Drive.delete(photoUserCurrent.url)
    return response.status(200)
  }
}
