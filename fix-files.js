const fs = require('fs');

function fixFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Fix emoji corruption - use hex escape for emojis
  content = content.replace(/icon: '\?\?',/g, "icon: '\u{1F3AE}',");
  content = content.replace(/icon: '\?\?',/g, "icon: '\u{1F916}',");
  content = content.replace(/icon: '\?\?',/g, "icon: '\u{1F4E6}',");
  
  // Fix template literal - the href has literal backticks
  content = content.replace(/href=\{\\`\/panel-x7Kp92mQ4vL8\/projects\/\/\/workspace\`\}/g, 'href={`/panel-x7Kp92mQ4vL8/projects/${project.id}/workspace`}');
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Fixed:', filepath);
}

fixFile('app/panel-x7Kp92mQ4vL8/projects/page.tsx');
fixFile('app/panel-x7Kp92mQ4vL8/tasks/page.tsx');
fixFile('app/panel-x7Kp92mQ4vL8/videos/page.tsx');

console.log('All fixed');