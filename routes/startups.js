const express = require('express');
const Startup = require('../models/startup');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Startup:
 *       type: object
 *       required:
 *         - title
 *         - active_status
 *         - start_date
 *         - end_date
 *         - description
 *         - video_link
 *         - category_id
 *         - region_id
 *       properties:
 *         startup_id:
 *           type: integer
 *           description: The auto-generated id of the startup
 *         title:
 *           type: string
 *           description: The title of the startup
 *         active_status:
 *           type: boolean
 *           description: Whether the startup is active or not
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: The start date of the startup
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: The end date of the startup
 *         description:
 *           type: string
 *           description: The description of the startup
 *         video_link:
 *           type: object
 *           description: The video link for the startup
 *         donated_amount:
 *           type: number
 *           description: The amount donated to the startup
 *         number_of_contributors:
 *           type: integer
 *           description: The number of contributors to the startup
 *         rating:
 *           type: integer
 *           description: The rating of the startup
 *         type:
 *           type: string
 *           enum: [charity, equity]
 *           description: The type of the startup
 *         batch:
 *           type: string
 *           enum: [close_to_the_goal, just_launched, finished, none]
 *           description: The batch status of the startup
 *         category_id:
 *           type: integer
 *           description: The id of the category the startup belongs to
 *         region_id:
 *           type: integer
 *           description: The id of the region the startup is in
 */

/**
 * @swagger
 * tags:
 *   name: Startups
 *   description: Startup management
 */

/**
 * @swagger
 * /api/startups:
 *   post:
 *     summary: Create a new startup
 *     tags: [Startups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Startup'
 *     responses:
 *       201:
 *         description: The created startup.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Startup'
 *       400:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
  try {
    const startup = await Startup.create(req.body);
    res.status(201).json(startup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/startups/{id}:
 *   get:
 *     summary: Get a startup by id
 *     tags: [Startups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The startup id
 *     responses:
 *       200:
 *         description: The startup description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Startup'
 *       404:
 *         description: The startup was not found
 */
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

/**
 * @swagger
 * /api/startups/{id}:
 *  put:
 *    summary: Update the startup by the id
 *    tags: [Startups]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The startup id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Startup'
 *    responses:
 *      200:
 *        description: The startup was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Startup'
 *      404:
 *        description: The startup was not found
 *      500:
 *        description: Some error happened
 */
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

/**
 * @swagger
 * /api/startups/{id}:
 *   delete:
 *     summary: Remove the startup by id
 *     tags: [Startups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The startup id
 *     responses:
 *       200:
 *         description: The startup was deleted
 *       404:
 *         description: The startup was not found
 */
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