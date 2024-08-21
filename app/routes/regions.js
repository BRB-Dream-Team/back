const express = require('express');
const Region = require('../models/region');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const region = await Region.create(req.body);
    res.status(201).json(region);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);
    if (region) {
      res.json(region);
    } else {
      res.status(404).json({ error: 'Region not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const region = await Region.update(req.params.id, req.body);
    if (region) {
      res.json(region);
    } else {
      res.status(404).json({ error: 'Region not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const region = await Region.delete(req.params.id);
    if (region) {
      res.json({ message: 'Region deleted successfully' });
    } else {
      res.status(404).json({ error: 'Region not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;