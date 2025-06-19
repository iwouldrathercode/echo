import { BaseModelDto } from '@adocasts.com/dto/base'
import RelationshipLookup from '#models/relationship_lookup'
import UserHasRelationshipDto from '#dtos/user_has_relationship'

export default class RelationshipLookupDto extends BaseModelDto {
  declare id: number
  declare relationship: string
  declare locale: string
  declare createdAt: string
  declare updatedAt: string
  declare userRelationships: UserHasRelationshipDto[]

  constructor(relationshipLookup?: RelationshipLookup) {
    super()

    if (!relationshipLookup) return
    this.id = relationshipLookup.id
    this.relationship = relationshipLookup.relationship
    this.locale = relationshipLookup.locale
    this.createdAt = relationshipLookup.createdAt.toISO()!
    this.updatedAt = relationshipLookup.updatedAt.toISO()!
    this.userRelationships = UserHasRelationshipDto.fromArray(relationshipLookup.userRelationships)
  }
}