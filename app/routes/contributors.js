const express = require('express');
const Contributor = require('../models/contributor');
const Passport = require('../models/passport');
const BankAgreement = require('../models/bankAgreement');

const router = express.Router();

// Helper function to ensure a string is exactly 2 characters
function validatePassportSeries(series) {
  if (typeof series !== 'string' || series.length !== 9) {
    throw new Error('Passport series must be exactly 9 characters');
  }
  return series;
}

router.post('/', async (req, res) => {
  try {
    const { passport, bankAgreement, ...contributorData } = req.body;

    // Validate passport series
    passport.series = validatePassportSeries(passport.series);

    // Create related entities
    const createdPassport = await Passport.create(passport);
    let createdAgreement = null;
    if (bankAgreement) {
      createdAgreement = await BankAgreement.create(bankAgreement);
    }

    // Create contributor
    const contributor = await Contributor.create({
      ...contributorData,
      passport_id: createdPassport.passport_id,
      agreement_id: createdAgreement ? createdAgreement.agreement_id : null
    });

    res.status(201).json(contributor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contributor = await Contributor.findById(req.params.id);
    if (contributor) {
      res.json(contributor);
    } else {
      res.status(404).json({ error: 'Contributor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const contributor = await Contributor.update(req.params.id, req.body);
    if (contributor) {
      res.json(contributor);
    } else {
      res.status(404).json({ error: 'Contributor not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const contributor = await Contributor.delete(req.params.id);
    if (contributor) {
      res.json({ message: 'Contributor deleted successfully' });
    } else {
      res.status(404).json({ error: 'Contributor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;