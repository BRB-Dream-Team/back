const express = require('express');
const Phone = require('../models/phone');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const phone = await Phone.create(req.body);
    res.status(201).json(phone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);
    if (phone) {
      res.json(phone);
    } else {
      res.status(404).json({ error: 'Phone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const phone = await Phone.update(req.params.id, req.body);
    if (phone) {
      res.json(phone);
    } else {
      res.status(404).json({ error: 'Phone not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const phone = await Phone.delete(req.params.id);
    if (phone) {
      res.json({ message: 'Phone deleted successfully' });
    } else {
      res.status(404).json({ error: 'Phone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;