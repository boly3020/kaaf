const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { isAuthenticated, isGuest } = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
const Project = require('../models/Project');
const Service = require('../models/Service');
const SiteSettings = require('../models/SiteSettings');
const ContactMessage = require('../models/ContactMessage');
const fs = require('fs');
const path = require('path');

// All admin routes use admin layout
router.use((req, res, next) => {
    res.locals.layout = 'layouts/admin';
    next();
});

// ============================================================
// AUTH
// ============================================================

// Login page
router.get('/login', isGuest, (req, res) => {
    res.render('admin/login', {
        layout: false,
        title: 'Admin Login',
        error: null
    });
});

// Limit login attempts to slow down brute-force attacks
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).render('admin/login', {
            layout: false,
            title: 'Admin Login',
            error: 'Too many login attempts. Please try again in 15 minutes.'
        });
    }
});

// Login handler
router.post('/login', loginLimiter, isGuest, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.render('admin/login', {
                layout: false,
                title: 'Admin Login',
                error: 'Invalid email or password'
            });
        }

        req.session.userId = user._id;
        req.session.userName = user.name;
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.render('admin/login', {
            layout: false,
            title: 'Admin Login',
            error: 'Something went wrong'
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// ============================================================
// DASHBOARD
// ============================================================

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const projectCount = await Project.countDocuments();
        const serviceCount = await Service.countDocuments();
        const messageCount = await ContactMessage.countDocuments();
        const unreadCount = await ContactMessage.countDocuments({ isRead: false });
        const recentMessages = await ContactMessage.find().sort({ createdAt: -1 }).limit(5);
        const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5);

        res.render('admin/dashboard', {
            title: 'Dashboard',
            projectCount,
            serviceCount,
            messageCount,
            unreadCount,
            recentMessages,
            recentProjects,
            userName: req.session.userName
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ============================================================
// PROJECTS CRUD
// ============================================================

// List all projects
router.get('/projects', isAuthenticated, async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.render('admin/projects', {
            title: 'Manage Projects',
            projects
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// New project form
router.get('/projects/new', isAuthenticated, (req, res) => {
    res.render('admin/project-form', {
        title: 'Add New Project',
        project: null,
        error: null
    });
});

// Create project
router.post('/projects', isAuthenticated, upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 20 },
    { name: 'pdfFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = req.body;

        if (req.files.featuredImage) {
            data.featuredImage = '/uploads/projects/' + req.files.featuredImage[0].filename;
        }

        if (req.files.galleryImages) {
            data.galleryImages = req.files.galleryImages.map(f => '/uploads/projects/' + f.filename);
        }

        if (req.files.pdfFile) {
            data.pdfFile = '/uploads/projects/' + req.files.pdfFile[0].filename;
        }

        data.isFeatured = data.isFeatured === 'on';
        data.isActive = data.isActive === 'on';

        await Project.create(data);
        res.redirect('/admin/projects');
    } catch (err) {
        console.error(err);
        res.render('admin/project-form', {
            title: 'Add New Project',
            project: req.body,
            error: err.message
        });
    }
});

// Edit project form
router.get('/projects/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.redirect('/admin/projects');

        res.render('admin/project-form', {
            title: 'Edit Project',
            project,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/projects');
    }
});

// Update project
router.put('/projects/:id', isAuthenticated, upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 20 },
    { name: 'pdfFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.redirect('/admin/projects');

        const data = req.body;

        if (req.files.featuredImage) {
            data.featuredImage = '/uploads/projects/' + req.files.featuredImage[0].filename;
        }

        if (req.files.galleryImages && req.files.galleryImages.length > 0) {
            const newImages = req.files.galleryImages.map(f => '/uploads/projects/' + f.filename);
            data.galleryImages = (project.galleryImages || []).concat(newImages);
        }

        if (req.files.pdfFile) {
            data.pdfFile = '/uploads/projects/' + req.files.pdfFile[0].filename;
        }

        data.isFeatured = data.isFeatured === 'on';
        data.isActive = data.isActive === 'on';

        await Project.findByIdAndUpdate(req.params.id, data, { runValidators: true });
        res.redirect('/admin/projects');
    } catch (err) {
        console.error(err);
        const project = await Project.findById(req.params.id);
        res.render('admin/project-form', {
            title: 'Edit Project',
            project: project || req.body,
            error: err.message
        });
    }
});

// Delete project
router.delete('/projects/:id', isAuthenticated, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.redirect('/admin/projects');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/projects');
    }
});

