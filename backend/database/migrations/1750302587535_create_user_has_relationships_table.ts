import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_has_relationships'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.integer('related_user_id').unsigned().notNullable()
      table.integer('relationship_id').unsigned().notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Foreign key constraints
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('related_user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('relationship_id').references('id').inTable('relationships_lookup').onDelete('CASCADE')

      // Ensure a user can't have the same relationship with the same person twice
      // table.unique(['user_id', 'related_user_id', 'relationship_id'])

      // Add indexes for better query performance
      table.index(['user_id'])
      table.index(['related_user_id'])
      table.index(['relationship_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
