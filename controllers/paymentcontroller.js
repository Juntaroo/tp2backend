import User from '../models/User.js';
import Payment from '../models/Payment.js';

const createPayment = async (req, res) => {
  const { amount, reciboId } = req.body;
  const receipt = req.file ? req.file.path : null;
  const userId = req.user.id;

  try {
    const payment = await Payment.create({
      reciboId,
      amount,
      receipt,
      fechaCompra: new Date(), //asigno la fecha actual
      userId
    });
    res.status(201).json({ payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPayments = async (req, res) => {
  const userId = req.user.id;

  try {
    const payments = await Payment.findAll({ where: { userId } });
    res.status(200).json({ payments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export{
    getPayments,
    createPayment
}