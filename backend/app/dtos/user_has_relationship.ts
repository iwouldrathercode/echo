import { BaseModelDto } from '@adocasts.com/dto/base'
import UserHasRelationship from '#models/user_has_relationship'
import UserDto from '#dtos/user'
import RelationshipLookupDto from '#dtos/relationship_lookup'

export default class UserHasRelationshipDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare relatedUserId: number
  declare relationshipId: number
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null
  declare relatedUser: UserDto | null
  declare relationship: RelationshipLookupDto | null

  constructor(userHasRelationship?: UserHasRelationship) {
    super()

    if (!userHasRelationship) return
    this.id = userHasRelationship.id
    this.userId = userHasRelationship.userId
    this.relatedUserId = userHasRelationship.relatedUserId
    this.relationshipId = userHasRelationship.relationshipId
    this.createdAt = userHasRelationship.createdAt.toISO()!
    this.updatedAt = userHasRelationship.updatedAt.toISO()!
    this.user = userHasRelationship.user && new UserDto(userHasRelationship.user)
    this.relatedUser = userHasRelationship.relatedUser && new UserDto(userHasRelationship.relatedUser)
    this.relationship = userHasRelationship.relationship && new RelationshipLookupDto(userHasRelationship.relationship)
  }
}