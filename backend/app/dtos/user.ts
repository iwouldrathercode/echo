import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#models/user'
import UserHasRelationshipDto from '#dtos/user_has_relationship'

export default class UserDto extends BaseModelDto {
  declare id: number
  declare fullName: string | null
  declare email: string
  declare password: string
  declare createdAt: string
  declare updatedAt: string | null
  declare relationships: UserHasRelationshipDto[]
  declare inverseRelationships: UserHasRelationshipDto[]

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.fullName = user.fullName
    this.email = user.email
    this.password = user.password
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt?.toISO()!
    this.relationships = UserHasRelationshipDto.fromArray(user.relationships)
    this.inverseRelationships = UserHasRelationshipDto.fromArray(user.inverseRelationships)
  }
}