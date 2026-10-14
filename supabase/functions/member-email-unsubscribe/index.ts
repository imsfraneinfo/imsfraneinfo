
import {createClient} from "npm:@supabase/supabase-js@2";
const project=Deno.env.get("SUPABASE_URL")||"https://ktrcrfoywokuuwzwnqsu.supabase.co";
function key(){const old=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");if(old)return old;try{return JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}").default||""}catch{return ""}}
const common={"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","Referrer-Policy":"no-referrer","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'"};
function page(title,body,code){return new Response('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><body style="background:#f7f5ef;color:#174332;font:16px Arial,sans-serif;padding:38px 20px"><main style="max-width:460px;margin:12vh auto;background:white;padding:30px;border:1px solid #e5dbb9;border-radius:16px"><h1 style="font-size:23px">'+title+'</h1>'+body+'</main></body></html>',{status:code||200,headers:common})}
Deno.serve(async req=>{
 if(!["GET","POST"].includes(req.method))return page("Méthode non autorisée","",405);
 const token=new URL(req.url).searchParams.get("token")||"";
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token))return page("Lien invalide","<p>Ce lien de désabonnement est invalide.</p>",400);
 const service=key();
 if(!service)return page("Indisponible","<p>Veuillez réessayer plus tard.</p>",503);
 const db=createClient(project,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const lookup=await db.from("member_email_unsubscribe_tokens").select("user_id").eq("token",token).maybeSingle();
 if(lookup.error||!lookup.data)return page("Lien invalide","<p>Ce lien ne peut pas être utilisé.</p>",404);
 if(req.method==="GET")return page("Se désabonner · Imsfrane Cathédrale",'<p>Vous ne recevrez plus les actualités et offres par e-mail. Les informations de votre compte et les notifications internes restent disponibles.</p><form method="POST" action="?token='+token+'"><button type="submit" style="background:#164433;color:white;padding:13px 20px;border:0;border-radius:8px;font-weight:bold;cursor:pointer">Confirmer le désabonnement</button></form>');
 const result=await db.from("member_notification_preferences").upsert({user_id:lookup.data.user_id,email_updates:false,marketing_opt_in:false},{onConflict:"user_id"});
 if(result.error)return page("Erreur","<p>Veuillez réessayer.</p>",500);
 return page("Désabonnement confirmé","<p>Les actualités et offres Imsfrane par e-mail sont désormais désactivées. Vous pouvez les réactiver depuis les préférences de votre compte.</p>");
});
