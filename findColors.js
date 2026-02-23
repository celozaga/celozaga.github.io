const fs = require('fs');
const content = fs.readFileSync('static/style.css', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.match(/#[A-Fa-f0-9]{3,6}\b|rgba?\(/)) {
        console.log((i + 1) + ': ' + line.trim());
    }
});
