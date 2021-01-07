const { User } = require('../models');
const { checkPass } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

class UserController {

    static register = (req, res, next) => {
        const { email, password } = req.body;
        User.create({email, password })
        .then(output => res.status(201).json({id: output.id, email: output.email}))
        .catch(err => next(err));
    }
    
    static login = (req, res, next) => {
        const { email, password } = req.body;
        User.findOne({where: {email}})
        .then(output => {
            if (output) {
                if (checkPass(password, output.password)) {
                    const access_token = generateToken({
                        id: output.id,
                        email: output.email
                    })
                    res.status(200).json({access_token})
                } else {
                    throw {name:'InvalidInput'}
                }
            } else {
                throw {name:'InvalidInput'}
            }
        })
        .catch(err => next(err));
    }
}

module.exports = UserController;
