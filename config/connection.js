import {Sequelize} from 'sequelize';


const sequelize = new Sequelize('tp2backend', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
});


export default sequelize