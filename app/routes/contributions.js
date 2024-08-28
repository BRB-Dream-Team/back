const express = require('express');
const Contribution = require('../models/contribution');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const contribution = await Contribution.create(req.body);
    res.status(201).json(contribution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (contribution) {
      res.json(contribution);
    } else {
      res.status(404).json({ error: 'Contribution not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all/:id', async (req, res) => {
  try {
    const contributions = await Contribution.findByStartupId(req.params.id);
    if (contributions) {
      res.json(contributions);
    } else {
      res.status(404).json({ error: 'No contributions found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const contribution = await Contribution.update(req.params.id, req.body);
    if (contribution) {
      res.json(contribution);
    } else {
      res.status(404).json({ error: 'Contribution not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const contribution = await Contribution.delete(req.params.id);
    if (contribution) {
      res.json({ message: 'Contribution deleted successfully' });
    } else {
      res.status(404).json({ error: 'Contribution not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;