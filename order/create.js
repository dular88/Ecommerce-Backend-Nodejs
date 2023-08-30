// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);

  if(tokenUser != null){
    const { products, amount, address, status } = params;
    if(!products || !amount || !address){
      context.status(400);
      return {
        "message":"Product, Amount and Address are required !!!"
      }
    } 

    const orderTable = aircode.db.table('order');
  
    try{
      const order = {
        ...params,
        userId:tokenUser._id
        }

      const result = await orderTable.save(order);
      context.status(201);
      return {
        result
      }
    }catch(err){
      context.status(500);
      return {
        "message": err.message
      }
    }
  }else{
    context.status(401);
    return {
      "message":"Token is invalid or user is Unauthorized"
    }
    }
  };
