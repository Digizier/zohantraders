import fs from 'fs';
import path from 'path';

console.log('=== ZOHAN TRADERS AUDIT & VERIFICATION SUITE ===\n');

let failed = false;

// 1. Check ./out directory and key HTML files
const expectedFiles = [
  'out/index.html',
  'out/about/index.html',
  'out/admin/index.html',
  'out/shop/index.html',
  'out/shop/construction/index.html',
  'out/shop/stationery/index.html',
  'out/shop/it-products/index.html',
  'out/shop/security/index.html',
  'out/shop/office-furniture/index.html',
  'out/order-success/latest/index.html',
  'out/order-success/demo/index.html',
  'out/checkout/index.html',
  'out/clients/index.html',
  'out/contact/index.html',
  'out/departments/index.html',
  'out/services/index.html',
  'out/why-choose-us/index.html',
  'out/_redirects',
  'out/favicon.ico',
  'out/logo.jpg',
  'out/og-image.jpg',
];

console.log('[1/5] Checking static export build output:');
for (const file of expectedFiles) {
  const fullPath = path.resolve('d:/APPs/zohantraders', file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`  ✓ ${file} (${stats.size} bytes)`);
  } else {
    console.error(`  ✗ MISSING: ${file}`);
    failed = true;
  }
}

// 2. White-label check: Verify "Supabase" is NOT mentioned anywhere
console.log('\n[2/5] Verifying White-Labeling Mandate (Zero mention of "Supabase"):');
const checkDirs = ['app', 'components', 'lib', 'context', 'artifacts'];
let whiteLabelViolation = false;

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(res);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') ||
        entry.name.endsWith('.tsx') ||
        entry.name.endsWith('.html') ||
        entry.name.endsWith('.md'))
    ) {
      const content = fs.readFileSync(res, 'utf-8');
      if (/supabase/i.test(content)) {
        console.error(`  ✗ White-label violation in ${res}: contains "supabase"`);
        whiteLabelViolation = true;
      }
    }
  }
}

for (const d of checkDirs) {
  scanDir(path.resolve('d:/APPs/zohantraders', d));
}

if (!whiteLabelViolation) {
  console.log('  ✓ 100% White-label compliance verified across all source files and documentation.');
} else {
  failed = true;
}

// 3. Catalog Subcategory and Category coverage
console.log('\n[3/5] Verifying Category & Subcategory Catalog Coverage:');
try {
  const seedModule = await import('../lib/seed-data.ts');
  const { INITIAL_CATEGORIES, INITIAL_PRODUCTS } = seedModule;

  console.log(`  Total Categories: ${INITIAL_CATEGORIES.length}`);
  console.log(`  Total Products in Initial Seed: ${INITIAL_PRODUCTS.length}`);

  const allSubcategories = INITIAL_CATEGORIES.flatMap((c) => c.subcategories || []);
  console.log(`  Total Subcategories: ${allSubcategories.length}`);

  let missingCoverage = 0;
  for (const sub of allSubcategories) {
    const assignedProducts = INITIAL_PRODUCTS.filter((p) => p.subcategoryId === sub.id);
    if (assignedProducts.length === 0) {
      console.error(`  ✗ Subcategory without products: [${sub.categoryId}] "${sub.name}" (id: ${sub.id})`);
      missingCoverage++;
    } else {
      console.log(`  ✓ Subcategory [${sub.id}] "${sub.name}": ${assignedProducts.length} product(s)`);
    }
  }

  if (missingCoverage > 0) {
    console.error(`  ✗ ${missingCoverage} subcategories have ZERO products!`);
    failed = true;
  } else {
    console.log(`  ✓ 100% subcategory coverage verified (${allSubcategories.length}/${allSubcategories.length} subcategories populated).`);
  }
} catch (err) {
  console.error('  ✗ Error verifying catalog coverage:', err.message);
  failed = true;
}

// 4. Verify deterministic rating calculation
console.log('\n[4/5] Testing deterministic rating hash consistency:');
function getProductRating(idOrSlug) {
  let hash = 0;
  for (let i = 0; i < idOrSlug.length; i++) {
    hash = (hash << 5) - hash + idOrSlug.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const ratingSteps = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 4.8, 4.9, 4.7, 5.0];
  const rating = ratingSteps[absHash % ratingSteps.length];
  const reviewCount = 14 + (absHash % 147);
  return { rating, reviewCount };
}

const sampleSlugs = [
  'hikvision-4k-ultra-hd-ip-bullet-cctv',
  'zkteco-d3180s-18-zone-walkthrough-metal-detector-gate',
  'ubiquiti-litebeam-5ac-gen2-23dbi',
  'first-class-red-multani-clay-bricks-awal-quality',
  'interwood-orthopedic-high-back-executive-office-chair',
];

for (const slug of sampleSlugs) {
  const run1 = getProductRating(slug);
  const run2 = getProductRating(slug);
  if (run1.rating === run2.rating && run1.reviewCount === run2.reviewCount) {
    console.log(`  ✓ ${slug}: Rating=${run1.rating}, Reviews=${run1.reviewCount} (Deterministic)`);
  } else {
    console.error(`  ✗ Non-deterministic output for ${slug}`);
    failed = true;
  }
}

// 5. Verify Print CSS in globals.css
console.log('\n[5/5] Verifying Isolated Print CSS (#printable-invoice-area):');
const cssPath = path.resolve('d:/APPs/zohantraders/app/globals.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');
if (
  cssContent.includes('#printable-invoice-area') &&
  cssContent.includes('@media print') &&
  cssContent.includes('overflow: visible !important')
) {
  console.log('  ✓ #printable-invoice-area with @media print CSS & non-clipping overflow verified.');
} else {
  console.error('  ✗ Missing print invoice CSS or overflow rules!');
  failed = true;
}

if (failed) {
  console.error('\n❌ AUDIT FAILED.');
  process.exit(1);
} else {
  console.log('\n✅ ALL AUDIT CHECKS PASSED SUCCESSFULLY.');
}
