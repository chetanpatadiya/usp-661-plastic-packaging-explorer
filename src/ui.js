/* Independent offline helper; no dependencies or external services. */
(function (root) {
  'use strict';
  const disclaimer = 'Engineering planning / research prototype only; NOT a compendial conformance determination, analytical method qualification, or product safety approval. Verify governing USP-NF edition and applicable regulatory requirements.';
  function el(id){const x=document.getElementById(id);if(!x) throw new Error(`Missing UI element ${id}`);return x;}
  function raw(id){return el(id).value.trim();}
  function selectedEvidence(){return [...document.querySelectorAll('[data-evidence]')].map(x=>({id:x.id,label:x.dataset.evidence,provided:x.checked}));}
  function fmt(x){if(typeof x!=='number'||!Number.isFinite(x))return String(x);return new Intl.NumberFormat('en-US',{maximumSignificantDigits:7}).format(x);}
  function clear(){el('resultPanel').replaceChildren();}
  function add(tag,text,className,parent){const t=document.createElement(tag);t.textContent=text;if(className)t.className=className;(parent||el('resultPanel')).append(t);return t;}
  function output(record){
    clear();el('resultPanel').setAttribute('aria-busy','false');
    add('div',record.label,'kicker');
    const state=add('div',record.state,'status '+(record.alert?'warn':''));state.setAttribute('role','status');
    const headline=add('div',fmt(record.value)+' '+record.unit,'result');headline.setAttribute('aria-label',record.label+': '+fmt(record.value)+' '+record.unit);
    add('div',record.formula,'formula');
    if(record.notes?.length){const ul=document.createElement('ul');ul.className='notes';for(const n of record.notes)add('li',n,'',ul);el('resultPanel').append(ul);}
    if(record.paths?.length){add('h3','Applicability and evidence questions');const ul=document.createElement('ul');ul.className='notes';for(const p of record.paths)add('li',p,'',ul);el('resultPanel').append(ul);}
    add('div','Not a regulatory pass/fail, safety decision, or substitute for authorized compendial methods.','small');
  }
  function failure(err){clear();add('div','Calculation blocked','status error');add('p',err instanceof Error?err.message:String(err),'error-msg');add('p','Correct the inputs and calculate again. No stale prior result is retained.','small');}
  function collectInputs(){const out={};document.querySelectorAll('input,select,textarea').forEach(n=>{if(!n.id)return;out[n.id]=n.type==='checkbox'?n.checked:n.value;});return out;}
  function csvEscape(v){const s=typeof v==='string'?v:JSON.stringify(v);return '"'+(s??'').replace(/"/g,'""')+'"';}
  function csvData(obj){const rows=[['section','field','value']];
    for(const [key,val] of Object.entries(obj)){if(val&&typeof val==='object'&&!Array.isArray(val)){for(const [k,v] of Object.entries(val))rows.push([key,k,typeof v==='object'?JSON.stringify(v):v]);}else rows.push(['report',key,typeof val==='object'?JSON.stringify(val):val]);}
    return rows.map(r=>r.map(csvEscape).join(',')).join('\r\n')+'\r\n';}
  function save(filename,contents,mime){const blob=new Blob([contents],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
  function init(config,calc,example){
    let last=null;
    const run=()=>{try{const result=calc();last={schemaVersion:'0.1',module:config.id,version:'0.1.0',generatedAt:new Date().toISOString(),sourceType:'User input / example data; unverified',standardsStatus:config.status,inputs:collectInputs(),evidence:selectedEvidence(),result,limitations:[disclaimer],sourceLinks:config.sources};output(result);}catch(e){last=null;failure(e);}
      el('exportJson').disabled=!last;el('exportCsv').disabled=!last;
    };
    el('calculate').addEventListener('click',run);
    el('loadExample').addEventListener('click',()=>{example();run();});
    el('resetForm').addEventListener('click',()=>{el('explorerForm').reset();last=null;clear();add('p','Choose a calculation and enter the relevant inputs, then select Calculate.','small');el('exportJson').disabled=true;el('exportCsv').disabled=true;if(config.onReset)config.onReset();});
    el('exportJson').addEventListener('click',()=>{if(last)save(config.id+'-report.json',JSON.stringify(last,null,2),'application/json');});
    el('exportCsv').addEventListener('click',()=>{if(last)save(config.id+'-report.csv',csvData(last),'text/csv;charset=utf-8');});
    el('printReport').addEventListener('click',()=>window.print());
    el('explorerForm').addEventListener('input',()=>{if(last){last=null;clear();add('p','Inputs changed. Recalculate before exporting.','status warn');el('exportJson').disabled=true;el('exportCsv').disabled=true;}});
    el('explorerForm').addEventListener('change',()=>{if(last){last=null;clear();add('p','Inputs changed. Recalculate before exporting.','status warn');el('exportJson').disabled=true;el('exportCsv').disabled=true;}});
    document.querySelectorAll('#method,[data-method]').forEach(x=>x.addEventListener('change',()=>config.onModeChange?.()));
    add('p','Choose a calculation and enter the relevant inputs, then select Calculate.','small');
    if(config.onModeChange)config.onModeChange();
    return {run,getLast:()=>last};
  }
  root.ExplorerUI={raw,el,init,fmt,disclaimer,selectedEvidence};
})(typeof window!=='undefined'?window:globalThis);
