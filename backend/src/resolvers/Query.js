const {forwardTo} = require('prisma-binding')
const {hasPermission} = require('../utils')
const Query = {
  // async items(parent, args, ctx, info){
  //   const items = await ctx.db.query.items()
  //   return items
  // },
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    //check if there is a current user
    if (!ctx.request.userId) return null

    return ctx.db.query.user(
      {
        where: {id: ctx.request.userId}
      },
      info
    )
  },
  async users(parent, args, ctx, info) {
    //check if the user has permissions
    if (!ctx.request.userId) {
      throw new Error('you must be logged in')
    }
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    // if they do query all users
    return ctx.db.query.users({}, info)
  },
  cartItems: forwardTo('db')
}

module.exports = Query
