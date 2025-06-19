import factory from '@adonisjs/lucid/factories'
import UserHasRelationship from '#models/user_has_relationship'
import { UserFactory } from './user_factory.js'
import { RelationshipLookupFactory } from './relationship_lookup_factory.js'

export const UserHasRelationshipFactory = factory
  .define(UserHasRelationship, async ({ faker }) => {
    return {
      // Default values will be overridden by relations when used with .with()
      userId: 1,
      relatedUserId: 1,
      relationshipId: 1,
    }
  })
  .relation('user', () => UserFactory)
  .relation('relatedUser', () => UserFactory)
  .relation('relationship', () => RelationshipLookupFactory)
  .build()