// Remove single gallery image from project
router.post('/projects/:id/remove-image', isAuthenticated, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        await Project.findByIdAndUpdate(req.params.id, {
            $pull: { galleryImages: imageUrl }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// ============================================================
// SERVICES CRUD
// ============================================================

router.get('/services', isAuthenticated, async (req, res) => {
    try {
        const services = await Service.find().sort({ page: 1, order: 1 });
        res.render('admin/services', {
            title: 'Manage Services',
            services
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/services/new', isAuthenticated, (req, res) => {
    res.render('admin/service-form', {
        title: 'Add New Service',
        service: null,
        error: null
    });
});

router.post('/services', isAuthenticated, async (req, res) => {
    try {
        const data = req.body;
        data.isActive = data.isActive === 'on';
        await Service.create(data);
        res.redirect('/admin/services');
    } catch (err) {
        console.error(err);
        res.render('admin/service-form', {
            title: 'Add New Service',
            service: req.body,
            error: err.message
        });
    }
});

router.get('/services/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.redirect('/admin/services');

        res.render('admin/service-form', {
            title: 'Edit Service',
            service,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/services');
    }
});

router.put('/services/:id', isAuthenticated, async (req, res) => {
    try {
        const data = req.body;
        data.isActive = data.isActive === 'on';
        await Service.findByIdAndUpdate(req.params.id, data, { runValidators: true });
        res.redirect('/admin/services');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/services');
    }
});

router.delete('/services/:id', isAuthenticated, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.redirect('/admin/services');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/services');
    }
});

// ============================================================
// SITE SETTINGS
// ============================================================

router.get('/settings', isAuthenticated, async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) settings = await SiteSettings.create({});

        res.render('admin/settings', {
            title: 'Site Settings',
            settings,
            success: req.query.success === '1'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/settings', isAuthenticated, upload.fields([
    { name: 'aboutImage1File', maxCount: 1 },
    { name: 'aboutImage2File', maxCount: 1 }
]), async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) settings = new SiteSettings();

        const data = req.body;

        // Handle about images upload
        if (req.files && req.files.aboutImage1File) {
            data.aboutImage1 = '/uploads/projects/' + req.files.aboutImage1File[0].filename;
        }
        if (req.files && req.files.aboutImage2File) {
            data.aboutImage2 = '/uploads/projects/' + req.files.aboutImage2File[0].filename;
        }

        // Normalize social links: strip a leading '#' left over from the
        // placeholder when a URL is pasted after it (e.g. "#https://...")
        ['instagram', 'linkedin', 'behance'].forEach(key => {
            if (typeof data[key] === 'string') {
                data[key] = data[key].trim().replace(/^#+(?=\S)/, '') || '#';
            }
        });

        // Handle core values
        if (data.valueTitle && data.valueDesc) {
            const titles = Array.isArray(data.valueTitle) ? data.valueTitle : [data.valueTitle];
            const descs = Array.isArray(data.valueDesc) ? data.valueDesc : [data.valueDesc];
            data.coreValues = titles.map((t, i) => ({
                title: t,
                description: descs[i] || ''
            })).filter(v => v.title);
        }

        // Handle process steps
        if (data.stepTitle && data.stepDesc) {
            const titles = Array.isArray(data.stepTitle) ? data.stepTitle : [data.stepTitle];
            const descs = Array.isArray(data.stepDesc) ? data.stepDesc : [data.stepDesc];
            data.processSteps = titles.map((t, i) => ({
                title: t,
                description: descs[i] || ''
            })).filter(v => v.title);
        }

        // Clean up temporary form fields
        delete data.valueTitle;
        delete data.valueDesc;
        delete data.stepTitle;
        delete data.stepDesc;
        delete data.aboutImage1File;
        delete data.aboutImage2File;

        await SiteSettings.findOneAndUpdate({}, data, { upsert: true });
        res.redirect('/admin/settings?success=1');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/settings');
    }
});

// ============================================================
// MESSAGES
// ============================================================

router.get('/messages', isAuthenticated, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.render('admin/messages', {
            title: 'Contact Messages',
            messages
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/messages/:id', isAuthenticated, async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.redirect('/admin/messages');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/messages');
    }
});

module.exports = router;
