// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const jwt = require('jsonwebtoken');
require('dotenv').config;

module.exports.verifyToken = async function (context) {
 let token;
  let authHeader = context.headers.Authorization || context.headers.authorization;

  if(authHeader || authHeader.startWith('Bearer')){
    token = authHeader.split(" ")[1];
    try{
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return user;
    }catch(err){
      return null;
    }
  }
  if(!token){
    return null;
  }
};
