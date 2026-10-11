/* Imsfrane Cathédrale · Demo booking calculator; prices from booking-prices.json */
(function () {
  "use strict";
  var root=document.getElementById("imsfrane-booking");
  var catalogNode=document.getElementById("bpCatalog");
  if(!root||!catalogNode)return;
  var config;
  try{config=JSON.parse(catalogNode.textContent)}catch(e){return}
  var requestedLanguage=root.getAttribute("data-bp-lang");
  var language=["fr","en","ar","es"].includes(requestedLanguage)?requestedLanguage:"fr";
  var words={
    fr:{
      empty:"Choisissez des activités pour afficher le détail du prix.",
      night:"nuit",nights:"nuits",quote:"Sur devis",quoteTitle:"Services supplémentaires",
      validationChoose:"Choisissez au moins une activité ou un service sur devis.",
      validationName:"Veuillez indiquer votre nom complet.",
      validationPhone:"Veuillez indiquer un numéro de téléphone valide.",
      validationDate:"Veuillez choisir une date à partir d'aujourd'hui.",
      validationCheckout:"Choisissez une date de départ après l'arrivée, maximum 45 nuits.",
      validationPeople:"Indiquez un nombre de voyageurs entre 1 et 60.",
      validationCapacity:"La capacité des tentes sélectionnées est inférieure au nombre de voyageurs.",
      validationSeason:"Pour le rafting, choisissez mars, avril, mai, juin, ou juillet sous réserve du débit. Les autres mois sont hors saison.",
      july:"En juillet, le rafting reste soumis au niveau de l'eau et à la confirmation du guide.",
      season:"Le rafting se pratique généralement de mars à juin ; parfois en juillet selon le débit. Aucune sortie n'est garantie sans confirmation.",
      copied:"Récapitulatif copié !",copyError:"Copie impossible. Utilisez WhatsApp.",
      contact:"Coordonnées",requested:"Date souhaitée",travelers:"Voyageurs",
      camping:"Départ du camping",language:"Langue souhaitée",place:"Lieu de départ",
      info:"Informations",selection:"Prestations",estimate:"TOTAL ESTIMÉ",
      pending:"Demande sans paiement. Disponibilité et prix définitif à confirmer.",
      request:"DEMANDE DE RÉSERVATION",unit:"MAD"
    },
    en:{
      empty:"Choose an experience to see a detailed estimate.",
      night:"night",nights:"nights",quote:"Quote required",quoteTitle:"Additional services",
      validationChoose:"Please select an activity or an additional service.",
      validationName:"Please enter your full name.",
      validationPhone:"Please enter a valid telephone number.",
      validationDate:"Please choose today or a future date.",
      validationCheckout:"Choose check-out after check-in, maximum 45 nights.",
      validationPeople:"Enter between 1 and 60 travelers.",
      validationCapacity:"Your selected tent capacity is less than the number of travelers.",
      validationSeason:"For rafting, select March to June, or July subject to river conditions. Other months are out of season.",
      july:"In July, rafting depends on river levels and must be confirmed by your guide.",
      season:"Rafting is generally possible March–June, sometimes July if river levels permit. All departures require confirmation.",
      copied:"Summary copied!",copyError:"Copy unavailable. Please use WhatsApp.",
      contact:"Contact details",requested:"Preferred date",travelers:"Travelers",
      camping:"Camping check-out",language:"Preferred language",place:"Departure point",
      info:"Notes",selection:"Activities",estimate:"ESTIMATED TOTAL",
      pending:"No-payment request. Availability and final pricing must be confirmed.",
      request:"BOOKING REQUEST",unit:"MAD"
    },
    ar:{
      empty:"اختر نشاطاً لعرض تفاصيل التكلفة التقديرية.",
      night:"ليلة",nights:"ليالٍ",quote:"حسب عرض السعر",quoteTitle:"خدمات إضافية",
      validationChoose:"اختر نشاطاً واحداً على الأقل أو خدمة إضافية.",
      validationName:"يرجى إدخال اسمك الكامل.",
      validationPhone:"يرجى إدخال رقم هاتف صحيح.",
      validationDate:"اختر اليوم أو تاريخاً لاحقاً.",
      validationCheckout:"يجب أن يكون تاريخ المغادرة بعد الوصول، بحد أقصى 45 ليلة.",
      validationPeople:"حدد عدداً من المسافرين بين 1 و60.",
      validationCapacity:"سعة الخيام المختارة أقل من عدد المسافرين.",
      validationSeason:"التجديف متاح عادة بين مارس ويونيو، وقد يتاح في يوليو بحسب الصبيب. بقية الأشهر خارج الموسم.",
      july:"تخضع رحلات التجديف في يوليو لمنسوب المياه وتأكيد المرشد.",
      season:"موسم التجديف عادة من مارس إلى يونيو، وأحياناً يوليو حسب الصبيب. لا تُؤكَّد أي رحلة قبل التحقق من الظروف.",
      copied:"تم نسخ الملخص!",copyError:"تعذر النسخ. استخدم واتساب.",
      contact:"بيانات التواصل",requested:"التاريخ المرغوب",travelers:"المسافرون",
      camping:"تاريخ مغادرة المخيم",language:"اللغة المفضلة",place:"نقطة الانطلاق",
      info:"معلومات إضافية",selection:"الأنشطة المختارة",estimate:"الإجمالي التقديري",
      pending:"هذا طلب دون دفع مسبق؛ يجب تأكيد التوفر والسعر النهائي.",
      request:"طلب حجز",unit:"درهم"
    },
    es:{
      empty:"Elige una experiencia para ver el presupuesto detallado.",
      night:"noche",nights:"noches",quote:"A consultar",quoteTitle:"Servicios adicionales",
      validationChoose:"Elige al menos una actividad o un servicio adicional.",
      validationName:"Indica tu nombre completo.",
      validationPhone:"Introduce un número de teléfono válido.",
      validationDate:"Selecciona hoy o una fecha futura.",
      validationCheckout:"La salida debe ser posterior a la llegada, con un máximo de 45 noches.",
      validationPeople:"Indica entre 1 y 60 viajeros.",
      validationCapacity:"La capacidad de las tiendas seleccionadas es inferior al número de viajeros.",
      validationSeason:"Para rafting, elige de marzo a junio o julio sujeto al caudal. Los demás meses están fuera de temporada.",
      july:"En julio el rafting depende del caudal y debe confirmarlo el guía.",
      season:"El rafting suele realizarse de marzo a junio y, algunos años, en julio si el caudal lo permite. Todas las salidas requieren confirmación.",
      copied:"¡Resumen copiado!",copyError:"No se pudo copiar. Usa WhatsApp.",
      contact:"Datos de contacto",requested:"Fecha prevista",travelers:"Viajeros",
      camping:"Salida del camping",language:"Idioma preferido",place:"Punto de salida",
      info:"Información",selection:"Actividades",estimate:"TOTAL ESTIMADO",
      pending:"Solicitud sin pago. Disponibilidad y precio final pendientes de confirmación.",
      request:"SOLICITUD DE RESERVA",unit:"MAD"
    }
  }[language];
  var offers=config.offers||[];
  var amounts=Object.create(null);
  offers.forEach(function(item){amounts[item.id]=0});
  var offerMap=Object.create(null);
  offers.forEach(function(item){offerMap[item.id]=item});
  var element=function(id){return document.getElementById(id)};
  var money=function(value){return new Intl.NumberFormat(language==="fr"?"fr-FR":language==="ar"?"ar-MA":language==="es"?"es-ES":"en-GB",{maximumFractionDigits:0}).format(value)+(language==="ar"?" درهم":" MAD")};
  var cards=[].slice.call(root.querySelectorAll(".bp-offer"));
  var filters=[].slice.call(root.querySelectorAll(".bp-filter"));
  var start=element("bp-start"),end=element("bp-end"),people=element("bp-travelers");
  var summary=element("bp-summary-items");
  var errors=element("bp-validation");
  var oldCopyLabel=element("bp-copy").textContent;
  function isoToday(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
  start.min=isoToday();
  end.min=isoToday();
  function qty(item){return amounts[item.id]||0}
  function selected(){return offers.filter(function(item){return qty(item)>0})}
  function hasCategory(cat){return selected().some(function(item){return item.category===cat})}
  function hasTents(){return selected().some(function(item){return item.unit==="tentNight"})}
  function days(){
    if(!start.value||!end.value)return 1;
    var one=Date.parse(start.value+"T00:00:00Z"),two=Date.parse(end.value+"T00:00:00Z");
    return Number.isFinite(one)&&Number.isFinite(two)&&two>one?Math.round((two-one)/86400000):1
  }
  function travelerCount(){return Math.max(1,Math.min(60,Number(people.value)||1))}
  // One group-size selector governs every price: people, tents and shared quads.
  function requiredUnits(item){
    if(!qty(item))return 0;
    if(item.unit==="person")return travelerCount();
    if(item.unit==="tentNight"||item.unit==="vehicle")return Math.ceil(travelerCount()/Math.max(1,Number(item.capacity)||1));
    return 1; // Fixed fee per guided hiking group, subject to final confirmation.
  }
  function price(item){return requiredUnits(item)*item.price*(item.unit==="tentNight"?days():1)}
  function total(){return selected().reduce(function(sum,item){return sum+price(item)},0)}
  function extras(){
    return [].slice.call(element("bp-extras").querySelectorAll('input[type="checkbox"]:checked')).map(function(chk){
      return (config.requestOptions||[]).find(function(x){return x.id===chk.value})
    }).filter(Boolean).map(function(x){return x[language]})
  }
  function line(){
    var div=document.createElement("div");div.className="bp-summary-line";return div
  }
  function addText(parent,tag,text,className){
    var node=document.createElement(tag);
    if(className)node.className=className;
    node.textContent=text;parent.appendChild(node);return node
  }
  function showSummary(){
    var camping=hasTents();
    element("bp-checkout-field").hidden=!camping;
    end.required=camping;
    if(camping&&start.value){
      var next=new Date(start.value+"T00:00:00Z");
      next.setUTCDate(next.getUTCDate()+1);
      end.min=next.toISOString().slice(0,10)
    }
    var seasonTip=element("bp-season-tip");
    seasonTip.hidden=!hasCategory("rafting");
    seasonTip.textContent=hasCategory("rafting")&&start.value.slice(5,7)==="07"?words.july+" "+words.season:words.season;
    summary.replaceChildren();
    if(!selected().length&&!extras().length){addText(summary,"p",words.empty,"bp-summary-empty")}
    selected().forEach(function(item){
      var row=line(),left=document.createElement("div");
      addText(left,"strong",item[language]);
      var mult=requiredUnits(item)+" × "+money(item.price);
      if(item.unit==="tentNight")mult+=" × "+days()+" "+(days()===1?words.night:words.nights);
      addText(left,"small",mult);
      row.appendChild(left);
      addText(row,"b",money(price(item)));
      summary.appendChild(row)
    });
    if(extras().length){
      var row=line();
      addText(row,"span",words.quoteTitle+": "+extras().join(", "));
      addText(row,"b",words.quote);
      summary.appendChild(row)
    }
    element("bp-total").textContent=money(total())
  }
  function renderChoice(id){
    var offer=cards.find(function(card){return card.dataset.id===id});
    if(!offer)return;
    var picked=amounts[id]>0;
    offer.dataset.selected=String(picked);
    var check=offer.querySelector(".bp-choice");
    if(check)check.checked=picked;
  }
  function refreshPeople(){
    [].slice.call(root.querySelectorAll(".bp-count-auto strong")).forEach(function(label){label.textContent=String(travelerCount())});
    element("bp-people-minus").disabled=travelerCount()<=1;
    element("bp-people-plus").disabled=travelerCount()>=60;
    showSummary()
  }
  root.querySelector("#bp-offers").addEventListener("change",function(event){
    var checkbox=event.target.closest("input.bp-choice[data-offer]");
    if(!checkbox)return;
    var id=checkbox.dataset.offer;
    var item=offerMap[id];
    // Route, tent size and quad seating are alternative options within a category.
    if(checkbox.checked&&item&&["rafting","camping","quad"].includes(item.category)){
      offers.forEach(function(other){
        if(other.id!==id&&other.category===item.category){
          amounts[other.id]=0;
          renderChoice(other.id);
        }
      });
    }
    amounts[id]=checkbox.checked?1:0;
    renderChoice(id);
    showSummary()
  });
  element("bp-filters").addEventListener("click",function(event){
    var clicked=event.target.closest("button[data-filter]");
    if(!clicked)return;
    var cat=clicked.dataset.filter;
    filters.forEach(function(button){button.setAttribute("aria-pressed",String(button===clicked))});
    cards.forEach(function(card){card.hidden=cat!=="all"&&card.dataset.category!==cat})
  });
  [start,end].forEach(function(input){
    input.addEventListener("change",showSummary);
    input.addEventListener("input",showSummary)
  });
  people.addEventListener("input",refreshPeople);
  people.addEventListener("change",refreshPeople);
  element("bp-people-minus").addEventListener("click",function(){
    people.value=String(Math.max(1,travelerCount()-1));
    refreshPeople()
  });
  element("bp-people-plus").addEventListener("click",function(){
    people.value=String(Math.min(60,travelerCount()+1));
    refreshPeople()
  });
  element("bp-extras").addEventListener("change",showSummary);
  function fail(message,control){
    errors.textContent=message;
    if(control)control.focus();
    errors.scrollIntoView({block:"nearest",behavior:"smooth"});
    return false
  }
  function validate(){
    errors.textContent="";
    if(!selected().length&&!extras().length)return fail(words.validationChoose,element("bp-offers"));
    var name=element("bp-name"),phone=element("bp-phone"),mail=element("bp-email");
    if(name.value.trim().length<2)return fail(words.validationName,name);
    if(phone.value.replace(/\D/g,"").length<7)return fail(words.validationPhone,phone);
    if(mail.value&&!mail.checkValidity()){mail.reportValidity();return false}
    if(!start.value||start.value<isoToday())return fail(words.validationDate,start);
    if(!people.checkValidity()||Number(people.value)<1||Number(people.value)>60)return fail(words.validationPeople,people);
    if(hasTents()){
      if(!end.value||end.value<=start.value||days()>45)return fail(words.validationCheckout,end);
    }
    if(hasCategory("rafting")){
      var month=Number(start.value.slice(5,7));
      if([3,4,5,6,7].indexOf(month)===-1)return fail(words.validationSeason,start)
    }
    return true
  }
  function message(){
    var lines=["*IMSFRANE CATHÉDRALE — "+words.request+"*","",
      "*"+words.contact+"*",element("bp-name").value.trim(),
      "WhatsApp: "+element("bp-phone").value.trim()];
    var email=element("bp-email").value.trim();
    if(email)lines.push("Email: "+email);
    var country=element("bp-country").value.trim();
    if(country)lines.push("Country / Pays: "+country);
    lines.push(words.language+": "+element("bp-language").value,"",
      "*"+words.requested+"*: "+start.value,
      words.travelers+": "+people.value);
    if(hasTents())lines.push(words.camping+": "+end.value+" ("+days()+" "+words.nights+")");
    var place=element("bp-place").value.trim();
    if(place)lines.push(words.place+": "+place);
    if(selected().length){
      lines.push("","*"+words.selection+"*");
      selected().forEach(function(item){
        var caption=requiredUnits(item)+" × "+item[language];
        if(item.unit==="tentNight")caption+=" × "+days()+" "+words.nights;
        lines.push("- "+caption+" — "+money(price(item)))
      })
    }
    if(extras().length)lines.push("","*"+words.quoteTitle+"*","- "+extras().join(", "));
    var note=element("bp-note").value.trim();
    if(note)lines.push("","*"+words.info+"*",note);
    lines.push("","*"+words.estimate+": "+money(total())+"*");
    if(extras().length)lines.push(words.quote+": "+extras().join(", "));
    lines.push(words.pending);
    return lines.join("\n")
  }
  element("bp-form").addEventListener("submit",function(event){
    event.preventDefault();
    if(!validate())return;
    window.location.assign("https://wa.me/"+config.whatsapp+"?text="+encodeURIComponent(message()))
  });
  element("bp-copy").addEventListener("click",function(){
    if(!validate())return;
    var output=message(),button=element("bp-copy");
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(output).then(function(){button.textContent=words.copied},function(){button.textContent=words.copyError})
    }else{button.textContent=words.copyError}
  });
  refreshPeople();
})();
