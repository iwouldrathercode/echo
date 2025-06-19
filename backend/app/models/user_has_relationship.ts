import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import RelationshipLookup from './relationship_lookup.js'

export default class UserHasRelationship extends BaseModel {
  static table = 'user_has_relationships'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare relatedUserId: number

  @column()
  declare relationshipId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'relatedUserId',
  })
  declare relatedUser: BelongsTo<typeof User>

  @belongsTo(() => RelationshipLookup, {
    foreignKey: 'relationshipId',
  })
  declare relationship: BelongsTo<typeof RelationshipLookup>
}
