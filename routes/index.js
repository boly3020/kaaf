const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Project = require('../models/Project');
const Service = require('../models/Service');
const SiteSettings = require('../models/SiteSettings');
const ContactMessage = require('../models/ContactMessage');

// Helper to get settings
async function getSettings() {
    let settings = await SiteSettings.findOne();
    if (!settings) {
        settings = await SiteSettings.create({});
    }
    return settings;
}

// Homepage
router.get('/', async (req, res) => {
    try {
        const settings = await getSettings();
        const projects = await Project.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        const services = await Service.find({ page: 'home', isActive: true }).sort({ order: 1 });

        res.render('public/index', {
            layout: 'layouts/main',
            title: 'KAAF | Karim Alaa Architectural Firm',
            settings,
            projects,
            services,
            page: 'home'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// About page
router.get('/about', async (req, res) => {
    try {
        const settings = await getSettings();
        const services = await Service.find({ page: 'about', isActive: true }).sort({ order: 1 });

        res.render('public/about', {
            layout: 'layouts/main',
            title: 'About Us | KAAF',
            settings,
            services,
            page: 'about'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Project detail page
router.get('/projects/:slug', async (req, res) => {
    try {
        const settings = await getSettings();
        const project = await Project.findOne({ slug: req.params.slug, isActive: true });

        if (!project) {
            return res.status(404).render('public/404', {
                layout: 'layouts/main',
                title: 'Project Not Found',
                settings
            });
        }

        res.render('public/project', {
            layout: false,
            title: `${project.title} | KAAF`,
            settings,
            project,
            page: 'project'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Sitemap for search engines
router.get('/sitemap.xml', async (req, res) => {
    try {
        const base = `${req.protocol}://${req.get('host')}`;
        const projects = await Project.find({ isActive: true }).select('slug updatedAt');

        const urls = [
            `<url><loc>${base}/</loc></url>`,
            `<url><loc>${base}/about</loc></url>`,
            ...projects.map(p =>
                `<url><loc>${base}/projects/${p.slug}</loc><lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod></url>`
            )
        ];

        res.type('application/xml').send(
            `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`
        );
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});

// Limit contact submissions to reduce spam floods
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many messages sent. Please try again later.' }
});

// Contact form submission
router.post('/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, phone, project, message, company } = req.body;

        // Honeypot: real users never fill this hidden field
        if (company) {
            return res.json({ success: true, message: 'Message sent successfully!' });
        }

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
        }

        await ContactMessage.create({
            name,
            email,
            phone,
            projectType: project,
            message
        });

        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;
