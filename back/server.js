const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

// Sample data for demonstration
let items = [
  { id: uuidv4(), name: 'Chair', type: 'Chair', imageUrl: 'https://via.placeholder.com/50?text=Chair' },
  { id: uuidv4(), name: 'Table', type: 'Table', imageUrl: 'https://via.placeholder.com/50?text=Table' },
  { id: uuidv4(), name: 'Stage', type: 'Stage', imageUrl: 'https://via.placeholder.com/50?text=Stage' },
  { id: uuidv4(), name: 'Podium', type: 'Podium', imageUrl: 'https://via.placeholder.com/50?text=Podium' },
  { id: uuidv4(), name: 'Lighting', type: 'Lighting', imageUrl: 'https://via.placeholder.com/50?text=Lighting' },
];

// Validation schema
const itemSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  imageUrl: Joi.string().uri().required(),
});

// Routes
app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const { error } = itemSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newItem = { ...req.body, id: uuidv4() };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;

  const index = items.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).send('Item not found');

  items[index] = { ...items[index], ...updatedItem };
  res.json(items[index]);
});

app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  items = items.filter(item => item.id !== id);
  res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
