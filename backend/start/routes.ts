/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const RelationshipsController = () => import('#controllers/relationships_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  router.resource('users', UsersController).as('api.v1.users')
  router.resource('relationships', RelationshipsController).as('api.v1.relationships')
}).prefix('api/v1')