require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Service = require('../models/Service');
const SiteSettings = require('../models/SiteSettings');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Project.deleteMany({});
        await Service.deleteMany({});
        await SiteSettings.deleteMany({});

        // Create admin user
        const admin = await User.create({
            name: 'Karim Alaa',
            email: process.env.ADMIN_EMAIL || 'admin@kaaf.design',
            password: process.env.ADMIN_PASSWORD || 'admin123'
        });
        console.log('Admin user created:', admin.email);

        // Create projects
        const projects = await Project.create([
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
                description: 'A contemporary residential interior featuring minimalist design principles with warm material selections. The open-plan living area seamlessly connects spaces while maintaining distinct functional zones through thoughtful furniture placement and lighting.',
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
                    '/assets/WhatsApp Image 2025-12-09 at 11.42.15 AM (2).jpeg',
                    '/assets/WhatsApp Image 2025-12-09 at 11.42.16 AM.jpeg'
                ],
                isFeatured: false,
                order: 3,
                isActive: true
            }
        ]);
        console.log(`${projects.length} projects created`);

        // Create services - Homepage
        const homeServices = await Service.create([
            {
                title: 'Architectural Design',
                description: 'Comprehensive architectural solutions from concept to completion, tailored to your unique vision and requirements.',
                icon: 'architectural',
                order: 1,
                page: 'home',
                isActive: true
            },
            {
                title: 'Interior Design',
                description: 'Creating harmonious interior spaces that blend functionality with aesthetic excellence.',
                icon: 'interior',
                order: 2,
                page: 'home',
                isActive: true
            },
            {
                title: 'Urban Planning',
                description: 'Sustainable urban development strategies that enhance communities and respect the environment.',
                icon: 'urban',
                order: 3,
                page: 'home',
                isActive: true
            },
            {
                title: 'Project Management',
                description: 'End-to-end project oversight ensuring timely delivery, quality control, and budget management.',
                icon: 'project-management',
                order: 4,
                page: 'home',
                isActive: true
            }
        ]);

        // Create services - About Page
        const aboutServices = await Service.create([
            {
                title: 'Interior Design',
                description: 'Curated design concepts that harmonize aesthetics, lifestyle, and function. Each project guided by texture, proportion, lighting, and spatial identity.',
                icon: 'interior',
                order: 1,
                page: 'about',
                isActive: true
            },
            {
                title: 'Architectural Finishing',
                description: 'High-end finishing with meticulous attention to detail, ensuring precision in materials, installation, and overall execution.',
                icon: 'architectural',
                order: 2,
                page: 'about',
                isActive: true
            },
            {
                title: 'Turnkey Solutions',
                description: 'Complete project management from concept to completion, ensuring consistency, quality, and peace of mind.',
                icon: 'turnkey',
                order: 3,
                page: 'about',
                isActive: true
            },
            {
                title: 'Renovation & Remodeling',
                description: 'Revitalizing existing spaces with refreshed layouts, updated materials, and refined design direction.',
                icon: 'renovation',
                order: 4,
                page: 'about',
                isActive: true
            }
        ]);
        console.log(`${homeServices.length + aboutServices.length} services created`);

        // Create site settings
        const settings = await SiteSettings.create({
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
            statsProjects: 150,
            statsProjectsLabel: 'Projects Completed',
            statsAwards: 12,
            statsAwardsLabel: 'Design Awards',
            statsYears: 8,
            statsYearsLabel: 'Years Experience',
            aboutPageTitle: 'Design-Led Excellence in Every Space',
            aboutPageSubtitle: 'We create elevated interiors that blend creativity, technical excellence, and premium craftsmanship\u2014shaping spaces with elegance, confidence, and lasting quality.',
            vision: 'To become Egypt\'s most trusted interior and architectural finishing partner, creating spaces that inspire, elevate lifestyles, and reflect timeless quality.',
            mission: 'We deliver tailored architectural and interior design solutions combining creative expression, technical excellence, and reliable execution. We build spaces our clients love and trust through transparent processes and premium craftsmanship.',
            coreValues: [
                { title: 'Integrity & Transparency', description: 'Honest communication and ethical practices in every interaction.' },
                { title: 'Quality Craftsmanship', description: 'High standards, precise execution, and long-lasting finishes.' },
                { title: 'Creativity & Innovation', description: 'Vision-driven design enhanced by modern technologies.' },
                { title: 'Client-Centered Service', description: 'Tailored solutions built around each client\'s lifestyle and needs.' },
                { title: 'Reliability & Accountability', description: 'Commitment to timelines, clarity, and responsibility.' },
                { title: 'Safety First', description: 'Safe worksites and industry best practices.' }
            ],
            processSteps: [
                { title: 'Consultation & Site Visit', description: 'We understand your vision, assess the space, and define project goals to ensure we\'re aligned from the start.' },
                { title: 'Concept & Space Planning', description: 'We create moodboards and layouts tailored to your style and function, bringing your vision to life on paper.' },
                { title: '3D Visualization', description: 'We bring your space to life with photorealistic renderings so you can see the final result before construction begins.' },
                { title: 'Technical Documentation', description: 'Precise working drawings ensure smooth and accurate execution by our construction team.' },
                { title: 'BOQ & Costing', description: 'We provide transparent, itemized cost breakdowns so you know exactly where your investment goes.' },
                { title: 'Procurement', description: 'We source premium materials from trusted suppliers, ensuring quality and durability.' },
                { title: 'Construction & Finishing', description: 'Our team handles all execution stages with strict supervision and quality control at every phase.' },
                { title: 'Handover & After-Sales', description: 'Your finished space is delivered with a full inspection and ongoing support to ensure your satisfaction.' }
            ],
            email: 'hello@kaaf.design',
            phone: '+20 123 456 7890',
            address: '15 Architectural Plaza<br>New Cairo, Egypt',
            contactTitle: 'Let\'s Build<br>Something Great',
            contactDesc: 'Ready to transform your vision into reality? We\'d love to hear about your project.',
            instagram: '#',
            linkedin: '#',
            behance: '#',
            ctaTitle: 'Ready to Transform Your Space?',
            ctaText: 'Let\'s discuss your vision and create something extraordinary together.',
            footerText: 'Karim Alaa Architectural Firm',
            copyrightYear: String(new Date().getFullYear())
        });
        console.log('Site settings created');

        console.log('\n=== Seed Complete ===');
        console.log(`Admin login: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
        console.log('===================\n');

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
