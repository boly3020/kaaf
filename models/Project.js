const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    year: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, default: 'Design Development' },
    area: { type: String },
    floors: { type: String },
    style: { type: String },
    featuredImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    pdfFile: { type: String },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

projectSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Project', projectSchema);
