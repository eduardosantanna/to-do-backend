import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ToDoListIten from 'App/Models/ToDoListIten'
import User from 'App/Models/User'
import ItenValidator from 'App/Validators/ItenValidator'

export default class ToDoListItensController {
  public async store({ request, response, auth }: HttpContextContract) {
    const currentUser = auth.use('api').user as User
    const dataItem = await request.validate(ItenValidator)
    const newItem = await ToDoListIten.create({ content: dataItem.content, userId: currentUser.id })
    return response.created(newItem.id)
  }
}
