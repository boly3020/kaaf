require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');

const app = express();

// Trust proxy for Railway/Render (needed for secure cookies behind reverse proxy)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB().then(() => {
    // Auto-seed on first run if DB is empty
    seedIfEmpty();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override for PUT/DELETE in forms
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'kaaf-fallback-secret-change-me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Global variables for templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId || null;
    res.locals.currentPath = req.path;
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res) => {
    res.status(404).render('public/404', {
        layout: 'layouts/main',
        title: 'Page Not Found',
        settings: {}
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Auto-seed database on first run
async function seedIfEmpty() {
    try {
        const User = require('./models/User');
        const SiteSettings = require('./models/SiteSettings');
        const Project = require('./models/Project');
        const Service = require('./models/Service');

        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Database already seeded.');
            return;
        }

        console.log('Empty database detected. Running auto-seed...');

        // Create admin user
        await User.create({
            name: 'Karim Alaa',
            email: process.env.ADMIN_EMAIL || 'admin@kaaf.design',
            password: process.env.ADMIN_PASSWORD || 'admin123'
        });

        // Create projects
        await Project.create([
            {
                title: 'Luxury Residential Villa',
                category: 'Residential Villa',
                description: 'A stunning luxury residential villa featuring contemporary interior design with elegant finishes and sophisticated spatial planning. This project showcases our expertise in creating harmonious living spaces that blend modern aesthetics with exceptional functionality and comfort.',
                location: 'New Cairo, Egypt',
                year: '2025',
                type: 'Residential Villa',
                status: 'Design Development',
                area: '450 m\u00B2',
                floors: '3 Floors + Basement',
                featuredImage: '/assets/WhatsApp Image 2025-12-09 at 11.40.44 AM.jpeg',
                galleryImages: [
                    '/assets/WhatsApp Image 2025-12-09 at 11.40.45 AM (1).jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.42.14 AM.jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.40.45 AM (2).jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.40.44 AM (1).jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.40.46 AM (1).jpeg'
                ],
                isFeatured: true,
                order: 1,
                isActive: true
            },
            {
                title: 'Contemporary Cafe Design',
                category: 'Commercial Interior',
                description: 'A modern cafe interior that combines warm tones with contemporary design elements. The space features thoughtful lighting design, custom furniture, and a cohesive material palette that creates an inviting atmosphere for guests.',
                location: 'New Cairo, Egypt',
                year: '2025',
                type: 'Commercial Interior',
                status: 'Design Development',
                area: '200 m\u00B2',
                featuredImage: '/assets/WhatsApp Image 2025-12-09 at 11.40.46 AM (1).jpeg',
                galleryImages: [
                    '/assets/WhatsApp Image 2025-12-09 at 11.40.46 AM.jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.40.47 AM.jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.40.47 AM (1).jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.40.47 AM (2).jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.40.48 AM.jpeg'
                ],
                isFeatured: false,
                order: 2,
                isActive: true
            },
            {
                title: 'Modern Living Space',
                category: 'Residential Interior',
                description: 'A contemporary residential interior featuring minimalist design principles with warm material selections. The open-plan living area seamlessly connects spaces while maintaining distinct functional zones.',
                location: 'New Cairo, Egypt',
                year: '2025',
                type: 'Residential Interior',
                status: 'Design Development',
                area: '320 m\u00B2',
                style: 'Contemporary Minimalist',
                featuredImage: '/assets/WhatsApp Image 2025-12-09 at 11.42.14 AM.jpeg',
                galleryImages: [
                    '/assets/WhatsApp Image 2025-12-09 at 11.42.14 AM (1).jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.42.15 AM.jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.42.15 AM (1).jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.42.15 AM (2).jpeg'
                ],
                isFeatured: false,
                order: 3,
                isActive: true
            }
        ]);

        // Create home services
        await Service.create([
            { title: 'Architectural Design', description: 'Comprehensive architectural solutions from concept to completion, tailored to your unique vision and requirements.', icon: 'architectural', order: 1, page: 'home', isActive: true },
            { title: 'Interior Design', description: 'Creating harmonious interior spaces that blend functionality with aesthetic excellence.', icon: 'interior', order: 2, page: 'home', isActive: true },
            { title: 'Urban Planning', description: 'Sustainable urban development strategies that enhance communities and respect the environment.', icon: 'urban', order: 3, page: 'home', isActive: true },
            { title: 'Project Management', description: 'End-to-end project oversight ensuring timely delivery, quality control, and budget management.', icon: 'project-management', order: 4, page: 'home', isActive: true }
        ]);

        // Create about services
        await Service.create([
            { title: 'Interior Design', description: 'Curated design concepts that harmonize aesthetics, lifestyle, and function.', icon: 'interior', order: 1, page: 'about', isActive: true },
            { title: 'Architectural Finishing', description: 'High-end finishing with meticulous attention to detail, ensuring precision in materials and execution.', icon: 'architectural', order: 2, page: 'about', isActive: true },
            { title: 'Turnkey Solutions', description: 'Complete project management from concept to completion, ensuring consistency and quality.', icon: 'turnkey', order: 3, page: 'about', isActive: true },
            { title: 'Renovation & Remodeling', description: 'Revitalizing existing spaces with refreshed layouts, updated materials, and refined design.', icon: 'renovation', order: 4, page: 'about', isActive: true }
        ]);

        // Create site settings
        await SiteSettings.create({
            siteName: 'KAAF',
            siteTagline: 'Karim Alaa Architectural Firm',
            siteDescription: 'KAAF - Karim Alaa Architectural Firm. Modern architecture and design solutions that transform spaces into extraordinary experiences.',
            heroBadge: 'Architecture Studio',
            heroSubtitle: 'Transforming visions into extraordinary spaces through innovative design and meticulous craftsmanship.',
            aboutTagline: 'About Us',
            aboutTitle: 'Crafting Spaces<br>Since 2015',
            aboutLead: 'At KAAF, we believe architecture is more than buildings\u2014it\'s about creating experiences that resonate with people and stand the test of time.',
            aboutText: 'Founded by Karim Alaa, our firm brings together a passionate team of architects, designers, and innovators dedicated to pushing the boundaries of contemporary design while respecting tradition and context.',
            aboutImage1: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80',
            aboutImage2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
            statsProjects: 150, statsProjectsLabel: 'Projects Completed',
            statsAwards: 12, statsAwardsLabel: 'Design Awards',
            statsYears: 8, statsYearsLabel: 'Years Experience',
            aboutPageTitle: 'Design-Led Excellence in Every Space',
            aboutPageSubtitle: 'We create elevated interiors that blend creativity, technical excellence, and premium craftsmanship.',
            vision: 'To become Egypt\'s most trusted interior and architectural finishing partner, creating spaces that inspire, elevate lifestyles, and reflect timeless quality.',
            mission: 'We deliver tailored architectural and interior design solutions combining creative expression, technical excellence, and reliable execution.',
            coreValues: [
                { title: 'Integrity & Transparency', description: 'Honest communication and ethical practices in every interaction.' },
                { title: 'Quality Craftsmanship', description: 'High standards, precise execution, and long-lasting finishes.' },
                { title: 'Creativity & Innovation', description: 'Vision-driven design enhanced by modern technologies.' },
                { title: 'Client-Centered Service', description: 'Tailored solutions built around each client\'s lifestyle and needs.' },
                { title: 'Reliability & Accountability', description: 'Commitment to timelines, clarity, and responsibility.' },
                { title: 'Safety First', description: 'Safe worksites and industry best practices.' }
            ],
            processSteps: [
                { title: 'Consultation & Site Visit', description: 'We understand your vision, assess the space, and define project goals.' },
                { title: 'Concept & Space Planning', description: 'We create moodboards and layouts tailored to your style and function.' },
                { title: '3D Visualization', description: 'Photorealistic renderings so you can see the final result before construction.' },
                { title: 'Technical Documentation', description: 'Precise working drawings ensure smooth and accurate execution.' },
                { title: 'BOQ & Costing', description: 'Transparent, itemized cost breakdowns so you know where your investment goes.' },
                { title: 'Procurement', description: 'We source premium materials from trusted suppliers.' },
                { title: 'Construction & Finishing', description: 'Strict supervision and quality control at every phase.' },
                { title: 'Handover & After-Sales', description: 'Full inspection and ongoing support to ensure your satisfaction.' }
            ],
            email: 'hello@kaaf.design',
            phone: '+20 123 456 7890',
            address: '15 Architectural Plaza<br>New Cairo, Egypt',
            contactTitle: 'Let\'s Build<br>Something Great',
            contactDesc: 'Ready to transform your vision into reality? We\'d love to hear about your project.',
            instagram: '#', linkedin: '#', behance: '#',
            ctaTitle: 'Ready to Transform Your Space?',
            ctaText: 'Let\'s discuss your vision and create something extraordinary together.',
            footerText: 'Karim Alaa Architectural Firm',
            copyrightYear: '2025'
        });

        console.log('Auto-seed complete! Admin: admin@kaaf.design / admin123');
    } catch (err) {
        console.error('Auto-seed error:', err.message);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`KAAF server running on port ${PORT}`);
});
