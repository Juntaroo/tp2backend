import request from 'supertest';
import app from '../index'
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User';
import jwt from 'jsonwebtoken';
import sequelize from '../config/connection';


beforeAll(async () => {
  await sequelize.sync(); //sincroniza las tablas antes de ejecutar los tests
});



describe('POST /register', () => {
  it('debería registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'pepe',
        email: 'pepe@gmail.com',
        password: '3344',
        role: 'admin',
      });

    //analiza el estado de respuesta y que se devuelva un token
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined(); //vrifica que se haya generado un token

    //vrifica que el usuario se haya creado en la base de datos
    const user = await User.findOne({ where: { email: 'pepe@gmail.com' } });
    expect(user).not.toBeNull();
    expect(user.name).toBe('pepe');
  });
});

describe('POST /login', () => {
  it('debería iniciar sesión y devolver un token', async () => {
    //creo un usuario de prueba en la base de datos
    const user = {
      id: 1,
      name: 'pepe',
      email: 'pepe@gmail.com',
      password: await bcrypt.hash('3344', 10), //encripto la contraseña
      role: 'admin',
    };

    await User.create(user); // Agrega el usuario a la base de datos

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'pepe@gmail.com',
        password: '3344',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined(); //verifica que se haya generado un token
    expect(res.body.user).toEqual({ id: 1, name: 'pepe', email: 'pepe@gmail.com', role: 'admin' });
  });

  it('debería devolver un error 401 si las credenciales son incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Datos incorrectos');
  });

  it('debería devolver un error 401 si la contraseña es incorrecta', async () => {
    //creo un usuario de prueba en la base de datos
    const user = {
      id: 1,
      name: 'pepe',
      email: 'pepe@gmail.com',
      password: await bcrypt.hash('3344', 10),
      role: 'admin',
    };

    await User.create(user); //se agrega el usuario a la base de datos

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'pepe@gmail.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Datos incorrectos');
  });
});

afterAll(async () => {
  await sequelize.close(); //cierra la conexión después de los tests
});