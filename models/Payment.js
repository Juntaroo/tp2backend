import { DataTypes } from "sequelize";
import User from "./User.js"
import sequelize from "../config/connection.js";

const Payment = sequelize.define('Payment', {//establezco los parámetros del pago
  reciboId: {
    type: DataTypes.STRING, // ID único para cada recibo
    allowNull: false,
    unique: true, // Garantizamos que cada recibo tenga un ID único
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  receipt: {
    type: DataTypes.STRING, //URL del archivo PDF
  },
  fechaCompra: {
    type: DataTypes.DATE, // Fecha y hora de la compra
    allowNull: false,
    defaultValue: DataTypes.NOW, // Por defecto es la fecha actual si no se proporciona
  }
});


Payment.belongsTo(User, { foreignKey: 'userId' });//establezco la relacion que tiene el pago con el usuario

export default Payment;



