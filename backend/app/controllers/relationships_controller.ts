import type { HttpContext } from '@adonisjs/core/http'
import UserHasRelationship from '#models/user_has_relationship'
import UserHasRelationshipDto from '#dtos/user_has_relationship'
import User from '#models/user'
import RelationshipLookup from '#models/relationship_lookup'

export default class RelationshipsController {
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    try {
      const { userId, relatedUserId, relationshipId } = request.qs()

      const query = UserHasRelationship.query()
        .preload('user')
        .preload('relatedUser')
        .preload('relationship')

      // Apply filters if provided
      if (userId) {
        query.where('userId', userId)
      }
      if (relatedUserId) {
        query.where('relatedUserId', relatedUserId)
      }
      if (relationshipId) {
        query.where('relationshipId', relationshipId)
      }

      const relationships = await query
      const relationshipDtos = relationships.map(rel => new UserHasRelationshipDto(rel))

      return response.ok(relationshipDtos)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch relationships', error: error.message })
    }
  }

  /**
   * Display form to create a new record
   */
  async create({ response }: HttpContext) {
    try {
      // Get available users and relationship types for form
      const users = await User.query().select('id', 'fullName', 'email')
      const relationshipTypes = await RelationshipLookup.query().select('id', 'relationship', 'locale')

      return response.ok({
        fields: {
          userId: { type: 'number', required: true },
          relatedUserId: { type: 'number', required: true },
          relationshipId: { type: 'number', required: true }
        },
        options: {
          users: users,
          relationshipTypes: relationshipTypes
        }
      })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch form data', error: error.message })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['userId', 'relatedUserId', 'relationshipId'])

      // Basic validation
      if (!data.userId || !data.relatedUserId || !data.relationshipId) {
        return response.badRequest({ message: 'userId, relatedUserId, and relationshipId are required' })
      }

      // Prevent self-relationships
      if (data.userId === data.relatedUserId) {
        return response.badRequest({ message: 'A user cannot have a relationship with themselves' })
      }

      // Verify users exist
      const user = await User.find(data.userId)
      const relatedUser = await User.find(data.relatedUserId)
      if (!user || !relatedUser) {
        return response.badRequest({ message: 'One or both users do not exist' })
      }

      // Verify relationship type exists
      const relationshipType = await RelationshipLookup.find(data.relationshipId)
      if (!relationshipType) {
        return response.badRequest({ message: 'Relationship type does not exist' })
      }

      // Check if relationship already exists
      const existingRelationship = await UserHasRelationship.query()
        .where('userId', data.userId)
        .where('relatedUserId', data.relatedUserId)
        .where('relationshipId', data.relationshipId)
        .first()

      if (existingRelationship) {
        return response.conflict({ message: 'This relationship already exists' })
      }

      const relationship = await UserHasRelationship.create(data)
      await relationship.load('user')
      await relationship.load('relatedUser')
      await relationship.load('relationship')

      const relationshipDto = new UserHasRelationshipDto(relationship)
      return response.created(relationshipDto)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to create relationship', error: error.message })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const relationshipId = parseInt(params.id)
      if (isNaN(relationshipId)) {
        return response.badRequest({ message: 'Invalid relationship ID' })
      }

      const relationship = await UserHasRelationship.query()
        .where('id', relationshipId)
        .preload('user')
        .preload('relatedUser')
        .preload('relationship')
        .first()

      if (!relationship) {
        return response.notFound({ message: 'Relationship not found' })
      }

      const relationshipDto = new UserHasRelationshipDto(relationship)
      return response.ok(relationshipDto)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch relationship', error: error.message })
    }
  }

  /**
   * Edit individual record
   */
  async edit({ params, response }: HttpContext) {
    try {
      const relationshipId = parseInt(params.id)
      if (isNaN(relationshipId)) {
        return response.badRequest({ message: 'Invalid relationship ID' })
      }

      const relationship = await UserHasRelationship.query()
        .where('id', relationshipId)
        .preload('user')
        .preload('relatedUser')
        .preload('relationship')
        .first()

      if (!relationship) {
        return response.notFound({ message: 'Relationship not found' })
      }

      // Get available users and relationship types for editing
      const users = await User.query().select('id', 'fullName', 'email')
      const relationshipTypes = await RelationshipLookup.query().select('id', 'relationship', 'locale')

      const relationshipDto = new UserHasRelationshipDto(relationship)
      return response.ok({
        relationship: relationshipDto,
        fields: {
          userId: { type: 'number', required: true, current: relationship.userId },
          relatedUserId: { type: 'number', required: true, current: relationship.relatedUserId },
          relationshipId: { type: 'number', required: true, current: relationship.relationshipId }
        },
        options: {
          users: users,
          relationshipTypes: relationshipTypes
        }
      })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch relationship for editing', error: error.message })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const relationshipId = parseInt(params.id)
      if (isNaN(relationshipId)) {
        return response.badRequest({ message: 'Invalid relationship ID' })
      }

      const relationship = await UserHasRelationship.find(relationshipId)
      if (!relationship) {
        return response.notFound({ message: 'Relationship not found' })
      }

      const data = request.only(['userId', 'relatedUserId', 'relationshipId'])

      // Prevent self-relationships
      if (data.userId && data.relatedUserId && data.userId === data.relatedUserId) {
        return response.badRequest({ message: 'A user cannot have a relationship with themselves' })
      }

      // Verify users exist if being updated
      if (data.userId && data.userId !== relationship.userId) {
        const user = await User.find(data.userId)
        if (!user) {
          return response.badRequest({ message: 'User does not exist' })
        }
      }

      if (data.relatedUserId && data.relatedUserId !== relationship.relatedUserId) {
        const relatedUser = await User.find(data.relatedUserId)
        if (!relatedUser) {
          return response.badRequest({ message: 'Related user does not exist' })
        }
      }

      // Verify relationship type exists if being updated
      if (data.relationshipId && data.relationshipId !== relationship.relationshipId) {
        const relationshipType = await RelationshipLookup.find(data.relationshipId)
        if (!relationshipType) {
          return response.badRequest({ message: 'Relationship type does not exist' })
        }
      }

      // Check for duplicate relationships if key fields are being changed
      const newUserId = data.userId || relationship.userId
      const newRelatedUserId = data.relatedUserId || relationship.relatedUserId
      const newRelationshipId = data.relationshipId || relationship.relationshipId

      if (newUserId !== relationship.userId ||
        newRelatedUserId !== relationship.relatedUserId ||
        newRelationshipId !== relationship.relationshipId) {

        const existingRelationship = await UserHasRelationship.query()
          .where('userId', newUserId)
          .where('relatedUserId', newRelatedUserId)
          .where('relationshipId', newRelationshipId)
          .whereNot('id', relationshipId)
          .first()

        if (existingRelationship) {
          return response.conflict({ message: 'This relationship already exists' })
        }
      }

      // Update only provided fields
      if (data.userId !== undefined) relationship.userId = data.userId
      if (data.relatedUserId !== undefined) relationship.relatedUserId = data.relatedUserId
      if (data.relationshipId !== undefined) relationship.relationshipId = data.relationshipId

      await relationship.save()
      await relationship.load('user')
      await relationship.load('relatedUser')
      await relationship.load('relationship')

      const relationshipDto = new UserHasRelationshipDto(relationship)
      return response.ok(relationshipDto)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to update relationship', error: error.message })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const relationshipId = parseInt(params.id)
      if (isNaN(relationshipId)) {
        return response.badRequest({ message: 'Invalid relationship ID' })
      }

      const relationship = await UserHasRelationship.find(relationshipId)
      if (!relationship) {
        return response.notFound({ message: 'Relationship not found' })
      }

      await relationship.delete()
      return response.ok({ message: 'Relationship deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to delete relationship', error: error.message })
    }
  }
}
