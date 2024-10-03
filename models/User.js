import { DataTypes } from "sequelize";
import sequelize from "../config/connection.js";
import bcrypt from "bcryptjs"


const User = sequelize.define('Usuario',{//establezco los parámetros del usuario
    id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true,
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
      },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('superadmin', 'admin', 'user'),
        defaultValue: 'user'
    }
})

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });//encripto la contraseña antes de crearla
export default User