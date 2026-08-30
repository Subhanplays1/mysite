const fs = require('fs');
const { execSync } = require('child_process');

function createBlob(content) {
  const hash = execSync('git hash-object -w --stdin', { input: content, encoding: 'utf8' }).toString().trim();
  return hash;
}

// Read the current working directory files (which have correct content)
const projectsContent = fs.readFileSync('app/panel-x7Kp92mQ4vL8/projects/page.tsx', 'utf8');
const tasksContent = fs.readFileSync('app/panel-x7Kp92mQ4vL8/tasks/page.tsx', 'utf8');
const videosContent = fs.readFileSync('app/panel-x7Kp92mQ4vL8/videos/page.tsx', 'utf8');

console.log('Projects has emoji:', projectsContent.includes('🎮'));
console.log('Tasks has emoji:', tasksContent.includes('🎮'));
console.log('Videos has emoji:', videosContent.includes('🎮'));

// Create blobs directly from the correct content
const projectsHash = createBlob(projectsContent);
const tasksHash = createBlob(tasksContent);
const videosHash = createBlob(videosContent);

console.log('Projects hash:', projectsHash);
console.log('Tasks hash:', tasksHash);
console.log('Videos hash:', videosHash);

// Update index with correct blobs
execSync(`git update-index --add --cacheinfo 100644 ${projectsHash} app/panel-x7Kp92mQ4vL8/projects/page.tsx`, { encoding: 'utf8' });
execSync(`git update-index --add --cacheinfo 100644 ${tasksHash} app/panel-x7Kp92mQ4vL8/tasks/page.tsx`, { encoding: 'utf8' });
execSync(`git update-index --add --cacheinfo 100644 ${videosHash} app/panel-x7Kp92mQ4vL8/videos/page.tsx`, { encoding: 'utf8' });

console.log('Index updated with correct blobs');

// Verify
const verifyProjects = execSync('git show :app/panel-x7Kp92mQ4vL8/projects/page.tsx', { encoding: 'utf8' });
console.log('Verify projects has emoji:', verifyProjects.includes('🎮'));
console.log('Verify projects has template:', verifyProjects.includes('href={`'));