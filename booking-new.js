(function(){
const root=document.getElementById('bookingNew');if(!root)return;
const t=JSON.parse(document.getElementById('bookingWords').textContent),form=document.getElementById('bookingForm');
const $=id=>document.getElementById(id),today=new Date();
const date=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');$('arrival').min=date;$('departure').min=date;
const services=JSON.parse(document.getElementById('bookingServices').textContent);
function calculate(){
 const people=Number($('guests').value)||1,start=$('arrival').value,end=$('departure').value;
 const nights=start&&end?Math.round((Date.parse(end)-Date.parse(start))/86400000):1;
 const lines=[];let total=0,quotes=false;
 const stay=$('stay').value;$('departure').required=stay!=='none';
 function add(name,amount,detail){lines.push({name,amount,detail});if(amount===null)quotes=true;else total+=amount;}
 if(stay==='house')add(t[19],300*Math.max(nights,1),'300 × '+Math.max(nights,1)+' '+t[33]);
 if(stay==='gite250')add(t[21],250*people*Math.max(nights,1),'250 × '+people+' × '+Math.max(nights,1)+' '+t[33]);
 if(stay==='gite350')add(t[23],nights===1?350*people:null,t[24]+(nights!==1?' · '+t[30]:''));
 if(stay==='weekend')add(t[25],null,t[26]);
 form.querySelectorAll('[data-service]:checked').forEach(input=>{const a=services.find(a=>a.id===input.value);let qty=a.unit==='person'?people:a.unit==='duo'?Math.ceil(people/2):a.unit==='quad'?people:1;add(a.name,a.price===null?null:a.price*qty,a.price===null?t[30]:a.price+' × '+qty);});
 $('summaryList').replaceChildren();lines.forEach(a=>{const li=document.createElement('li'),strong=document.createElement('strong'),small=document.createElement('div');strong.textContent=a.name;small.textContent=a.detail+' · '+(a.amount===null?t[30]:a.amount+' DH');li.append(strong,small);$('summaryList').append(li)});
 $('emptySummary').hidden=lines.length>0;$('total').textContent=quotes&&total===0?t[30]:total.toLocaleString()+' DH';$('quoteNote').hidden=!quotes;
 $('campNote').hidden=!form.querySelector('[value="camping"]:checked');$('raftNote').hidden=!form.querySelector('[value^="raft"]:checked');
 return {people,nights,lines,total,quotes,stay};
}
form.addEventListener('input',calculate);form.addEventListener('change',calculate);
form.addEventListener('submit',e=>{
 e.preventDefault();const c=calculate();$('bookingError').textContent='';
 if(!form.reportValidity())return;
 if(!c.lines.length){$('bookingError').textContent=t[36];return;}
 if(c.stay!=='none'&&(!Number.isInteger(c.nights)||c.nights<1||c.nights>45)){$('bookingError').textContent=t[37];return;}
 if(form.querySelector('[value="camping"]:checked')&&c.people<10){$('bookingError').textContent=t[38];return;}
 if($('arrival').value<date){$('arrival').focus();return;}
 const msg=['IMSFRANE · '+t[6],t[10]+': '+$('name').value,t[11]+': '+$('phone').value,t[12]+': '+$('email').value,t[8]+': '+$('arrival').value,t[9]+': '+$('departure').value,t[7]+': '+c.people,'',t[56]+':',...c.lines.map(a=>'- '+a.name+' | '+a.detail+' | '+(a.amount===null?t[30]:a.amount+' DH')),'',t[28]+': '+(c.quotes&&c.total===0?t[30]:c.total+' DH'+(c.quotes?' + '+t[40]:'')),t[13]+': '+$('notes').value,t[35]].join('\n');
 window.open('https://wa.me/212667772551?text='+encodeURIComponent(msg),'_blank','noopener');
});calculate();
})();