const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {randomBytes} = require('crypto')
const {promisify} = require('util')
const {makeANiceEmail, transport} = require('../mail')
const {hasPermission} = require('../utils')

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must login to do that')
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          user: {
            // this is how we create a relationship
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    )
    return item
  },

  async updateItem(parent, args, ctx, info) {
    const updates = {...args}
    delete updates.id
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {id: args.id}
      },
      info
    )
  },
  async deleteItem(parent, args, ctx, info) {
    const where = {id: args.id}

    const item = await ctx.db.query.item({where}, `{id title user{id}}`)
    const ownsItem = item.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    )

    if (!ownsItem && hasPermissions) {
    } else {
      throw new Error(`You don't have permissions to do that`)
    }

    return ctx.db.mutation.deleteItem({where}, info)
  },

  async signup(paren, args, ctx, info) {
    // tolowercase email
    args.email = args.email.toLowerCase()

    const users = await ctx.db.query.users()
    const exists = users.filter(user => user.email === args.email)

    if (exists.length >= 1) throw new Error(`Email in use`)
    // hash password
    const password = await bcrypt.hash(args.password, 10)
    // create user
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: {set: ['USER']}
        }
      },
      info
    )

    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
    //send token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    return user
  },

  async signin(parent, {email, password}, ctx, info) {
    // 1. check if theres a user with that email
    const user = await ctx.db.query.user({where: {email}})
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }
    // 2. check if the password is correct
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error(`Invalid password`)
    }
    // 3. generate the JWT
    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
    // 4. set the cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    // 5. Return the user
    return user
  },
  signout(paren, args, ctx, info) {
    ctx.response.clearCookie('token')
    return {message: 'GoodBye!'}
  },

  async requestReset(parent, args, ctx, info) {
    // check if is a real user
    const user = await ctx.db.query.user({where: {email: args.email}})
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`)
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes)
    const resetToken = (await randomBytesPromiseified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: {email: args.email},
      data: {resetToken, resetTokenExpiry}
    })
    console.log(res)
    // email them that reset token
    const mailResponse = await transport.sendMail({
      from: '',
      to: user.email,
      subject: `Password reset token`,
      html: makeANiceEmail(
        `Your password reset token is here ! \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`
      )
    })
    console.log(mailResponse)
    return {message: 'thanks'}
  },

  async resetPassword(parent, args, ctx, info) {
    // check if the password match
    if (args.password !== args.confirmPassword) {
      throw new Error(`Yo Passwords  don't match`)
    }
    // check if it's a legit token
    // check if it's expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now - 3600000
      }
    })
    if (!user) {
      throw new Error('this token is either invalid or expired!')
    }
    const password = await bcrypt.hash(args.password, 10)
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: {email: user.email},
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    // 6. Generate JWT
    const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET)
    // 7. Set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    // 8. return the new user
    return updatedUser
  },

  async updatedPermissions(parent, args, ctx, info) {
    //1. check if there are login
    if (!ctx.request.userId) {
      throw new Error(`you must be logged in`)
    }
    //2. Query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    )
    //3. check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])
    //4. update the permissions
    ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      },
      info
    )
  },
  async addToCart(parent, args, ctx, info) {
    //1. already signin
    const {userId} = ctx.request
    //2. Query the user's current Cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {user: {id: userId}, item: {id: args.id}}
    })
    //3. if the item it's already in their cart
    if (existingCartItem) {
      console.log('this item is already in the cart')
      //4. increment if it's, add if isn't
      return ctx.db.mutation.updateCartItem(
        {
          where: {id: existingCartItem.id},
          data: {quantity: existingCartItem.quantity + 1}
        },
        info
      )
    }

    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {connect: {id: userId}},
          item: {connect: {id: args.id}}
        }
      },
      info
    )
  },
  async removeFromCart(parent, args, ctx, info) {
    // 1. find the cart item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: {id: args.id}
      },
      `{id, user {id}}`
    )
    if (!cartItem) throw new Error(`No cart item found`)
    // 2. make sure they own the cart
    if (cartItem.user.id != ctx.request.userId) {
      throw new Error(`No cart item found`)
    }
    // 3. delete the cart item
    return ctx.db.mutation.deleteCartItem({where: {id: args.id}}, info)
  }
}

module.exports = Mutations
