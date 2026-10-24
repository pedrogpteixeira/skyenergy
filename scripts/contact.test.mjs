import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeAnalysisRequest, sendAnalysisRequest, CONTACT_FORM_NAME, CONTACT_FORM_ENDPOINT } from '../src/app/services/contact.ts';
const sample = {name:' Maria Silva ',email:' maria@email.pt ',phone:' 912 345 678 ',customerType:'Particular',energyType:'Eletricidade',contactPreference:'Email',message:' Quero analisar a fatura. ',consent:true,'bot-field':''};
test('serializes required form fields with trimmed values',()=>{
  const data=encodeAnalysisRequest(sample);
  assert.equal(data.get('form-name'),CONTACT_FORM_NAME);
  assert.equal(data.get('name'),'Maria Silva');
  assert.equal(data.get('message'),'Quero analisar a fatura.');
  assert.equal(data.get('consent'),'Sim');
});
test('posts a valid form to Netlify',async()=>{
  let called=false;
  await sendAnalysisRequest(encodeAnalysisRequest(sample),async(url,opts)=>{
    called=true;
    assert.equal(url,CONTACT_FORM_ENDPOINT);
    assert.equal(opts.method,'POST');
    assert.match(opts.body,/form-name=skyenergy-analise/);
    return {ok:true};
  });
  assert.equal(called,true);
});
test('rejects failed HTTP submissions',async()=>{
  await assert.rejects(()=>sendAnalysisRequest(encodeAnalysisRequest(sample),async()=>({ok:false,status:400})),/não foi aceite/);
});
