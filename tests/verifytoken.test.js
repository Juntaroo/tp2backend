import jwt from 'jsonwebtoken';
import request from 'supertest';
import verifyToken from '../middleware/authMiddleware';
import app from '../index'
import sequelize from '../config/connection';
import dotenv from 'dotenv';
dotenv.config();



beforeAll(async () => {
  await sequelize.sync(); //sincroniza las tablas antes de ejecutar los tests
});



describe('verifyToken middleware', () => {
  it('debería permitir el acceso si el token es válido', async () => {
    //genero un token valido
    const validToken = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    //realizo una solicitud con un token valido
    const res = await request(app)
      .get('/api/protected-endpoint') //ajusto el endpoint
      .set('Authorization', `Bearer ${validToken}`);

    //verifico que la respuesta sea exitosa
    expect(res.status).toBe(200); 
  });

  it('debería retornar 401 si el token es inválido', async () => {
    //genero un token inválido
    const invalidToken = 'invalidtoken';

    //realizo una solicitud con un token inválido
    const res = await request(app)
      .get('/api/protected-endpoint') //ajusta el endpoint
      .set('Authorization', `Bearer ${invalidToken}`);

    //verificamos la respuesta
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe('Token no válido');
  });
});


afterAll(async () => {
  await sequelize.close(); //cierra la conexión después de los tests
});