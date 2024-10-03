import dotenv from 'dotenv';
import express from "express"
import cors from "cors";
import morgan from "morgan";
import sequelize from './config/connection';
import fileUpload from "express-fileupload";
import routerPayment from "./routes/authRoutes";


dotenv.config();
const app = express();  
app.use(express.json());
const port = 3000;
app.use(morgan('dev'));
app.use(cors());



sequelize.authenticate();
console.log('Conexión a la base de datos establecida correctamente.');

sequelize.sync()
.then(() => console.log('Base de datos sincronizada correctamente.'))
.catch(err => console.error('No se pudo sincronizar la base de datos:', err));

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(routerPayment);//mi ruta
app.use(fileUpload());

app.listen(port,()=>{
    console.log("En marcha")
})

export default app;