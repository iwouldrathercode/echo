import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'people'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('avatar').nullable()
      table.string('name').notNullable()
      table.string('surname').notNullable()
      table.json('alias').nullable()
      table.dateTime('birth').nullable()
      table.dateTime('death').nullable()
      table.json('relations').nullable()
      table.string('gender', 1).nullable()
      table.text('about').nullable()
      table.string('nationality').nullable()
      table.string('place_of_birth').nullable()
      table.string('occupation').nullable()
      table.json('external_links').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
