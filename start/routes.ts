/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { API: 'Online' }
})
Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout')

Route.group(() => {
  Route.get('/users', 'UsersController.show').middleware('auth')
  Route.post('/users', 'UsersController.store')
  Route.delete('/users', 'UsersController.destroy').middleware('auth')
})

Route.group(() => {
  Route.post('/photo', 'PhotoUsersController.store')
  Route.put('/photo', 'PhotoUsersController.update')
  Route.delete('/photo', 'PhotoUsersController.destroy')
}).middleware('auth')

Route.group(() => {
  Route.post('/itens', 'ToDoListItensController.store')
  Route.put('/itens/:id', 'ToDoListItensController.update')
  Route.delete('/itens/:id', 'ToDoListItensController.destroy')
}).middleware('auth')
