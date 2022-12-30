import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ToDoListIten from 'App/Models/ToDoListIten'
import User from 'App/Models/User'
import ItenValidator from 'App/Validators/ItenValidator'

export default class ToDoListItensController {
  public async index({ response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user as User
    const tasks = await ToDoListIten.query().andWhere({ user_id: currentUser.id })
    return response.ok(tasks)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user as User
    const dataItem = await request.validate(ItenValidator)
    const newItem = await ToDoListIten.create({ content: dataItem.content, userId: currentUser.id })
    return response.created(newItem.id)
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()
    const currentUser = auth.use('api').user as User
    const newDataItem = await request.validate(ItenValidator)
    const dataItem = await ToDoListIten.findBy('id', Number(id))

    if (!dataItem) return response.notFound({ error: 'Task not found' })
    if (dataItem.userId !== currentUser.id) return response.unauthorized()

    await dataItem.merge({ content: newDataItem.content, completed: newDataItem.completed }).save()

    return response.status(200)
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    const { id } = request.params()
    const currentUser = auth.use('api').user as User
    const dataTask = await ToDoListIten.findBy('id', Number(id))

    if (!dataTask) return response.notFound({ error: 'Task not found' })
    if (dataTask.userId !== currentUser.id) return response.unauthorized()

    await dataTask.delete()

    return response.status(200)
  }
}
