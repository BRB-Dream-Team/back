const express = require('express');
const Entrepreneur = require('../models/entrepreneur');
const Address = require('../models/address');
const Passport = require('../models/passport');
const BankAgreement = require('../models/bankAgreement');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         street_number:
 *           type: integer
 *         street_name:
 *           type: string
 *         region:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *           default: 'Uzbekistan'
 *         zip:
 *           type: integer
 *     
 *     Passport:
 *       type: object
 *       required:
 *         - series
 *         - number
 *       properties:
 *         series:
 *           type: string
 *         number:
 *           type: integer
 *         issue_date:
 *           type: string
 *           format: date-time
 *         expiration_date:
 *           type: string
 *           format: date-time
 *     
 *     BankAgreement:
 *       type: object
 *       properties:
 *         document:
 *           type: object
 *         is_signed:
 *           type: boolean
 *     
 *     Entrepreneur:
 *       type: object
 *       required:
 *         - gender
 *         - dob
 *       properties:
 *         entrepreneur_id:
 *           type: integer
 *           description: The auto-generated id of the entrepreneur
 *         gender:
 *           type: string
 *           enum: [male, female, non_binary]
 *         dob:
 *           type: string
 *           format: date-time
 *         passport_id:
 *           type: integer
 *         address_id:
 *           type: integer
 *         agreement_id:
 *           type: integer
 *         startup_id:
 *           type: integer
 *
 *     EntrepreneurInput:
 *       type: object
 *       properties:
 *         gender:
 *           type: string
 *           enum: [male, female, non_binary]
 *         dob:
 *           type: string
 *           format: date-time
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         passport:
 *           $ref: '#/components/schemas/Passport'
 *         bankAgreement:
 *           $ref: '#/components/schemas/BankAgreement'
 */

/**
 * @swagger
 * tags:
 *   name: Entrepreneurs
 *   description: Entrepreneur management
 */

/**
 * @swagger
 * /entrepreneurs:
 *   post:
 *     summary: Create a new entrepreneur
 *     tags: [Entrepreneurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntrepreneurInput'
 *     responses:
 *       201:
 *         description: The entrepreneur was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entrepreneur'
 *       400:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /entrepreneurs/{id}:
 *   get:
 *     summary: Get an entrepreneur by id
 *     tags: [Entrepreneurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The entrepreneur id
 *     responses:
 *       200:
 *         description: The entrepreneur data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entrepreneur'
 *       404:
 *         description: The entrepreneur was not found
 *       500:
 *         description: Some error happened
 */
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

/**
 * @swagger
 * /entrepreneurs/{id}:
 *   put:
 *     summary: Update an entrepreneur
 *     tags: [Entrepreneurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The entrepreneur id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entrepreneur'
 *     responses:
 *       200:
 *         description: The entrepreneur was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entrepreneur'
 *       404:
 *         description: The entrepreneur was not found
 *       400:
 *         description: Some error happened
 */
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

/**
 * @swagger
 * /entrepreneurs/{id}:
 *   delete:
 *     summary: Delete an entrepreneur
 *     tags: [Entrepreneurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The entrepreneur id
 *     responses:
 *       200:
 *         description: The entrepreneur was deleted
 *       404:
 *         description: The entrepreneur was not found
 *       500:
 *         description: Some error happened
 */
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