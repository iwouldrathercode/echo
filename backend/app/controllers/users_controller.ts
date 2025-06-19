import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserDto from '#dtos/user'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const users = await User.query()
        .preload('relationships')
        .preload('inverseRelationships')

      const userDtos = users.map(user => new UserDto(user))
      return response.ok(userDtos)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch users', error: error.message })
    }
  }

  /**
   * Display form to create a new record
   */
  async create({ response }: HttpContext) {
    // For API endpoints, this typically returns validation rules or form schema
    return response.ok({
      fields: {
        fullName: { type: 'string', required: false },
        email: { type: 'string', required: true },
        password: { type: 'string', required: true }
      }
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['fullName', 'email', 'password'])

      // Basic validation
      if (!data.email || !data.password) {
        return response.badRequest({ message: 'Email and password are required' })
      }

      const user = await User.create(data)
      const userDto = new UserDto(user)

      return response.created(userDto)
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        return response.conflict({ message: 'Email already exists' })
      }
      return response.internalServerError({ message: 'Failed to create user', error: error.message })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const userId = parseInt(params.id)
      if (isNaN(userId)) {
        return response.badRequest({ message: 'Invalid user ID' })
      }

      const user = await User.query()
        .where('id', userId)
        .preload('relationships')
        .preload('inverseRelationships')
        .first()

      if (!user) {
        return response.notFound({ message: 'User not found' })
      }

      const userDto = new UserDto(user)
      return response.ok(userDto)
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch user', error: error.message })
    }
  }

  /**
   * Edit individual record
   */
  async edit({ params, response }: HttpContext) {
    try {
      const userId = parseInt(params.id)
      if (isNaN(userId)) {
        return response.badRequest({ message: 'Invalid user ID' })
      }

      const user = await User.find(userId)
      if (!user) {
        return response.notFound({ message: 'User not found' })
      }

      // Return current user data for editing
      const userDto = new UserDto(user)
      return response.ok({
        user: userDto,
        fields: {
          fullName: { type: 'string', required: false, current: user.fullName },
          email: { type: 'string', required: true, current: user.email }
        }
      })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch user for editing', error: error.message })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const userId = parseInt(params.id)
      if (isNaN(userId)) {
        return response.badRequest({ message: 'Invalid user ID' })
      }

      const user = await User.find(userId)
      if (!user) {
        return response.notFound({ message: 'User not found' })
      }

      const data = request.only(['fullName', 'email', 'password'])

      // Update only provided fields
      if (data.fullName !== undefined) user.fullName = data.fullName
      if (data.email !== undefined) user.email = data.email
      if (data.password !== undefined) user.password = data.password

      await user.save()

      const userDto = new UserDto(user)
      return response.ok(userDto)
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        return response.conflict({ message: 'Email already exists' })
      }
      return response.internalServerError({ message: 'Failed to update user', error: error.message })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const userId = parseInt(params.id)
      if (isNaN(userId)) {
        return response.badRequest({ message: 'Invalid user ID' })
      }

      const user = await User.find(userId)
      if (!user) {
        return response.notFound({ message: 'User not found' })
      }

      await user.delete()
      return response.ok({ message: 'User deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to delete user', error: error.message })
    }
  }
}
