import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UserHasRelationship from './user_has_relationship.js'

export default class RelationshipLookup extends BaseModel {
  static table = 'relationships_lookup'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare relationship: string

  @column()
  declare locale: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => UserHasRelationship, {
    foreignKey: 'relationshipId',
  })
  declare userRelationships: HasMany<typeof UserHasRelationship>
}
