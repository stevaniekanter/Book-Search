// reference from activity 25
const gql = require('graphql');

const typeDefs = gql`
    type Query {
        user: User
    }
    type User   {
        _id: String
        username: String
        email: String
        bookCount: Int
        saveBooks: [Book]
    }
    type Book:  {
        bookId: String
        authors: [String]
        description: String
        image: String
        link: String
        title: String
    }
    type Auth   {
        token:String
        user: User
    }
    type Mutation   {
        login(email: String, password: String): Auth
        addUser(username: String, email: String, password: String): Auth
    }
    `;

module.exports = typeDefs