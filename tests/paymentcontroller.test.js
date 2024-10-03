import { createPayment } from '../controllers/paymentcontroller';
import Payment from '../models/Payment';
import app from '../index'
import dotenv from 'dotenv';
dotenv.config();


beforeAll(async () => {
  await sequelize.sync(); //sincroniza las tablas antes de ejecutar los tests
});


describe('Payment Controller', () => {
  test('Debería crear un pago correctamente', async () => {
    //datos que se envian mediante una solicitud
    const paymentData = {
      amount: 100,
      userId: '123'
    };

    //realizo una petición POST al endpoint real
    const res = await request(app)
      .post('/api/payments') //ajusta este endpoint
      .field('amount', paymentData.amount)
      .attach('receipt', 'path/to/receipt.pdf'); //envía un archivo PDF

    //verifico si se creó
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Pago creado correctamente');
  });
});

afterAll(async () => {
  await sequelize.close(); //cierra la conexión después de los tests
});