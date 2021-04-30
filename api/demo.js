const gql = require('graphql-tag');
const { ApolloServer } = require('apollo-server');


const typeDefs = gql`
  # Single line comment

  """
  Multi line comment shows up with ShoeType docs
  """
  enum ShoeType {
    JORDAN
    NIKE
    ADIDAS
    TIMBERLAND
  }
  type User {
    email: String!
    avatar: String
    friends: [User]!
  }

  interface Shoe {
    brand: ShoeType!
    size: Int!
  }

  type Sneaker implements Shoe {
    brand: ShoeType!
    size: Int!
    sport: String!
  }

  type Boot implements Shoe {
    brand: ShoeType!
    size: Int!
    hasGrip: Boolean!
  }

  input ShoeInput {
    brand: ShoeType
    size: Int
  }

  input NewShoeInput {
    brand: ShoeType!
    size: Int!
  }

  type Query {
    me: User!
    shoes(input: ShoeInput): [Shoe]!
    friends: [User]!
  }

  type Mutation {
    newShoe(input: NewShoeInput!): Shoe!
  }
`

const resolvers = {
  Query: {
    shoes(_, {input}) {
      return [
        {brand: 'NIKE', size: 12, sport: 'basketball'},
        {brand: 'TIMBERLAND', size: 14, hasGrip: true},
      ]
    },
    me() {
      return {
        email: 'yoda@masters.com',
        avatar: 'http://yoda.png',
        friends: []
      }
    },
    friends() {
      return [{
        email: 'yoda@masters.com',
        avatar: 'http://yoda.png',
        friends: []
      }, {
        email: 'jedi@masters.com',
        avatar: 'http://jedi.png',
        friends: []
      }]
    }
  },
  Mutation: {
    newShoe(_, {input}) {
      return input
    }
  },
  Shoe: {
    __resolveType(shoe) {
      if (shoe.sport) return 'Sneaker'
      return 'Boot'
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen(4000)
  .then(() => console.log('on port 4000'));
