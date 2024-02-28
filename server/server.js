const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3001;

app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Piano',
  password: 'karandach12',
  port: 5432,
});

app.use(express.json());

app.get('/lessons', async (req, res) => {
  const { id } = req.query;
  try {
    const client = await pool.connect();
    let result;
    if (id) {
      result = await client.query(`SELECT * FROM lessons WHERE id = $1`, [id]);
    } else {
      result = await client.query('SELECT id, subtitle, title FROM lessons'); //УБРАТЬ TITLE ПОСЛЕ КУРСАЧА
    }
    const lessons = result.rows;
    res.json(lessons);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/notes', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM notes');
    const notes = result.rows;
    res.json(notes);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/quizzes', async (req, res) => {
  const { lesson_id } = req.query;
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM quizzes WHERE lesson_id = $1`, [lesson_id]);
    const quizzes = result.rows;
    res.json(quizzes);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query(`
    SELECT u.user_id, u.username, u.email, u.status, u.image,
    COALESCE(ARRAY(SELECT cl.lesson_id FROM completedlessons cl WHERE cl.user_id = u.user_id), '{}') AS completedlessons
    FROM users u
    WHERE u.user_id = $1;`, [userId]);
    const user = result.rows[0];
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, username, status, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, hashedPassword, username, 'user', 'BasicAvatar.jpg']
    );
    const registeredUser = result.rows[0];
    const token = jwt.sign(
      {
        id: registeredUser.user_id,
        completedlessons: []
      },
      'your_secret_key',
      { expiresIn: '2h' }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Пользователь с такой почтой не найден' });
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }
    const token = jwt.sign(
      {
        id: user.user_id,
      },
      'your_secret_key',
      { expiresIn: '3h' }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/completeLesson', async (req, res) => {
  const { userId, lessonId } = req.body;
  const client = await pool.connect();
  try {
    await client.query('INSERT INTO completedlessons (user_id, lesson_id) VALUES ($1, $2)', [userId, lessonId]);
    res.status(200).send('Lesson completed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/deleteLesson', async (req, res) => {
  const { lessonId } = req.body;
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM completedlessons WHERE lesson_id = $1', [lessonId]);
    await client.query('DELETE FROM lessons WHERE id = $1', [lessonId]);
    await client.query('UPDATE lessons SET id = id-1 WHERE id > $1', [lessonId]);
    await client.query('UPDATE completedlessons SET lesson_id = lesson_id - 1 WHERE lesson_id > $1', [lessonId]);
    res.status(200).send('Lesson deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/addLesson', async (req, res) => {
  const client = await pool.connect();
  const {lessonId} = req.body;
  try {
    await client.query(`INSERT INTO lessons (id, subtitle, title, practice_image, notes, information, lesson_images)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                        [lessonId, `Lesson ${lessonId}`, `Lesson ${lessonId}`, [], [],
                        ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4", "Paragraph 5 (optional)"],
                        ['Lesson12', 'Main2', 'someCapy']]);
    res.status(200).send('Lesson add  successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Couldn't add a lesson"});
  } finally {
    client.release();
  }
});

app.post('/editLesson', async (req, res) => {
  const client = await pool.connect();
  const {subtitle, title, information, lessonId, lessonImages} = req.body;
  try {
    await client.query('UPDATE lessons SET subtitle = $1, title = $2, information = $3, lesson_images = $4 where id = $5',
                      [subtitle, title, information, lessonImages, lessonId]);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Couldn't edit the lesson"})
  } finally {
    client.release();
  }
});

const storageUsers = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, '../public/images/users/');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const storageLessons = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, '../public/images/');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const uploadUsers = multer({ storage: storageUsers });
const uploadLessons = multer({ storage: storageLessons });

app.post('/uploadUsers', uploadUsers.single('image'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});

app.post('/uploadLessons', uploadLessons.single('image'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});


app.post('/changeUsername', async (req, res) => {
  const {user_id, new_username} = req.body;
  const client = await pool.connect();
  try {
    await client.query('UPDATE users SET username = $1 WHERE user_id = $2', [new_username, user_id]);
    res.status(200).send('Username changed!');
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  } finally {
    client.release();
  }
});

app.post('/changeAvatar', async (req, res) => {
  const {user_id, new_image} = req.body;
  const client = await pool.connect();
  try {
    await client.query('UPDATE users SET image = $1 WHERE user_id = $2', [new_image, user_id]);
    res.status(200).send('Avatar changed!');
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
