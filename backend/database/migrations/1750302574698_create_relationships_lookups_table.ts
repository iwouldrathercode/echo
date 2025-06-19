import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'relationships_lookup'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.enum('relationship', [
        'mother',
        'father',
        'son',
        'daughter',
        'brother',
        'sister',
        'grandfather',
        'grandmother',
        'grandson',
        'granddaughter',
        'uncle',
        'aunt',
        'nephew',
        'niece',
        'cousin',
        'husband',
        'wife',
        'father_in_law',
        'mother_in_law',
        'son_in_law',
        'daughter_in_law',
        'brother_in_law',
        'sister_in_law',
        'stepfather',
        'stepmother',
        'stepson',
        'stepdaughter',
        'stepbrother',
        'stepsister'
      ]).notNullable()
      table.string('locale', 10).notNullable().defaultTo('en_US')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Add unique constraint for relationship + locale combination
      table.unique(['relationship', 'locale'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
