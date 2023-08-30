// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config;

module.exports = async function (params, context) {
 const { email, password } = params;

  if(!email || !password){
    context.status(400);
    return {
      "message":"All fields are compulsory !!!"
    }
  }

  const userTable = aircode.db.table('user');
  const user =await userTable
  .where({ email: email.toLowerCase() })  // Convert to lowercase
  .findOne();

if (!user) {
  context.status(401);
  return {
    "message": "Invalid Credentials"
  };
}

  const matchPassword = await bcrypt.compare(password,user.password);
  if(matchPassword){
    const accessToken = jwt.sign({
      "_id":user._id,
      "isAdmin":user.isAdmin
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:'1d'}
    );
  const currentUser = {...user, accessToken};
    await userTable.save(currentUser);
    context.status(200);
    return {
      accessToken
    }
    
  }else{
     context.status(401);
    return {
      "message":"Invalid Credentials"
    }
  }
};
