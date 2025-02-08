#!/usr/bin/env node

import { intro, outro, text, spinner, note } from '@clack/prompts';
import color from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  intro(color.inverse(' Create Template Project '));

  const projectName = await text({
    message: 'What is your project name?',
    validate: (value) => {
      if (!value) return 'Please enter a project name';
      if (!/^[a-z0-9-]+$/.test(value)) return 'Project name can only contain lowercase letters, numbers, and hyphens';
      return undefined;
    },
  });

  const targetDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.resolve(__dirname, '../template');

  const s = spinner();
  s.start('Creating project');

  try {
    // Check if directory exists
    if (fs.existsSync(targetDir)) {
      throw new Error(`Directory ${projectName} already exists`);
    }

    // Copy template directory
    await fs.copy(templateDir, targetDir);

    // Replace TEMPLATE with project name in all files
    const files = await fs.readdir(targetDir, { recursive: true });
    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile()) {
        let content = await fs.readFile(filePath, 'utf8');
        if (content.includes('TEMPLATE')) {
          content = content.replaceAll('TEMPLATE', projectName);
          await fs.writeFile(filePath, content);
        }
      }
    }

    s.stop('Project created successfully');
    
    note(`To get started:
      cd ${projectName}
      npm install
      npm run dev`, 'Next steps');

    note(`To setup automatic publishing to npm and jsr:
      - Push to a Github repo
      - Add your repo url to the repository field in package.json
      - Connect your Github repo with your jsr account
      - Obtain an npm token from your npm account and save it as a secret in Github
      - Create a release in Github to trigger publishing`, 'Publishing');
      
  } catch (error) {
    s.stop('Failed to create project');
    console.error(color.red(`Error: ${error.message}`));
    process.exit(1);
  }

  outro('Happy coding! 🎉');
}

main().catch(console.error);

