const express = require('express');
const Contribution = require('../models/contribution');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Contribution:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *         - amount
 *         - startup_id
 *         - contributor_id
 *       properties:
 *         contribution_id:
 *           type: integer
 *           description: The auto-generated id of the contribution
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: The start date of the contribution
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: The end date of the contribution
 *         amount:
 *           type: number
 *           description: The amount of the contribution
 *         startup_id:
 *           type: integer
 *           description: The id of the startup being contributed to
 *         contributor_id:
 *           type: integer
 *           description: The id of the contributor
 */

/**
 * @swagger
 * tags:
 *   name: Contributions
 *   description: Contribution management
 */

/**
 * @swagger
 * /contributions:
 *   post:
 *     summary: Create a new contribution
 *     tags: [Contributions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contribution'
 *     responses:
 *       201:
 *         description: The created contribution.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contribution'
 *       400:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
  try {
    const contribution = await Contribution.create(req.body);
    res.status(201).json(contribution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /contributions/{id}:
 *   get:
 *     summary: Get a contribution by id
 *     tags: [Contributions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The contribution id
 *     responses:
 *       200:
 *         description: The contribution description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contribution'
 *       404:
 *         description: The contribution was not found
 */
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

/**
 * @swagger
 * /contributions/{id}:
 *  put:
 *    summary: Update the contribution by the id
 *    tags: [Contributions]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The contribution id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Contribution'
 *    responses:
 *      200:
 *        description: The contribution was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Contribution'
 *      404:
 *        description: The contribution was not found
 *      500:
 *        description: Some error happened
 */
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

/**
 * @swagger
 * /contributions/{id}:
 *   delete:
 *     summary: Remove the contribution by id
 *     tags: [Contributions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The contribution id
 *     responses:
 *       200:
 *         description: The contribution was deleted
 *       404:
 *         description: The contribution was not found
 */
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