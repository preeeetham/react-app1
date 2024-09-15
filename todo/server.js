import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/google-signin', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub: googleId } = ticket.getPayload();
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { name, email, googleId },
      });
    }
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/guest-signin', (req, res) => {
  const guestToken = jwt.sign({ userId: 'guest' }, process.env.JWT_SECRET);
  res.json({ token: guestToken });
});

app.get('/api/todos', authenticateToken, async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.userId },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/todos', authenticateToken, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        dueDate,
        user: { connect: { id: req.user.userId } },
      },
    });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isDone, dueDate } = req.body;
    const todo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { title, description, isDone, dueDate },
    });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));