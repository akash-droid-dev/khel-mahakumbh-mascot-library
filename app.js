'use strict';
const assets = window.MASCOT_ASSETS || [];
const $ = (selector) => document.querySelector(selector);
const state = {category:'All',format:'all',query:'',selected:null,playing:false};
const categories = ['All','Feelings','Gestures','Wins','Social','Sports'];
const aliases = {'bulls-eye':'bullseye bulls eye target archery','thumbs-up':'thumbsup thumsup approval','tongue-out':'tounge silly','victory-fingers':'peace v sign victory','heart-eyes':'love hearts','laughing-tears':'lol laugh laughter','yogasan-tree':'yoga balance','yogasan-seated':'yoga meditation','athletics':'running jogging','weightlifting':'weight lifting gym','champion':'trophy winner','double-fist':'cheer celebration'};
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function downloadLink(href,label,className){const link=element('a',className,label);link.href=href;link.download=href.split('/').pop();return link;}
function card(asset){
  const article=element('article','card');
  const visual=element('button','card-visual');visual.type='button';visual.setAttribute('aria-label',`Preview ${asset.title}`);
  const img=element('img');img.src=asset.thumb;img.alt=asset.title+' lion mascot';img.width=256;img.height=256;img.loading='lazy';img.decoding='async';
  visual.append(img,element('span','card-badge',asset.gif?'PNG + GIF':'PNG'),element('span','card-open',asset.gif?'▶':'↗'));
  visual.addEventListener('click',()=>openPreview(asset));
  const info=element('div','card-info');info.append(element('h3','',asset.title),element('p','card-category',asset.category));
  const links=element('div','card-links');links.append(downloadLink(asset.sticker,'PNG ↓'));if(asset.gif)links.append(downloadLink(asset.gif,'GIF ↓'));
  links.querySelectorAll('a').forEach(a=>a.setAttribute('aria-label',`Download ${asset.title} ${a.textContent.startsWith('PNG')?'PNG sticker':'animated GIF'}`));
  info.append(links);article.append(visual,info);return article;
}
function render(){
  const query=state.query.trim().toLowerCase();
  const filtered=assets.filter(a=>(state.category==='All'||a.category===state.category)&&(state.format!=='gif'||a.gif)&&(!query||`${a.title} ${a.category} ${aliases[a.id]||''}`.toLowerCase().includes(query)));
  $('#grid').replaceChildren(...filtered.map(card));
  $('#empty').hidden=filtered.length>0;
  $('#result-count').textContent=`${filtered.length} ${filtered.length===1?'mascot moment':'mascot moments'}${state.category==='All'?'':' · '+state.category}${state.format==='gif'?' · animated GIFs':state.format==='sticker'?' · stickers':''}`;
  $('#clear-search').hidden=!state.query;
  document.querySelectorAll('#categories button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
  $('#category-pack').href=`downloads/khel-mahakumbh-${state.category.toLowerCase()}.zip`;
  $('#category-pack').textContent=state.category==='All'?'Download full pack ↓':`Download ${state.category.toLowerCase()} pack ↓`;
}
function openPreview(asset){
  state.selected=asset;state.playing=false;
  $('#preview-title').textContent=asset.title;
  $('#preview-category').textContent=asset.category+' / KHEL MAHAKUMBH';
  $('#preview-image').src=asset.sticker;$('#preview-image').alt=asset.title+' lion mascot sticker';
  $('#preview-status').textContent=asset.gif?'Transparent sticker + looping animated GIF':'Transparent PNG sticker';
  $('#download-png').href=asset.sticker;$('#download-png').download=asset.sticker.split('/').pop();
  $('#download-gif').hidden=!asset.gif;$('#play').hidden=!asset.gif;$('#play').textContent='▶ Play GIF';
  if(asset.gif){$('#download-gif').href=asset.gif;$('#download-gif').download=asset.gif.split('/').pop();}
  document.body.classList.add('modal-open');$('#preview').showModal();$('#close-preview').focus();
}
$('#close-preview').addEventListener('click',()=>$('#preview').close());
$('#preview').addEventListener('close',()=>{document.body.classList.remove('modal-open');$('#preview-image').src=state.selected?.sticker||'';state.playing=false;});
$('#preview').addEventListener('click',e=>{if(e.target===$('#preview')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#play').addEventListener('click',()=>{if(!state.selected?.gif)return;state.playing=!state.playing;$('#preview-image').src=state.playing?state.selected.gif:state.selected.sticker;$('#preview-image').alt=state.selected.title+(state.playing?' animated lion mascot':' lion mascot sticker');$('#play').textContent=state.playing?'■ Stop GIF':'▶ Play GIF';});
for(const category of categories){const button=element('button','',category==='All'?'Everything':category);button.type='button';button.dataset.category=category;button.setAttribute('aria-pressed',String(category==='All'));button.addEventListener('click',()=>{state.category=category;render();});$('#categories').append(button);}
$('#search').addEventListener('input',e=>{state.query=e.target.value;render();});
$('#clear-search').addEventListener('click',()=>{state.query='';$('#search').value='';render();$('#search').focus();});
document.querySelectorAll('input[name=format]').forEach(input=>input.addEventListener('change',()=>{state.format=input.value;render();}));
$('#reset').addEventListener('click',()=>{Object.assign(state,{category:'All',format:'all',query:''});$('#search').value='';$('input[value=all]').checked=true;render();$('#search').focus();});
$('#sticker-count').textContent=assets.length;$('#gif-count').textContent=assets.filter(a=>a.gif).length;
render();
