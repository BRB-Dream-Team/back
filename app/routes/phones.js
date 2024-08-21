const express = require('express');
const Phone = require('../models/phone');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Phone:
 *       type: object
 *       required:
 *         - mobile_operator_code
 *         - phone_number
 *       properties:
 *         phone_id:
 *           type: integer
 *           description: The auto-generated id of the phone
 *         country_code:
 *           type: integer
 *           description: The country code
 *           default: 998
 *         mobile_operator_code:
 *           type: integer
 *           description: The mobile operator code
 *         phone_number:
 *           type: integer
 *           description: The phone number
 */

/**
 * @swagger
 * tags:
 *   name: Phones
 *   description: Phone management
 */

/**
 * @swagger
 * /phones:
 *   post:
 *     summary: Create a new phone
 *     tags: [Phones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Phone'
 *     responses:
 *       201:
 *         description: The created phone.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Phone'
 *       400:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
  try {
    const phone = await Phone.create(req.body);
    res.status(201).json(phone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /phones/{id}:
 *   get:
 *     summary: Get a phone by id
 *     tags: [Phones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The phone id
 *     responses:
 *       200:
 *         description: The phone description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Phone'
 *       404:
 *         description: The phone was not found
 */
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

/**
 * @swagger
 * /phones/{id}:
 *  put:
 *    summary: Update the phone by the id
 *    tags: [Phones]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The phone id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Phone'
 *    responses:
 *      200:
 *        description: The phone was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Phone'
 *      404:
 *        description: The phone was not found
 *      500:
 *        description: Some error happened
 */
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

/**
 * @swagger
 * /phones/{id}:
 *   delete:
 *     summary: Remove the phone by id
 *     tags: [Phones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The phone id
 * 
 *     responses:
 *       200:
 *         description: The phone was deleted
 *       404:
 *         description: The phone was not found
 */
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