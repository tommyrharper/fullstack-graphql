/**
 * Here are your Resolvers for your Schema. They must match
 * the type definitions in your scheama
 */

module.exports = {
  Query: {
    pets(_, {input}, ctx) {
      // return ctx.models.Pet.findMany({ id: input.id })
      return ctx.models.Pet.findMany(input)
      // return [{ id: 1, name: 'moose' }, { id: 2, name: 'garfield' }]
    },
    pet(_, {input}, ctx) {
      console.log('Query => pet')
      return ctx.models.Pet.findOne(input)
    }
  },
  Mutation: {
    newPet(_, {input}, ctx) {
      return ctx.models.Pet.create(input)
    }
  },
  Pet: {
    owner(pet, _, ctx) {
      console.log('PET => owner')
      return ctx.models.User.findOne()
      // return ctx.models.User.findById(pet.user)
    },
    // img(pet) {
    //   return pet.type === 'DOG'
    //     ? 'https://placedog.net/300/300'
    //     : 'http://placekitten.com/300/300'
    // }
  },
  User: {
    pets(user, _, ctx) {
      console.log('USER => pets')
      return ctx.models.Pet.findMany({})
      // return ctx.models.Pet.findMany({ user: user.id })
    }
  }
}
