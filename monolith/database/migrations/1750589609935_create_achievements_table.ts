import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'achievements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('description', 600).nullable()
      table.string('awarded_by').notNullable()
      table.string('url').nullable()
      table.dateTime('valid_from').notNullable()
      table.dateTime('valid_to').nullable()
      table.string('avatar').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
