const fs = require('fs');
const { execSync } = require('child_process');

function createBlob(content) {
  return execSync('git hash-object -w --stdin', { input: content, encoding: 'utf8' }).toString().trim();
}

const projectsContent = fs.readFileSync('app/panel-x7Kp92mQ4vL8/projects/page.tsx', 'utf8');
const tasksContent = fs.readFileSync('app/panel-x7Kp92mQ4vL8/tasks/page.tsx', 'utf8');
const videosContent = fs.readFileSync('app/panel-x7Kp92mQ4vL8/videos/page.tsx', 'utf8');

console.log('Projects has emoji:', projectsContent.includes('🎮'));
console.log('Tasks has edit btn:', tasksContent.includes('handleEditTask'));
console.log('Videos has edit btn:', videosContent.includes('handleEditVideo'));

const projectsHash = createBlob(projectsContent);
const tasksHash = createBlob(tasksContent);
const videosHash = createBlob(videosContent);

console.log('Projects hash:', projectsHash);
console.log('Tasks hash:', tasksHash);
console.log('Videos hash:', videosHash);

execSync(`git update-index --add --cacheinfo 100644 ${projectsHash} app/panel-x7Kp92mQ4vL8/projects/page.tsx`, { encoding: 'utf8' });
execSync(`git update-index --add --cacheinfo 100644 ${tasksHash} app/panel-x7Kp92mQ4vL8/tasks/page.tsx`, { encoding: 'utf8' });
execSync(`git update-index --add --cacheinfo 100644 ${videosHash} app/panel-x7Kp92mQ4vL8/videos/page.tsx`, { encoding: 'utf8' });

console.log('Index updated');

const verifyProjects = execSync('git show :app/panel-x7Kp92mQ4vL8/projects/page.tsx', { encoding: 'utf8' });
console.log('Verify projects has emoji:', verifyProjects.includes('🎮'));
console.log('Verify projects has template:', verifyProjects.includes('href={`'));

function createBlob(content) {
  return execSync('git hash-object -w --stdin', { input: content, encoding: 'utf8' }).toString().trim();
}