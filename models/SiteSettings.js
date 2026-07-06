const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    // General
    siteName: { type: String, default: 'KAAF' },
    siteTagline: { type: String, default: 'Karim Alaa Architectural Firm' },
    siteDescription: { type: String, default: 'Modern architecture and design solutions that transform spaces into extraordinary experiences.' },

    // Hero Section
    heroBadge: { type: String, default: 'Architecture Studio' },
    heroSubtitle: { type: String, default: 'Transforming visions into extraordinary spaces through innovative design and meticulous craftsmanship.' },

    // About Section (Homepage)
    aboutTagline: { type: String, default: 'About Us' },
    aboutTitle: { type: String, default: 'Crafting Spaces<br>Since 2015' },
    aboutLead: { type: String, default: 'At KAAF, we believe architecture is more than buildings—it\'s about creating experiences that resonate with people and stand the test of time.' },
    aboutText: { type: String, default: 'Founded by Karim Alaa, our firm brings together a passionate team of architects, designers, and innovators dedicated to pushing the boundaries of contemporary design while respecting tradition and context.' },
    aboutImage1: { type: String, default: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80' },
    aboutImage2: { type: String, default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },

    // Stats
    statsProjects: { type: Number, default: 150 },
    statsProjectsLabel: { type: String, default: 'Projects Completed' },
    statsAwards: { type: Number, default: 12 },
    statsAwardsLabel: { type: String, default: 'Design Awards' },
    statsYears: { type: Number, default: 8 },
    statsYearsLabel: { type: String, default: 'Years Experience' },

    // About Page
    aboutPageTitle: { type: String, default: 'Design-Led Excellence in Every Space' },
    aboutPageSubtitle: { type: String, default: 'We create elevated interiors that blend creativity, technical excellence, and premium craftsmanship—shaping spaces with elegance, confidence, and lasting quality.' },
    vision: { type: String, default: 'To become Egypt\'s most trusted interior and architectural finishing partner, creating spaces that inspire, elevate lifestyles, and reflect timeless quality.' },
    mission: { type: String, default: 'We deliver tailored architectural and interior design solutions combining creative expression, technical excellence, and reliable execution. We build spaces our clients love and trust through transparent processes and premium craftsmanship.' },

    // Core Values
    coreValues: [{
        title: { type: String },
        description: { type: String }
    }],

    // Process Steps
    processSteps: [{
        title: { type: String },
        description: { type: String }
    }],

    // Contact Info
    email: { type: String, default: 'hello@kaaf.design' },
    phone: { type: String, default: '+20 123 456 7890' },
    address: { type: String, default: '15 Architectural Plaza<br>New Cairo, Egypt' },
    contactTitle: { type: String, default: 'Let\'s Build<br>Something Great' },
    contactDesc: { type: String, default: 'Ready to transform your vision into reality? We\'d love to hear about your project.' },

    // Social Links
    instagram: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
    behance: { type: String, default: '#' },

    // CTA
    ctaTitle: { type: String, default: 'Ready to Transform Your Space?' },
    ctaText: { type: String, default: 'Let\'s discuss your vision and create something extraordinary together.' },

    // Footer
    footerText: { type: String, default: 'Karim Alaa Architectural Firm' },
    copyrightYear: { type: String, default: String(new Date().getFullYear()) }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
