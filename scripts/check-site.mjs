#!/usr/bin/env node

/**
 * Deterministic Site Verification Script
 * Validates landmarks, links, claims, assets, alt text, dimensions, and negative boundaries.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('Starting Wong De Chen portfolio checks.\n');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`PASS: ${message}`);
  }
}

// 1. Read files
const indexPath = path.join(projectRoot, 'index.html');
const cssPath = path.join(projectRoot, 'src', 'styles.css');
const jsPath = path.join(projectRoot, 'src', 'main.js');
const publicDir = path.join(projectRoot, 'public');

assert(fs.existsSync(indexPath), 'index.html exists');
assert(fs.existsSync(cssPath), 'src/styles.css exists');
assert(fs.existsSync(jsPath), 'src/main.js exists');

const html = fs.readFileSync(indexPath, 'utf-8');
const css = fs.readFileSync(cssPath, 'utf-8');
const js = fs.readFileSync(jsPath, 'utf-8');

// 2. Structural Landmarks & Accessibility
const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
assert(h1Matches && h1Matches.length === 1 && /Code with a/i.test(h1Matches[0]), 'Single H1 containing display headline');
assert(!html.includes('class="hero-name"') && !html.includes("class='hero-name'"), 'Candidate name label is removed from hero markup');
assert(!css.includes('.hero-name'), 'Orphaned .hero-name rule is removed from CSS');
assert(html.includes('<html lang="en"'), 'HTML has lang="en" attribute');
assert(html.includes('class="skip-link"'), 'Skip link is present');
assert(html.includes('<header class="site-header"'), '<header> landmark is present');
assert(html.includes('<nav class="site-nav"'), '<nav> landmark is present');
assert(html.includes('<main id="main-content"'), '<main> landmark is present');
assert(html.includes('<footer class="site-footer"'), '<footer> landmark is present');
assert(!html.includes('Back to top'), 'Footer omits Back to top link per spec');

assert(!/<(?:main|section|article)[^>]*\shidden(?:=|[\s>])/.test(html), 'Primary content is not hidden when JavaScript is unavailable');

// 3. Section Anchors, Priority & IDs
const requiredSections = ['home', 'interfaces', 'systems', 'posters', 'profile', 'contact'];
for (const sec of requiredSections) {
  assert(html.includes(`id="${sec}"`), `Section #${sec} is present in HTML`);
}
const sectionPositions = requiredSections.map((sec) => html.indexOf(`id="${sec}"`));
assert(sectionPositions.every((position, index) => index === 0 || position > sectionPositions[index - 1]), 'Sections follow the interface-first priority');

// 4. Chapter Transitions & Section Markers
assert(html.includes('class="chapter-marker"'), 'Chapter markers are present in HTML');
assert(['Work', 'Systems', 'Studies', 'Profile', 'Contact'].every((label) => html.includes(`class="chapter-word">${label}</span>`)), 'Named chapter markers are present');
assert(html.includes('interfaces-section') && html.includes('systems-section') && html.includes('posters-section') && html.includes('profile-section'), 'Distinct section field classes are present');

// 5. Candidate Identity & Truthful Claims
assert(html.includes('Wong De Chen'), 'Candidate name present');
assert(html.includes('dechen2002@gmail.com'), 'Candidate email present');
assert(html.includes('+60 17-294 3772') || html.includes('+60172943772'), 'Candidate phone present');
assert(html.includes('Kuala Lumpur, Malaysia'), 'Candidate location present');
assert(/full-stack/i.test(html), 'Positioning reflects full-stack software engineer role');
assert(html.includes('The University of Queensland'), 'University of Queensland present');
assert(html.includes('Enfrasys Consulting'), 'Enfrasys Consulting internship present');
assert(html.includes('Microsoft Certified: Azure Fundamentals (AZ-900)'), 'AZ-900 certification present');

// 6. Project Coverage & Backend Technical Depth
assert(html.includes('AI Word Chain'), 'AI Word Chain project present');
assert(html.includes('TableTap Scaling Project'), 'TableTap Scaling Project present');
assert(html.includes('GreenGuided Tourism Platform'), 'GreenGuided Tourism Platform present');
assert(html.includes('HIVE &amp; HUM Honey') || html.includes('HIVE & HUM Honey'), 'HIVE & HUM Honey demo present');
assert(html.includes('Mugimori Kissa Coffee'), 'Mugimori Kissa Coffee demo present');
assert(html.includes('Morrow Signal Token'), 'Morrow Signal Token demo present');
assert(html.includes('Munch Club Cat Food'), 'Munch Club Cat Food demo present');

// Richer backend proof
assert(html.includes('SQLAlchemy') && html.includes('UUID') && html.includes('Horizontal Pod Autoscaling'), 'TableTap includes concrete relational integrity and GKE infrastructure proof');
assert(html.includes('Haversine') && html.includes('consent') && html.includes('Pytest'), 'GreenGuided includes planner algorithm, consent safeguards, and test proof');
assert(html.includes('wordchain-trace-2x.webp'), 'AI Word Chain references sharpened 2x telemetry derivative');

// 7. Profile Narrative & LLM / Subagent Lifecycle Practice
assert(html.includes('llm-practice-block') || (html.includes('subagent') && html.includes('verification')), 'Profile includes disciplined subagent and verification lifecycle narrative');
assert(html.includes('OMP') && html.includes('BMAD'), 'Profile names OMP and BMAD workflow customization');

// 8. Posters & Boundaries
assert(html.includes('Double Char Beef'), 'Poster 01 Double Char Beef present');
assert(html.includes('Molten Black Curry Bun'), 'Poster 02 Molten Black Curry Bun present');
assert(html.includes('Roasted Tea Golden Yam Dorayaki'), 'Poster 03 Roasted Tea Golden Yam Dorayaki present');
assert(html.includes('Ichigo Daifuku Japan Poster'), 'Poster 07 Ichigo Daifuku Japan Poster present');
assert(html.includes('Self-initiated visual study') || html.includes('Self-initiated visual studies'), 'Poster boundary note present');
assert(!/No client work is implied|without commercial client briefs/i.test(html), 'Poster introduction stays passion-led');
assert(!html.includes('id="practice"'), 'Standalone process-report section is removed');

// 9. Negative Boundaries (PROHIBITED KEYWORDS)
const prohibitedTerms = ['RTK', 'Headroom', 'Codebase Memory', 'CloakBrowser', 'Glassdoor'];
for (const term of prohibitedTerms) {
  const re = new RegExp(`\\b${term}\\b`, 'i');
  assert(!re.test(html), `Prohibited term "${term}" is NOT in index.html`);
}
assert(!html.includes('—'), 'Visible page copy contains no em dashes');
assert(!/production[- ]ready/i.test(html), 'Page avoids unsupported production-ready claims');
assert(!html.includes('fonts.googleapis.com'), 'No external font stylesheet is loaded');

// 10. Image Assets & Metadata Checks
const imgRegex = /<img\s+([^>]+)>/g;
let match;
let imgCount = 0;
while ((match = imgRegex.exec(html)) !== null) {
  imgCount++;
  const attrs = match[1];

  const srcMatch = attrs.match(/src="([^"]+)"/);
  const altMatch = attrs.match(/alt="([^"]*)"/);
  const widthMatch = attrs.match(/width="([^"]+)"/);
  const heightMatch = attrs.match(/height="([^"]+)"/);

  assert(Boolean(srcMatch), `Image #${imgCount} has src attribute`);
  if (srcMatch) {
    const src = srcMatch[1];
    if (src.startsWith('/')) {
      const localPath = path.join(publicDir, src);
      assert(fs.existsSync(localPath), `Image asset exists on disk: ${src}`);
    }
  }

  assert(Boolean(altMatch && altMatch[1].trim().length > 0), `Image #${imgCount} has non-empty alt text`);
  assert(Boolean(widthMatch && parseInt(widthMatch[1], 10) > 0), `Image #${imgCount} has explicit width`);
  assert(Boolean(heightMatch && parseInt(heightMatch[1], 10) > 0), `Image #${imgCount} has explicit height`);
}
assert(imgCount >= 10, `Found expected count of images (${imgCount} >= 10)`);
assert(fs.existsSync(path.join(publicDir, 'assets', 'wordchain-trace-2x.webp')), 'Wordchain 2x derivative asset exists');
assert(fs.existsSync(path.join(publicDir, 'assets', 'wong-de-chen-resume.pdf')), 'Resume download asset exists');

// 11. External Links & New Tab Accessibility
const linkRegex = /<a\s+([^>]+)>/g;
let linkMatch;
while ((linkMatch = linkRegex.exec(html)) !== null) {
  const attrs = linkMatch[1];
  const hrefMatch = attrs.match(/href="([^"]+)"/);
  if (hrefMatch && hrefMatch[1].startsWith('http')) {
    const href = hrefMatch[1];
    assert(attrs.includes('target="_blank"'), `External link ${href} has target="_blank"`);
    assert(attrs.includes('rel="noopener noreferrer"'), `External link ${href} has rel="noopener noreferrer"`);
  }
}

// 12. CSS Token & Accessibility Checks
assert(css.includes('--color-paper') && css.includes('--color-ink'), 'CSS defines color tokens');
assert(css.includes('[data-theme="dark"]'), 'CSS defines dark mode overrides');
assert(css.includes('prefers-reduced-motion'), 'CSS defines prefers-reduced-motion media query');
assert(css.includes(':focus-visible'), 'CSS defines focus-visible outline');
assert(css.includes('scroll-snap-type'), 'CSS defines scroll-snap for rails');
assert(css.includes('aspect-ratio'), 'Media frames reserve layout dimensions');
assert(css.includes('grid-template-columns: 1fr'), 'Mobile-first single-column layouts are explicit');
assert(css.includes('overflow-x: clip'), 'Page clips horizontal viewport overflow without breaking sticky positioning');
assert(css.includes('.chapter-marker'), 'CSS styles chapter markers');
assert(css.includes('.scroll-progress'), 'CSS styles scroll progress indicator');
assert(css.includes('.has-spotlight'), 'CSS styles pointer spotlight effect');
assert(css.includes('.llm-practice-block'), 'CSS styles LLM practice block');
assert(css.includes('.profile-intro .chapter-marker') && css.includes('grid-column: 1 / -1'), 'Profile marker explicitly spans grid columns');

// 13. JS Interactions Checks
assert(js.includes('initTheme'), 'JS implements theme toggle');
assert(js.includes('initNavigationObserver'), 'JS implements active nav IntersectionObserver');
assert(css.includes('animation-timeline: scroll'), 'CSS implements scroll progress without a scroll listener');
assert(!js.includes("addEventListener('scroll'"), 'JS avoids frame-by-frame scroll listeners');
assert(js.includes('initSpotlight'), 'JS implements progressive pointer spotlight');
assert(js.includes('initCopyEmail'), 'JS implements copy email feedback');
assert(js.includes('@fontsource-variable/bricolage-grotesque'), 'Display and body font is self-hosted through the bundle');
assert(js.includes('@fontsource-variable/newsreader'), 'Editorial headline font is self-hosted through the bundle');

console.log('\n========================================');
if (failed) {
  console.error('Check suite failed.');
  process.exit(1);
} else {
  console.log('All deterministic checks passed.');
  process.exit(0);
}
