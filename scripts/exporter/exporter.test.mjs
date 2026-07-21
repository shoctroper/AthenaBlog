import test from 'node:test';
import assert from 'node:assert/strict';
import { toPost } from './exporter.mjs';
const metadata = { title:'Una historia breve', description:'Una descripción suficientemente extensa para el contrato.', topic:'Tecnología', tags:['Tecnología'], pubDate:'2026-07-20', caseId:'00000000-0000-4000-8000-000000000007', sources:[{id:'doc-1',label:'Documento 1'}], trustSummary:'Resumen interno de confianza suficiente.', scriptStatus:'unavailable' };
test('exporter creates public frontmatter and retains internal fields', () => { const post = toPost({ metadata, markdown:'Texto.' }); assert.match(post, /title:/); assert.match(post, /caseId:/); });
test('exporter rejects incomplete metadata', () => assert.throws(() => toPost({ metadata:{}, markdown:'x' }), /Missing required metadata/));
