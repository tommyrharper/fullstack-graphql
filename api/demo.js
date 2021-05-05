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
    shoes: [Shoe]!
  }

  interface Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
  }

  type Sneaker implements Shoe {
    brand: ShoeType!
    size: Int!
    sport: String!
    user: User!
  }

  type Boot implements Shoe {
    brand: ShoeType!
    size: Int!
    hasGrip: Boolean!
    user: User!
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
const user = {
  id: 1,
  email: 'yoda@masters.com',
  avatar: 'http://yoda.png',
  friends: [],
  shoes: []
};

const shoes = [
  {brand: 'NIKE', size: 12, sport: 'basketball', user: 1},
  {brand: 'TIMBERLAND', size: 14, hasGrip: true, user: 1},
];

const resolvers = {
  Query: {
    shoes(_, {input}) {
      if (input.brand) return shoes.filter(shoe => shoe.brand === input.brand)
      return shoes
    },
    me() {
      return user
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
  User: {
    shoes() {
      return shoes
    }
  },
  Shoe: {
    __resolveType(shoe) {
      if (shoe.sport) return 'Sneaker'
      return 'Boot'
    }
  },
  Sneaker: {
    user(shoe) {
      return user
    }
  },
  Boot: {
    user(shoe) {
      return user
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen(4000)
  .then(() => console.log('on port 4000'));
