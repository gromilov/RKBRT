// format-html.js
import htmlFormatterPkg from 'html-formatter';
console.log(htmlFormatterPkg);
const { render } = htmlFormatterPkg;
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findHtmlFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

console.log('📝 Formatting HTML files...');

const distDir = join(process.cwd(), 'dist');
console.log('📁 Build directory:', distDir);

try {
  const htmlFiles = findHtmlFiles(distDir);
  console.log(`📄 Found ${htmlFiles.length} HTML files to format`);
  
  htmlFiles.forEach(filePath => {
    try {
      const originalHtml = readFileSync(filePath, 'utf8');
      const formattedHtml = render(originalHtml, {
        indent_size: 2,
        indent_char: ' ',
        max_char: 0,
        unformatted: ['code', 'pre', 'em', 'strong', 'span', 'script'],
        indent_inner_html: false,
        preserve_newlines: true,
        break_chained_methods: false,
        extra_liners: []
      });
      
      writeFileSync(filePath, formattedHtml, 'utf8');
      console.log(`✅ Formatted: ${filePath.replace(distDir, '')}`);
    } catch (error) {
      console.error(`❌ Error formatting ${filePath}:`, error.message);
    }
  });
  
  console.log(`🎉 Finished formatting ${htmlFiles.length} HTML files`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}