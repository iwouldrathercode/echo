import { UserFactory } from '#database/factories/user_factory'
import { RelationshipLookupFactory } from '#database/factories/relationship_lookup_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // First create some relationship lookup records
    await RelationshipLookupFactory.createMany(4)

    // Then create users with relationships
    await UserFactory.with('relationships', 1).createMany(10)
  }
}
