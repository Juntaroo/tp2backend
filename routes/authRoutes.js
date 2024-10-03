import express from "express";
import { register, login } from "../controllers/authcontroller.js";
import { createPayment, getPayments } from "../controllers/paymentcontroller.js";
import { createUser, getUserPayments, uploadReceiptFromUrl, isSuperAdmin } from '../controllers/usuariocontroller.js';
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/payments', verifyToken, createPayment);
router.get('/payments', verifyToken, getPayments);

router.get('/protected-endpoint', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Acceso permitido' });
});
//estoy creando un usuario (Superadmin puede crear administradores, administradores pueden crear usuarios comunes)
router.post('/users', verifyToken, createUser);

//veo los pagos de usuario (Solo usuario común)
router.get('/users/payments', verifyToken, getUserPayments);

//para subir un recibo en PDF (Solo administradores)
router.post('/users/receipt', verifyToken, uploadReceiptFromUrl);

//ruta protegida para superusuairo
router.get('/superadmin/only', verifyToken, isSuperAdmin, (req, res) => {
  res.status(200).json({ message: 'Acceso garantizado para el superadministrador' });
});
export default router;