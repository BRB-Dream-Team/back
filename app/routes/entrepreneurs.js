const express = require('express');
const Entrepreneur = require('../models/entrepreneur');
const Address = require('../models/address');
const Passport = require('../models/passport');
const BankAgreement = require('../models/bankAgreement');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { address, passport, bankAgreement, ...entrepreneurData } = req.body;

    // Create related entities
    const createdAddress = await Address.create(address);
    const createdPassport = await Passport.create(passport);
    let createdAgreement = null;
    if (bankAgreement) {
      createdAgreement = await BankAgreement.create(bankAgreement);
    }

    // Create entrepreneur
    const entrepreneur = await Entrepreneur.create({
      ...entrepreneurData,
      address_id: createdAddress.address_id,
      passport_id: createdPassport.passport_id,
      agreement_id: createdAgreement ? createdAgreement.agreement_id : null
    });

    res.status(201).json(entrepreneur);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.findById(req.params.id);
    if (entrepreneur) {
      res.json(entrepreneur);
    } else {
      res.status(404).json({ error: 'Entrepreneur not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.update(req.params.id, req.body);
    if (entrepreneur) {
      res.json(entrepreneur);
    } else {
      res.status(404).json({ error: 'Entrepreneur not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.delete(req.params.id);
    if (entrepreneur) {
      res.json({ message: 'Entrepreneur deleted successfully' });
    } else {
      res.status(404).json({ error: 'Entrepreneur not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;