import * as db from '../../config/sequelize';
import * as sequelize from 'sequelize';

const UserSchema = {

    user_id:{
        type: sequelize.INTEGER(11)
    },

    name:{
        type: sequelize.STRING(50)
    },

    last_name:{
        type: sequelize.STRING(50)
    },
    
    email:{
        type:sequelize.STRING(255)
    },

    phone:{
        type: sequelize.STRING(300)
    }
    
    password_hash:{
        type: sequelize.STRING(300)
    }
};

const User = db.define('auth_users', UserSchema);

export {User};