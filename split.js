const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'index.html');
let content = fs.readFileSync(file, 'utf8');

// Extract CSS
const styleRegex = /<style>([\s\S]*?)<\/style>/;
const styleMatch = content.match(styleRegex);
if (styleMatch) {
  const cssContent = styleMatch[1];
  
  // Split CSS
  // Rough split for now, we will save it all to base.css and split later if needed,
  // or we can just write it to css/main.css
  fs.writeFileSync(path.join(__dirname, 'css/main.css'), cssContent.trim());
  content = content.replace(styleRegex, '<link rel="stylesheet" href="./css/main.css" />');
}

// Extract JS
// There are multiple script tags. We can extract them sequentially.
const scripts = [];
let scriptMatch;
const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/g;

let jsContent = '';
while ((scriptMatch = scriptRegex.exec(content)) !== null) {
  if (scriptMatch[1].trim() !== '') {
     jsContent += scriptMatch[1].trim() + '\n\n';
  }
}

// Just write all JS to js/main.js for now, then we'll clean it up
if (jsContent) {
   fs.writeFileSync(path.join(__dirname, 'js/main.js'), jsContent);
}

// We will manually replace the script tags later because of importmaps, etc.
// But we can remove the old <script> content
let newContent = content.replace(/<script>([\s\S]*?)<\/script>/g, '');
newContent = newContent.replace(/<script type="module">([\s\S]*?)<\/script>/g, '<script type="module" src="./js/main.js"></script>');

fs.writeFileSync(path.join(__dirname, 'index_split.html'), newContent);
console.log("Done splitting.");
