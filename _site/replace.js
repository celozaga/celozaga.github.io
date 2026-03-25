const fs = require('fs');
const path = require('path');

const replacements = {
    '--bg-color': '--background',
    '--surface-color': '--surface',
    '--surface-hover': '--surface',
    '--text-main': '--textPrimary',
    '--text-muted': '--textSecondary',
    '--border-color': '--border',
    '--primary-color': '--primary',
    '--secondary-color': '--textPrimary', // secondary mapped to textPrimary or maybe just primary or background. It was #FFF.
    '--accent-color': '--primary'
};

const files = [
    'pages/videos/index.md',
    'static/style.css',
    'static/carousel.js',
    'pages/portfolio/index.md',
    'notion/widget/social-media.html'
];

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        for (const [oldVar, newVar] of Object.entries(replacements)) {
            content = content.split(oldVar).join(newVar);
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}
