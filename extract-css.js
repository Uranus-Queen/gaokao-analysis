import { readFileSync, writeFileSync } from 'fs';

const html = readFileSync('C:/Users/17723/Documents/xwechat_files/wxid_thbg0u1hr44r12_1f46/msg/file/2026-06/2014-2025年高考录取多维分析系统(3).html', 'utf8');

// Extract CSS
const cssStart = html.indexOf('<style>') + 7;
const cssEnd = html.indexOf('</style>');
const css = html.substring(cssStart, cssEnd).trim();
writeFileSync('public/styles.css', css);
console.log('CSS extracted:', css.length, 'bytes');

// Extract base64 logo
const logoMatch = html.match(/src="(data:image\/png;base64,[^"]+)"/);
if (logoMatch) {
  const base64 = logoMatch[1].replace('data:image/png;base64,', '');
  writeFileSync('public/logo.png', Buffer.from(base64, 'base64'));
  console.log('Logo extracted: logo.png');
}
