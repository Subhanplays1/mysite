const fs = require('fs');

const c = fs.readFileSync('app/panel-x7Kp92mQ4vL8/tasks/page.tsx', 'utf8');
const idx = c.indexOf('Button variant="ghost" size="icon" onClick');
if (idx > -1) {
  console.log(c.slice(idx, idx + 500));
} else {
  console.log('not found');
}