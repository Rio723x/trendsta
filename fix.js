const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Fix the missing opacities from the bash interpolation issue
content = content.replace(/bg-black\/\s/g, 'bg-black/5 ');
content = content.replace(/bg-black\/"/g, 'bg-black/5"');
content = content.replace(/border-black\/\s/g, 'border-black/10 ');
content = content.replace(/border-black\/"/g, 'border-black/10"');

// Fix double whites
content = content.replace(/bg-white\/95\/95/g, 'bg-white/95');

// Fix buttons that might have been broken
content = content.replace(/bg-black\/ border border-black\//g, 'bg-white/10 border border-black/10');

// Fix text-white to text-gray-900 globally again if I missed any? The previous script was:
// { regex: /text-white/g, replace: 'text-gray-900' }
// and then { regex: /text-black/g, replace: 'text-gray-100' }
// but originally the get started button had text-white that turned to text-gray-900.
// Then the View Demo button had text-black that turned to text-gray-100.
// In a light theme, we want "Get Started" (black button) to have white text: text-white.
// And "View Demo" (white button) to have black text: text-black or text-gray-900.

content = content.replace(/<span className="text-gray-900 font-semibold text-lg">Get Started<\/span>/g, '<span className="text-white font-semibold text-lg">Get Started</span>');
content = content.replace(/<span className="text-gray-100 font-semibold text-lg">View Demo<\/span>/g, '<span className="text-gray-900 font-semibold text-lg">View Demo</span>');

// Check the main outer div: min-h-screen text-white bg-[#0B0F19]
content = content.replace(/min-h-screen font-sans bg-\[#0B0F19\] text-white/g, 'min-h-screen font-sans bg-gray-50 text-gray-900');

// And remove any leftover 	ext-gray-100 that should be 	ext-gray-900 or 	ext-white
content = content.replace(/text-gray-100/g, 'text-gray-900'); 

fs.writeFileSync('app/page.tsx', content);
console.log('Fixed opacities');
