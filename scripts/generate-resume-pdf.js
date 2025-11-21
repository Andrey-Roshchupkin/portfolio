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
    
    // Create temporary CSS file
    const cssContent = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #24292f;
      }
      h1 {
        color: #24292f;
        border-bottom: 1px solid #d1d9de;
        padding-bottom: 0.3em;
        margin-top: 0;
        margin-bottom: 16px;
      }
      h2 {
        color: #24292f;
        border-bottom: 1px solid #d1d9de;
        padding-bottom: 0.3em;
        margin-top: 24px;
        margin-bottom: 16px;
      }
      h3 {
        color: #24292f;
        margin-top: 24px;
        margin-bottom: 16px;
      }
      a {
        color: #0969da;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      ul, ol {
        margin-top: 0;
        margin-bottom: 16px;
      }
      li {
        margin-bottom: 8px;
      }
      code {
        background-color: #f6f8fa;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 85%;
      }
      hr {
        border: none;
        border-top: 1px solid #d1d9de;
        margin: 24px 0;
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
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm',
          },
        },
        stylesheet: cssPath,
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

