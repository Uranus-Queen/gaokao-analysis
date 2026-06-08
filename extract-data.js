import { readFileSync, writeFileSync } from 'fs';

const html = readFileSync('C:/Users/17723/Documents/xwechat_files/wxid_thbg0u1hr44r12_1f46/msg/file/2026-06/2014-2025年高考录取多维分析系统(3).html', 'utf8');
const startMarker = '<script id="dataBlob" type="application/json">';
const endMarker = '</script>';
const startIdx = html.indexOf(startMarker) + startMarker.length;
const endIdx = html.indexOf(endMarker, startIdx);
const jsonStr = html.substring(startIdx, endIdx).trim();
const data = JSON.parse(jsonStr);

Object.keys(data).forEach(year => {
  writeFileSync(`data/${year}.json`, JSON.stringify(data[year]));
  console.log(`${year}: ${data[year].length} records`);
});
