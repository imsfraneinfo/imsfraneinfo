
import {createClient} from "npm:@supabase/supabase-js@2";
const project=Deno.env.get("SUPABASE_URL")||"https://ktrcrfoywokuuwzwnqsu.supabase.co";
const publicKey=Deno.env.get("SUPABASE_ANON_KEY")||"sb_publishable_GS2PtVM4vBv7epvV6aZSpA_XQyD9bCj";
const allowed=new Set(["https://imsfrane.com","https://www.imsfrane.com","https://imsfraneinfo.github.io"]);
function secret(){
 const old=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");if(old)return old;
 try{return JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}").default||""}catch{return ""}
}
function headers(origin){return {"Access-Control-Allow-Origin":allowed.has(origin) ? origin:"https://imsfrane.com","Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info","Access-Control-Allow-Methods":"POST,OPTIONS","Vary":"Origin","Cache-Control":"no-store"}}
function response(data,status,origin){return new Response(JSON.stringify(data),{status:status||200,headers:{...headers(origin),"Content-Type":"application/json"}})}
function safe(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
const cta={fr:["Voir l'activité","Désabonnement"],en:["Explore","Unsubscribe"],es:["Descubrir","Cancelar suscripción"],ar:["اكتشف التجربة","إلغاء الاشتراك"]};
Deno.serve(async(req)=>{
 const origin=req.headers.get("origin")||"";
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:headers(origin)});
 if(req.method!=="POST")return response({error:"METHOD_NOT_ALLOWED"},405,origin);
 if(origin&&!allowed.has(origin))return response({error:"ORIGIN_NOT_ALLOWED"},403,origin);
 const jwt=/^Bearer\s+(.+)$/i.exec(req.headers.get("authorization")||"")?.[1];
 if(!jwt)return response({error:"AUTH_REQUIRED"},401,origin);
 const service=secret();
 if(!service)return response({error:"SERVICE_NOT_CONFIGURED"},503,origin);
 const authClient=createClient(project,publicKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const adminClient=createClient(project,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const who=await authClient.auth.getUser(jwt);
 if(who.error||!who.data.user)return response({error:"AUTH_REQUIRED"},401,origin);
 const admin=await adminClient.from("member_admins").select("user_id").eq("user_id",who.data.user.id).maybeSingle();
 if(admin.error||!admin.data)return response({error:"ADMIN_REQUIRED"},403,origin);
 const resendKey=Deno.env.get("RESEND_API_KEY")||"",from=Deno.env.get("MEMBER_EMAIL_FROM")||"";
 let payload={};try{payload=await req.json()}catch{return response({error:"INVALID_JSON"},400,origin)}
 const isConfigured=Deno.env.get("MEMBER_EMAIL_SEND_ENABLED")==="true"&&!!resendKey&&!!from;
 if(payload.action==="status")return response({configured:isConfigured},200,origin);

 if(Deno.env.get("MEMBER_EMAIL_SEND_ENABLED")!=="true"||!resendKey||!from)
  return response({error:"EMAIL_NOT_CONFIGURED",hint:"Set RESEND_API_KEY, MEMBER_EMAIL_FROM and MEMBER_EMAIL_SEND_ENABLED=true in Supabase Secrets after verifying the sending domain."},503,origin);

 const broadcastId=Number(payload.broadcast_id);
 if(!Number.isSafeInteger(broadcastId)||broadcastId<1)return response({error:"INVALID_BROADCAST_ID"},400,origin);
 const bc=await adminClient.from("member_broadcasts").select("id,sender_id,title,body,link_path,marketing,preview_only,translations").eq("id",broadcastId).maybeSingle();
 if(bc.error||!bc.data)return response({error:"BROADCAST_NOT_FOUND"},404,origin);
 const broadcast=bc.data;
 if(broadcast.preview_only&&broadcast.sender_id!==who.data.user.id)return response({error:"PREVIEW_OWNER_ONLY"},403,origin);
 const stale=new Date(Date.now()-10*60*1000).toISOString();
 await adminClient.from("member_email_delivery_queue").update({status:"failed",updated_at:new Date().toISOString(),error_message:"Expired processing lease"}).eq("broadcast_id",broadcastId).eq("status","processing").lt("updated_at",stale).lt("attempts",3);
 const queued=await adminClient.from("member_email_delivery_queue").select("id,user_id,status,attempts").eq("broadcast_id",broadcastId).in("status",["pending","failed"]).lt("attempts",3).order("id").limit(20);
 if(queued.error)return response({error:"QUEUE_ERROR"},500,origin);
 let sent=0,failed=0,skipped=0;
 for(const item of queued.data||[]){
  const claimed=await adminClient.from("member_email_delivery_queue").update({status:"processing",attempts:item.attempts+1,updated_at:new Date().toISOString()}).eq("id",item.id).eq("status",item.status).eq("attempts",item.attempts).select("id").maybeSingle();
  if(claimed.error||!claimed.data)continue;
  const status=async (state,extra)=>adminClient.from("member_email_delivery_queue").update({status:state,updated_at:new Date().toISOString(),...(extra||{})}).eq("id",item.id);
  try{
   const u=await adminClient.auth.admin.getUserById(item.user_id);
   const member=u.data.user;
   if(u.error||!member?.email||!member?.email_confirmed_at){await status("skipped",{error_message:"No verified email"});skipped++;continue}
   const checks=await Promise.all([
    adminClient.from("member_notification_preferences").select("email_updates,marketing_opt_in").eq("user_id",item.user_id).maybeSingle(),
    adminClient.from("member_profiles").select("locale").eq("user_id",item.user_id).maybeSingle()
   ]);
   const preference=checks[0].data,locale=["fr","en","ar","es"].includes(checks[1].data?.locale)?checks[1].data.locale:"fr";
   if(!broadcast.preview_only&&(!preference?.email_updates||(broadcast.marketing&&!preference.marketing_opt_in))){await status("skipped",{error_message:"Member declined email"});skipped++;continue}
   let token=await adminClient.from("member_email_unsubscribe_tokens").select("token").eq("user_id",item.user_id).maybeSingle();
   if(!token.data){
    const ins=await adminClient.from("member_email_unsubscribe_tokens").insert({user_id:item.user_id}).select("token").single();
    token=ins.error?await adminClient.from("member_email_unsubscribe_tokens").select("token").eq("user_id",item.user_id).single():ins;
   }
   if(!token.data?.token)throw Error("Unsubscribe link unavailable");
   const translated=broadcast.translations?.[locale]||{};
   const title=locale==="fr"?broadcast.title:(translated.title||broadcast.title);
   const body=locale==="fr"?broadcast.body:(translated.body||broadcast.body);
   const link="https://imsfrane.com"+(broadcast.link_path?String(broadcast.link_path).replace(/^\/(fr|en|ar|es)\//,"/"+locale+"/"):"/"+locale+"/");
   const unsub=project+"/functions/v1/member-email-unsubscribe?token="+token.data.token;
   const labels=cta[locale],unsubscribeTitle=labels[1];
   const html=['<!doctype html><html><body style="background:#f8f7f1;padding:24px;font-family:Arial,sans-serif;color:#183c2d"><div style="max-width:620px;margin:auto;background:#fff;border:1px solid #e4e7dd;border-radius:13px;overflow:hidden">',
   '<header style="background:#103d2f;color:#e5c471;padding:25px"><b>IMSFRANE CATHÉDRALE</b><p>Atlas Adventures · Morocco</p></header>',
   '<main style="padding:28px"><h1 style="color:#173e2d;font-size:25px">'+safe(title)+'</h1><p style="white-space:pre-line;line-height:1.9">'+safe(body)+'</p>',
   '<a href="'+safe(link)+'" style="display:inline-block;background:#143e2d;color:#f8dfaa;text-decoration:none;border-radius:8px;padding:13px 20px;margin-top:15px">'+safe(labels[0])+'</a></main>',
   '<footer style="background:#f8f7ef;padding:20px;font-size:12px;color:#667267">Imsfrane Cathédrale · Email updates<br>',
   '<a style="color:#725a25" href="'+safe(unsub)+'">'+safe(unsubscribeTitle)+'</a></footer></div></body></html>'].join("");
   const result=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+resendKey,"Content-Type":"application/json","Idempotency-Key":"ims-broadcast-"+broadcastId+"-"+item.user_id},body:JSON.stringify({
     from,to:[member.email],subject:title,html,text:title+"\n\n"+body+"\n"+link+"\n\n"+unsub,
     headers:{"List-Unsubscribe":"<"+unsub+">","List-Unsubscribe-Post":"List-Unsubscribe=One-Click"}
   })});
   const output=await result.json().catch(()=>({}));
   if(!result.ok||!output.id)throw Error("Email provider HTTP "+result.status);
   await status("sent",{sent_at:new Date().toISOString(),provider_id:String(output.id).slice(0,120)});
   sent++;
   await new Promise(resolve=>setTimeout(resolve,600));
  }catch(e){await status("failed",{error_message:String(e?.message||e).slice(0,240)});failed++}
 }
 const remain=await adminClient.from("member_email_delivery_queue").select("id",{count:"exact",head:true}).eq("broadcast_id",broadcastId).in("status",["pending","failed"]).lt("attempts",3);
 return response({broadcast_id:broadcastId,sent,failed,skipped,remaining:remain.count||0},200,origin);
});
