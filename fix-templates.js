const fs = require('fs');

// Fix tasks page
let tasks = fs.readFileSync('app/panel-x7Kp92mQ4vL8/tasks/page.tsx', 'utf8');
tasks = tasks.replace(/href=\{`\/panel-x7Kp92mQ4vL8\/tasks\/\/workspace`\}/g, 'href={`/panel-x7Kp92mQ4vL8/tasks/${task.id}/workspace`}');
tasks = tasks.replace(/href=\{\\`\/panel-x7Kp92mQ4vL8\/tasks\/\/workspace`\}/g, 'href={`/panel-x7Kp92mQ4vL8/tasks/${task.id}/workspace`}');
fs.writeFileSync('app/panel-x7Kp92mQ4vL8/tasks/page.tsx', tasks, 'utf8');
console.log('Fixed tasks');

// Fix videos page
let videos = fs.readFileSync('app/panel-x7Kp92mQ4vL8/videos/page.tsx', 'utf8');
videos = videos.replace(/href=\{`\/panel-x7Kp92mQ4vL8\/videos\/\/workspace`\}/g, 'href={`/panel-x7Kp92mQ4vL8/videos/${video.id}/workspace`}');
videos = videos.replace(/href=\{\\`\/panel-x7Kp92mQ4vL8\/videos\/\/workspace`\}/g, 'href={`/panel-x7Kp92mQ4vL8/videos/${video.id}/workspace`}');
fs.writeFileSync('app/panel-x7Kp92mQ4vL8/videos/page.tsx', videos, 'utf8');
console.log('Fixed videos');

console.log('Done');