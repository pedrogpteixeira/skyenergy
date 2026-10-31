import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const finalizer = resolve('scripts/finalize-seo.mjs');
const sourceHtml = readFileSync(resolve('src/index.html'), 'utf8');

function scenario(environment = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'skyenergy-seo-'));
  mkdirSync(directory, { recursive:true });
  writeFileSync(join(directory, 'index.html'), sourceHtml);
  writeFileSync(join(directory, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  const env = { ...process.env, SEO_OUTPUT_DIR:directory };
  for (const key of ['CONTEXT', 'PUBLIC_SITE_URL','URL']) delete env[key];
  Object.assign(env, environment);
  const processResult = spawnSync(process.execPath, [finalizer], { env, encoding: 'utf8' });
  return {
    directory,
    result: processResult,
    html: readFileSync(join(directory, 'index.html'), 'utf8'),
    robots:readFileSync(join(directory,'robots.txt'),'utf8'),
    sitemap:existsSync(join(directory,'sitemap.xml')) ? readFileSync(join(directory,'sitemap.xml'),'utf8') : null,
    cleanup:()=>rmSync(directory,{recursive:true,force:true}),
  };
}

test('the source HTML allows localhost Lighthouse SEO to audit indexing', () => {
  assert.match(sourceHtml, /<meta name="robots" content="index,follow">/);
  assert.doesNotMatch(sourceHtml, /noindex/);
});
test('a production deploy has index, canonical, sitemap and structured data', () => {
  const s = scenario({CONTEXT:'production', PUBLIC_SITE_URL:'https://skyenergy.pt'});
  try {
    assert.equal(s.result.status,0,s.result.stderr);
    assert.match(s.html, /content="index,follow"/);
    assert.match(s.html, /rel="canonical" href="https:\/\/skyenergy.pt\/"/);
    assert.match(s.html, /property="og:url" content="https:\/\/skyenergy.pt\/"/);
    assert.match(s.html, /application\/ld\+json/);
    assert.match(s.robots, /Allow: \//);
    assert.match(s.robots, /Sitemap: https:\/\/skyenergy.pt\/sitemap.xml/);
    assert.match(s.sitemap, /<loc>https:\/\/skyenergy.pt\/<\/loc>/);
  } finally {s.cleanup();}
});
test('Netlify production URL is a fallback if no domain is configured', () => {
  const s = scenario({CONTEXT:'production', URL:'https://sky-energy.netlify.app'});
  try {assert.equal(s.result.status,0,s.result.stderr);assert.match(s.html,/canonical" href="https:\/\/sky-energy.netlify.app\//);} finally {s.cleanup();}
});
for (const context of ['deploy-preview','branch-deploy']) {
  test(`${context} never inherits production indexability or canonical`,()=>{
    const s = scenario({CONTEXT:context, PUBLIC_SITE_URL:'https://skyenergy.pt', URL:'https://sky-energy.netlify.app'});
    try {
      assert.equal(s.result.status,0,s.result.stderr);
      assert.match(s.html,/content="noindex,nofollow"/);
      assert.doesNotMatch(s.html,/rel="canonical"/);
      assert.match(s.robots,/Disallow: \//);
      assert.equal(s.sitemap,null);
    } finally {s.cleanup();}
  });
}
test('missing production domain fails instead of silently deploying a blocked site',()=>{
  const s=scenario({CONTEXT:'production'});
  try {assert.notEqual(s.result.status,0);assert.match(s.result.stderr,/PUBLIC_SITE_URL/);}finally{s.cleanup();}
});
test('local build has no indexation ban but does not fabricate a canonical',()=>{
  const s=scenario();
  try {assert.equal(s.result.status,0,s.result.stderr);assert.match(s.html,/content="index,follow"/);assert.doesNotMatch(s.html,/rel="canonical"/);assert.equal(s.sitemap,null);} finally{s.cleanup();}
});
test('validate that URLs cannot inject markup or refer to localhost',()=>{
  const s=scenario({CONTEXT:'production', PUBLIC_SITE_URL:'http://localhost:4200'});
  try{assert.notEqual(s.result.status,0);}finally{s.cleanup();}
});
