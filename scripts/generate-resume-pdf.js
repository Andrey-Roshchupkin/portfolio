import { mdToPdf } from 'md-to-pdf';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read config to get name
const configPath = join(__dirname, '../src/config.ts');
const configContent = readFileSync(configPath, 'utf-8');
const nameMatch = configContent.match(/name:\s*['"]([^'"]+)['"]/);
const name = nameMatch ? nameMatch[1] : 'resume';

const resumePath = join(__dirname, '../materials/resume/SDET-AQA-Andrey-Roshchupkin.md');
const outputDir = join(__dirname, '../docs');
const publicDir = join(__dirname, '../public');
const outputPath = join(outputDir, 'SDET-AQA-Andrey-Roshchupkin.pdf');
const publicPath = join(publicDir, 'SDET-AQA-Andrey-Roshchupkin.pdf');

async function generatePDF() {
  try {
    console.log('Generating resume PDF...');
    
    // Create temporary CSS file with compact styling
    const cssContent = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.4;
        color: #24292f;
      }
      h1 {
        color: #24292f;
        font-size: 18pt;
        border-bottom: 1px solid #d1d9de;
        padding-bottom: 0.2em;
        margin-top: 0;
        margin-bottom: 8px;
      }
      h2 {
        color: #24292f;
        font-size: 13pt;
        border-bottom: 1px solid #d1d9de;
        padding-bottom: 0.2em;
        margin-top: 12px;
        margin-bottom: 8px;
      }
      h3 {
        color: #24292f;
        font-size: 11pt;
        margin-top: 10px;
        margin-bottom: 6px;
      }
      p {
        margin-top: 4px;
        margin-bottom: 8px;
      }
      a {
        color: #0969da;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      ul, ol {
        margin-top: 4px;
        margin-bottom: 8px;
        padding-left: 20px;
      }
      li {
        margin-bottom: 3px;
      }
      code {
        background-color: #f6f8fa;
        padding: 1px 3px;
        border-radius: 2px;
        font-size: 85%;
      }
      hr {
        border: none;
        border-top: 1px solid #d1d9de;
        margin: 10px 0;
      }
      strong {
        font-weight: 600;
      }
    `;
    
    const cssPath = join(__dirname, '../temp-resume-styles.css');
    writeFileSync(cssPath, cssContent);

    const pdf = await mdToPdf(
      { path: resumePath },
      {
        pdf_options: {
          format: 'A4',
          margin: {
            top: '12mm',
            right: '12mm',
            bottom: '12mm',
            left: '12mm',
          },
          printBackground: true,
        },
        stylesheet: cssPath,
        body_class: 'markdown-body',
      }
    );

    // Clean up temp CSS file
    try {
      writeFileSync(cssPath, ''); // Clear file
    } catch (e) {
      // Ignore cleanup errors
    }

    if (pdf) {
      writeFileSync(outputPath, pdf.content);
      // Also copy to public for dev server access
      writeFileSync(publicPath, pdf.content);
      console.log(`✅ PDF generated successfully: ${outputPath}`);
      console.log(`✅ PDF copied to public: ${publicPath}`);
    }
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

generatePDF();

