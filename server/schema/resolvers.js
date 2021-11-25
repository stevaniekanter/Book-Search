// reference from Activity 25
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const { saveBook } = require('../controllers/user-controller');

const resolvers = {
    Query: {
        user: async(parent, args, context) =>   {
            const foundUser = await User.findOne({_id: context.user._id}).select('-__v -password')
            return foundUser
        }
    },
    Mutation:   {
        addUser: async(parent, args) =>  {
            const user = await User.create({args});
        const token = signToken(user);
        return (token, user)
        },

        login: async(parent, args) =>   {
            const user = await User.findOne({
                email: args.email
            })
            if (!user) {
                throw new AuthenticationError('Sorry, incorrect email or password')
            }
            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw) {
                throw new AuthenticationError('Sorry, incorrect email or password')
            }
            const token = signToken(user)
            return {token, user}
        },
        saveBook: async(parent, args, context) =>    {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args.bookInfo } },
                { new: true, runValidators: true }
            )
            return updatedUser;
        },
        deleteBook: async(parent, args, context) =>  {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks:  args.bookId } },
                { new: true, runValidators: true }
            )
            return updatedUser;
        }
    }
};

module.exports = resolvers