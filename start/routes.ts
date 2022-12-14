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

Route.resource('/users', 'UsersController')
  .apiOnly()
  .middleware({ update: 'auth', destroy: 'auth', show: 'auth' })

Route.group(() => {
  Route.post('/photo', 'PhotoUsersController.store')
  Route.put('/photo', 'PhotoUsersController.update')
  Route.delete('/photo', 'PhotoUsersController.destroy')
}).middleware('auth')
