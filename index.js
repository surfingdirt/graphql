const { ApolloServer, gql } = require('apollo-server');

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }

    type Author {
        name: String
    }

    type Query {
        getAuthors: [Author]
        getBooks: [Book]
    }
    type Mutation {
        addBook(title: String, author: String): Book
    }  
`;

const resolvers = {
  Query: {
    getBooks: () => books,
    getAuthors: () => books.map(b => ({name: b.author})),
  },
  Mutation: {
    addBook: (root, { title, author }) => {
      books.push({title, author});
      console.log({books});
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
