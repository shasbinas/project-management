const fs = require('fs');
const content = fs.readFileSync('.env', 'utf8');
const lines = content.split(/\r?\n/);
const cleaned = lines.map(line => {
    if (!line.trim() || line.startsWith('#')) return line;
    const parts = line.split('=');
    if (parts.length < 2) return line;
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    // Also remove quotes if they exist
    const unquoted = val.replace(/^["'](.+)["']$/, '$1');
    return `${key}=${unquoted}`;
});
fs.writeFileSync('.env', cleaned.join('\n'));
console.log('.env file cleaned of trailing spaces and quotes');
