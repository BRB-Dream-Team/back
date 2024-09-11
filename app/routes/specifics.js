const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Startup = require('../models/startup');
const Entrepreneur = require('../models/entrepreneur');
const Contributor = require('../models/contributor');
const Contribution = require('../models/contribution');
const Phone = require('../models/phone');
const Passport = require('../models/passport');
const Address = require('../models/address');
const Region = require('../models/region');
const Category = require('../models/category');

// User profile route
router.get('/user/:id?', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { first_name, last_name, email, entrepreneur_id, contributor_id } = user;
    
    let profileData = {
      first_name,
      last_name: req.user.user_id === userId ? last_name : `${last_name.charAt(0)}.`,
    };

    if (req.user.user_id === userId) {
      // User is viewing their own profile
      const phone = await Phone.findById(user.phone_id);
      profileData.email = email;
      profileData.phone_number = phone ? phone.phone_number : null;

      if (entrepreneur_id) {
        const entrepreneur = await Entrepreneur.findById(entrepreneur_id);
        profileData.entrepreneur = {
          gender: entrepreneur.gender,
          passport: await Passport.findById(entrepreneur.passport_id),
          address: await Address.findById(entrepreneur.address_id)
        };
        
        const startup = await Startup.findById(entrepreneur.startup_id);
        if (startup) {
          profileData.entrepreneur.startup_ids = [startup.startup_id];
        }
      }

      if (contributor_id) {
        const contributor = await Contributor.findById(contributor_id);
        profileData.contributor = {
          gender: contributor.gender,
          passport: await Passport.findById(contributor.passport_id)
        };
        
        const contributions = await Contribution.findByContributorId(contributor_id);
        profileData.contributor.contribution_ids = contributions.map(c => c.contribution_id);
      }
    } else {
      // User is viewing someone else's profile
      if (entrepreneur_id) {
        const entrepreneur = await Entrepreneur.findById(entrepreneur_id);
        const startup = await Startup.findById(entrepreneur.startup_id);
        if (startup) {
          profileData.startup_ids = [startup.startup_id];
        }
      }
    }

    res.json(profileData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Startup info route
router.get('/startup/:id', authenticateUser, async (req, res) => {
    try {
      const startup = await Startup.findById(req.params.id);
      if (!startup) {
        return res.status(404).json({ error: 'Startup not found' });
      }
  
      const region = await Region.findById(startup.region_id);
      const category = await Category.findById(startup.category_id);
  
      let startupData = {
        title: startup.title,
        status: startup.active_status,
        end_date: startup.end_date,
        description: startup.description,
        video: startup.video_link,
        donated_amount: startup.donated_amount,
        number_of_contributors: startup.number_of_contributors,
        rating: startup.rating,
        type: startup.type,
        batch: startup.batch,
        region: region ? region.name : null,
        category: category ? category.name : null
      };
  
      const user = await User.findById(req.userId);
      const entrepreneur = await Entrepreneur.findOne({ startup_id: startup.startup_id });
      
      // Check if user is the entrepreneur of this startup
      const isEntrepreneur = entrepreneur && user.entrepreneur_id === entrepreneur.entrepreneur_id;
      
      // Check if user is a contributor to this startup
      const isContributor = user.contributor_id ? await Contribution.exists({
        startup_id: startup.startup_id,
        contributor_id: user.contributor_id
      }) : false;
  
      if (isEntrepreneur || isContributor) {
        // Include agreement information for entrepreneurs and contributors
        const agreement = await Agreement.findById(startup.agreement_id);
        if (agreement) {
          startupData.agreement = agreement;
        }
      }
  
      if (entrepreneur) {
        const entrepreneurUser = await User.findOne({ entrepreneur_id: entrepreneur.entrepreneur_id });
        startupData.entrepreneur_name = `${entrepreneurUser.first_name} ${entrepreneurUser.last_name.charAt(0)}.`;
        if (isContributor) {
          startupData.entrepreneur_email = entrepreneurUser.email;
        }
      }
  
      res.json(startupData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Get all startups
router.get('/startup/all', async (req, res) => {
  try {
    const startups = await Startup.findAll();
    const startupData = await Promise.all(startups.map(async (startup) => {
      const region = await Region.findById(startup.region_id);
      const category = await Category.findById(startup.category_id);
      
      return {
        title: startup.title,
        status: startup.active_status,
        end_date: startup.end_date,
        description: startup.description,
        video: startup.video_link,
        donated_amount: startup.donated_amount,
        number_of_contributors: startup.number_of_contributors,
        rating: startup.rating,
        type: startup.type,
        batch: startup.batch,
        region: region ? region.name : null,
        category: category ? category.name : null
      };
    }));
    
    res.json(startupData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contribution info route
router.get('/contribution/:id', authenticateUser, async (req, res) => {
    try {
      const contribution = await Contribution.findById(req.params.id);
      if (!contribution) {
        return res.status(404).json({ error: 'Contribution not found' });
      }
  
      const user = await User.findById(req.userId);
      
      // Check if the authenticated user is the contributor
      const isContributor = user.contributor_id === contribution.contributor_id;
  
      // Check if the authenticated user is the entrepreneur of the startup
      let isEntrepreneur = false;
      if (user.entrepreneur_id) {
        const startup = await Startup.findById(contribution.startup_id);
        if (startup) {
          const entrepreneur = await Entrepreneur.findById(user.entrepreneur_id);
          isEntrepreneur = entrepreneur && entrepreneur.startup_id === startup.startup_id;
        }
      }
  
      if (!isContributor && !isEntrepreneur) {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      const contributionData = {
        startup_id: contribution.startup_id,
        date: contribution.start_date,
        amount: contribution.amount
      };
  
      // If the user is the entrepreneur, include contributor information
      if (isEntrepreneur) {
        const contributor = await Contributor.findById(contribution.contributor_id);
        const contributorUser = await User.findOne({ contributor_id: contributor.contributor_id });
        contributionData.contributor_name = `${contributorUser.first_name} ${contributorUser.last_name.charAt(0)}.`;
      }
  
      res.json(contributionData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Get all contributions for a specific startup
router.get('/contribution/all/:id', async (req, res) => {
  try {
    const startupId = req.params.id;
    const contributions = await Contribution.findByStartupId(startupId);
    
    if (!contributions || contributions.length === 0) {
      return res.status(404).json({ error: 'No contributions found for this startup' });
    }
    
    const contributionData = contributions.map(contribution => ({
      id: contribution.contribution_id,
      startup_id: contribution.startup_id,
      date: contribution.start_date,
      amount: contribution.amount
    }));
    
    res.json(contributionData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get summary of contributions
router.get('/contribution/summary', async (req, res) => {
  try {
    const allContributions = await Contribution.findAll();
    
    const totalAmount = allContributions.reduce((sum, contribution) => sum + contribution.amount, 0);
    const totalContributions = allContributions.length;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentContributions = allContributions.filter(contribution => 
      new Date(contribution.start_date) >= sevenDaysAgo
    ).length;
    
    res.json({
      total_amount: totalAmount,
      total_contributions: totalContributions,
      recent_contributions: recentContributions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;