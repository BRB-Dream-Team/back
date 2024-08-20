const express = require('express');
const Region = require('../models/region');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Region:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         region_id:
 *           type: integer
 *           description: The auto-generated id of the region
 *         name:
 *           type: string
 *           description: The name of the region
 */

/**
 * @swagger
 * tags:
 *   name: Regions
 *   description: Region management
 */

/**
 * @swagger
 * /api/regions:
 *   post:
 *     summary: Create a new region
 *     tags: [Regions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Region'
 *     responses:
 *       201:
 *         description: The created region.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Region'
 *       400:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
  try {
    const region = await Region.create(req.body);
    res.status(201).json(region);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/regions/{id}:
 *   get:
 *     summary: Get a region by id
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The region id
 *     responses:
 *       200:
 *         description: The region description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Region'
 *       404:
 *         description: The region was not found
 */
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

/**
 * @swagger
 * /api/regions/{id}:
 *  put:
 *    summary: Update the region by the id
 *    tags: [Regions]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The region id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Region'
 *    responses:
 *      200:
 *        description: The region was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Region'
 *      404:
 *        description: The region was not found
 *      500:
 *        description: Some error happened
 */
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

/**
 * @swagger
 * /api/regions/{id}:
 *   delete:
 *     summary: Remove the region by id
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The region id
 *     responses:
 *       200:
 *         description: The region was deleted
 *       404:
 *         description: The region was not found
 */
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