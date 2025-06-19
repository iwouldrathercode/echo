import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { UserHasRelationshipFactory } from './user_has_relationship_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123', // Will be hashed by the model
    }
  })
  .relation('relationships', () => UserHasRelationshipFactory)
  .build()
