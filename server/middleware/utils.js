const jwt=require('jsonwebtoken');

const generateToken=(user)=>{
    const payload = {
        userId: String(user._id || user.id),
        admin: user.admin === true,
    };
    return jwt.sign(payload,
        process.env.JWT_SECRET,
        {expiresIn:'30d',}
    );
}
module.exports={generateToken};
