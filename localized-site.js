/* Arabic/Spanish Imsfrane Demo booking enquiry: no payment, no auto-confirmation. */
(function(){
"use strict";
function ready(){
  document.querySelectorAll("form.locale-request").forEach(function(form){
    form.addEventListener("submit",function(event){
      event.preventDefault();
      if(!form.reportValidity())return;
      var v=new FormData(form),ar=form.dataset.language==="ar";
      var parts=ar?[
        "مرحباً، أرغب في الاستفسار عن نشاط في مسفران.",
        "النشاط: "+v.get("activity"),
        "التاريخ المقترح: "+v.get("date"),
        "عدد الأشخاص: "+v.get("people")
      ]:[
        "Hola, me gustaría consultar una actividad en Imsfrane.",
        "Actividad: "+v.get("activity"),
        "Fecha prevista: "+v.get("date"),
        "Participantes: "+v.get("people")
      ];
      var name=String(v.get("name")||"").trim(),note=String(v.get("message")||"").trim();
      if(name)parts.push((ar?"الاسم: ":"Nombre: ")+name);
      if(note)parts.push((ar?"رسالة: ":"Consulta: ")+note);
      parts.push(ar?"أرجو تأكيد التوفر والسعر والشروط قبل الحجز.":"Agradecería confirmar la disponibilidad, el precio y las condiciones antes de reservar.");
      var url="https://wa.me/212667772551?text="+encodeURIComponent(parts.join("\n"));
      window.location.assign(url);
    });
  });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});
else ready();
})();