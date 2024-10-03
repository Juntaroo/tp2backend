import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import fs from 'fs';
import path from 'path';


//acá se crea un nuevo usuario
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const currentUserRole = req.user.role; //estoy verificando el rol del usuario

  
  if (role === 'admin' && currentUserRole !== 'superadmin') {//solo el superadmin puede crear los administradores
    return res.status(403).json({ message: 'No tienes permisos para crear administradores.' });
  }
  if (role === 'user' && currentUserRole !== 'admin' && currentUserRole !== 'superadmin') {//solo los administradores pueden crear usuarios comunes
    return res.status(403).json({ message: 'No tienes permisos para crear usuarios comunes.' });
  }

  try {
    //cifrando la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //termino de crear el nuevo usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'Usuario creado correctamente', newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
};


const getUserPayments = async (req, res) => {//obtengo el registro de pagos de un usuario
  const userId = req.user.id; //usuario autenticado
  try {
    const payments = await Payment.findAll({ where: { userId } });
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos', error: error.message });
  }
};


//para subir recibos en formato PDF desde una URL (Solo administradores)
const uploadReceiptFromUrl = async (req, res) => {
    const { pdfUrl } = req.body;
  
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden subir recibos.' });
    }
  
    if (!pdfUrl) {
      return res.status(400).json({ message: 'Debes proporcionar una URL de un archivo PDF.' });
    }
  
    try {
      //verifico si la URL corresponde a un PDF
      const response = await axios.get(pdfUrl, { responseType: 'stream' });
      const contentType = response.headers['content-type'];
  
      if (contentType !== 'application/pdf') {
        return res.status(400).json({ message: 'La URL proporcionada no es un archivo PDF.' });
      }
  
      //defino el path donde se guardará el archivo
      const fileName = path.basename(pdfUrl);
      const filePath = path.join('./uploads', fileName);
  
      //guardo el archivo en el sistema
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
  
      writer.on('finish', () => {
        res.status(200).json({ message: 'Recibo subido correctamente', filePath });
      });
  
      writer.on('error', (err) => {
        res.status(500).json({ message: 'Error al guardar el archivo PDF', error: err.message });
      });
  
    } catch (error) {
      res.status(500).json({ message: 'Error al descargar el archivo desde la URL', error: error.message });
    }
  };

//verifico si el usuario autenticado es superusuario
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo el superadministrador tiene acceso.' });
  }
  next();
};


export{
  createUser,
  getUserPayments,
  uploadReceiptFromUrl,
  isSuperAdmin
}