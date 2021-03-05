const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/default');
const {check,validationResult} =require('express-validator');
const User = require('../models/User');
const router = Router();
// /api/auth/register
router.post('/register',
    [
        check('email','incorrect email').isEmail(),
        check('password','Min Length 6').isLength({min:6}),
    ]
    ,async (req, res) => {
    try {
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:"Bad request"
            })
        }
      const {email,password} = req.body;
      const candidate = await User.findOne({email});
      if(candidate){
         return res.status(400).json({message:'This user already exists'})
      }
      const hashedPassword = await bcrypt.hash(password,12);
      const user = new User({email,password:hashedPassword});
      await  user.save();
      res.status(201).json({message:'User created'})
    } catch (e) {
        res.status(500).json({message: 'problem in server'})
    }
});
// /api/auth/login
router.post('/login',
    [
        check('email','incorrect email login').normalizeEmail().isEmail(),
        check('password','incorrect password').exists()
    ],
    async (req, res) => {
    try {
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array(),
                message:"Bad request"
            })
        }
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'User not found'})
        }
       const  isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Password incorrect'})

        }
        const token = jwt.sign({userId:user.id},config.jwtSecret,{expiresIn:'1h'});
        res.json({token,userId:user.id})
    } catch (e) {
        res.status(500).json({message: 'problem in server'})
    }
});
module.exports = router;