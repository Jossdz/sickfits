const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Mutations = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {...args}
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
    const item = await ctx.db.query.item({where}, `{id title}`)
    return ctx.db.mutation.deleteItem({where}, info)
  },

  async signup(paren, args, ctx, info) {
    // tolowercase email
    args.email = args.email.toLowerCase()
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
  }
}

module.exports = Mutations
