// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  if(tokenUser != null && tokenUser.isAdmin){
    const { _id, title, description, inStock, price, category, color, size } = params;
    const productTable = aircode.db.table('product');
    const product = await productTable
    .where({_id})
    .findOne();

    try{
     const result = await productTable.save(params);
      context.status(200);

      return {
        ...result
      }
    }catch(err){
      context.status(500);
      return {
        "message":err.message
      }
    }
  }else{
    context.status(401);
    return {
      "message":"Token is invalid or user is Unauthorized"
    }
  }
};
