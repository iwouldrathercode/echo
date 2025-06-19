import factory from '@adonisjs/lucid/factories'
import RelationshipLookup from '#models/relationship_lookup'

export const RelationshipLookupFactory = factory
  .define(RelationshipLookup, async ({ faker }) => {
    const relationships = [
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
    ]

    return {
      relationship: faker.helpers.arrayElement(relationships),
      locale: 'en_US',
    }
  })
  .build()
