const express = require('express');
const Startup = require('../models/startup');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const startup = await Startup.create(req.body);
    res.status(201).json(startup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (startup) {
      res.json(startup);
    } else {
      res.status(404).json({ error: 'Startup not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const startups = await Startup.findAll();
    if (startups) {
      res.json(startups);
    } else {
      res.status(404).json({ error: 'No startups found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const startup = await Startup.update(req.params.id, req.body);
    if (startup) {
      res.json(startup);
    } else {
      res.status(404).json({ error: 'Startup not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const startup = await Startup.delete(req.params.id);
    if (startup) {
      res.json({ message: 'Startup deleted successfully' });
    } else {
      res.status(404).json({ error: 'Startup not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;