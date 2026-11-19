// Cloudflare Worker: OPENAI_API_KEY, APP_TOKEN and ALLOWED_ORIGIN are secrets/config.
const schema={type:'object',additionalProperties:false,required:['name','items'],properties:{name:{type:'string'},items:{type:'array',items:{type:'object',additionalProperties:false,required:['name','grams','kcal100','protein100'],properties:{name:{type:'string'},grams:{type:'number'},kcal100:{type:'number'},protein100:{type:'number'}}}}}};
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'';
 const headers={'Access-Control-Allow-Origin':env.ALLOWED_ORIGIN||'', 'Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin','Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'};
 const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(!env.ALLOWED_ORIGIN||origin!==env.ALLOWED_ORIGIN)return new Response('Forbidden',{status:403});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(request.method!=='POST')return reply({error:'Método no permitido'},405);
 if(!env.OPENAI_API_KEY||!env.APP_TOKEN)return reply({error:'Servidor sin configurar'},503);
 const supplied=request.headers.get('Authorization')||'';
 if(supplied!==`Bearer ${env.APP_TOKEN}`)return reply({error:'Acceso no autorizado'},401);
 if(Number(request.headers.get('Content-Length'))>3000000)return reply({error:'Foto demasiado grande'},413);
 let payload;try{payload=await request.json()}catch{return reply({error:'JSON inválido'},400)}
 const {image,note}=payload||{};
 if(typeof image!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(image)||image.length>3000000||typeof note!=='string'&&note!==undefined||String(note||'').length>500)return reply({error:'Datos inválidos'},400);
 const prompt='Identifica cada ingrediente visible en la comida, separando pan, relleno, guarnición y salsas. Estima gramos y kcal/proteína por 100 g para cada uno. Si hay aceite o ingredientes indicados en la nota, inclúyelos por separado. Si no puedes inferir una cantidad, usa una porción habitual aproximada. Responde en español. Son estimaciones para que la persona las corrija. No inventes una marca ni una etiqueta nutricional exacta.';
 const upstream=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:env.OPENAI_MODEL||'gpt-5.4-mini',store:false,max_output_tokens:650,input:[{role:'user',content:[{type:'input_text',text:`${prompt}\nNota: ${note||'ninguna'}`},{type:'input_image',image_url:image,detail:'high'}]}],text:{format:{type:'json_schema',name:'food_estimate',strict:true,schema}}})});
 if(!upstream.ok)return reply({error:'El análisis no está disponible'},502);
 const data=await upstream.json();const out=data.output?.flatMap(o=>o.content||[]).find(c=>c.type==='output_text')?.text;
 if(!out)return reply({error:'No se pudo interpretar la foto'},502);
 let result;try{result=JSON.parse(out)}catch{return reply({error:'Respuesta inválida'},502)}
 if(!Array.isArray(result.items)||!result.items.length||result.items.length>30||result.items.some(i=>!i.name||![i.grams,i.kcal100,i.protein100].every(Number.isFinite)||i.grams<=0||i.grams>10000||i.kcal100<0||i.kcal100>1000||i.protein100<0||i.protein100>100))return reply({error:'Estimación inválida'},502);
 return reply(result);
 }};
