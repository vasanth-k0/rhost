import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../lib/db.mjs"; 

class User extends Model {}

User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            validate:{
                len: [8, 100]
            },
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'user',
        timestamps: false
    }
)

export {User};