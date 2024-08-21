const express = require('express');
const Contributor = require('../models/contributor');
const Passport = require('../models/passport');
const BankAgreement = require('../models/bankAgreement');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
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
 *     Contributor:
 *       type: object
 *       required:
 *         - gender
 *         - dob
 *       properties:
 *         contributor_id:
 *           type: integer
 *           description: The auto-generated id of the contributor
 *         gender:
 *           type: string
 *           enum: [male, female, non_binary]
 *         dob:
 *           type: string
 *           format: date-time
 *         passport_id:
 *           type: integer
 *         agreement_id:
 *           type: integer
 *
 *     ContributorInput:
 *       type: object
 *       properties:
 *         gender:
 *           type: string
 *           enum: [male, female, non_binary]
 *         dob:
 *           type: string
 *           format: date-time
 *         passport:
 *           $ref: '#/components/schemas/Passport'
 *         bankAgreement:
 *           $ref: '#/components/schemas/BankAgreement'
 */

/**
 * @swagger
 * tags:
 *   name: Contributors
 *   description: Contributor management
 */

/**
 * @swagger
 * /contributors:
 *   post:
 *     summary: Create a new contributor
 *     tags: [Contributors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContributorInput'
 *     responses:
 *       201:
 *         description: The contributor was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contributor'
 *       400:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
  try {
    const { passport, bankAgreement, ...contributorData } = req.body;

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

/**
 * @swagger
 * /contributors/{id}:
 *   get:
 *     summary: Get a contributor by id
 *     tags: [Contributors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The contributor id
 *     responses:
 *       200:
 *         description: The contributor data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contributor'
 *       404:
 *         description: The contributor was not found
 *       500:
 *         description: Some error happened
 */
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

/**
 * @swagger
 * /contributors/{id}:
 *   put:
 *     summary: Update a contributor
 *     tags: [Contributors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The contributor id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contributor'
 *     responses:
 *       200:
 *         description: The contributor was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contributor'
 *       404:
 *         description: The contributor was not found
 *       400:
 *         description: Some error happened
 */
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

/**
 * @swagger
 * /contributors/{id}:
 *   delete:
 *     summary: Delete a contributor
 *     tags: [Contributors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The contributor id
 *     responses:
 *       200:
 *         description: The contributor was deleted
 *       404:
 *         description: The contributor was not found
 *       500:
 *         description: Some error happened
 */
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