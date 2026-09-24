"use client";
import { FormEvent, useEffect, useState } from "react";
import { uploadMedia } from "@/lib/upload-media";
import { showToast } from "@/components/ToastProvider";
type Settings={companyName:string;email:string;phone:string;location:string;homeHeroImage:string;aboutImage:string;bannerImage:string};
const defaults:Settings={companyName:"BuildVision",email:"hello@buildvision.cm",phone:"+237 6XX XXX XXX",location:"Buea, Cameroon",homeHeroImage:"",aboutImage:"",bannerImage:""};
const imageFields:["homeHeroImage"|"aboutImage"|"bannerImage",string,string][]=[["homeHeroImage","Homepage hero image","homeHeroImage_file"],["aboutImage","About page image","aboutImage_file"],["bannerImage","Page banner image","bannerImage_file"]];

export default function SettingsPage(){
  const [values,setValues]=useState(defaults);const [status,setStatus]=useState("");
  useEffect(()=>{fetch("/api/settings").then(async r=>{if(r.ok)setValues({...defaults,...await r.json()})}).catch(()=>{})},[]);
  async function save(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget;let updated={...values};
    try{
      for(const [field,label,inputName] of imageFields){const file=(form.elements.namedItem(inputName) as HTMLInputElement).files?.[0];if(file){setStatus(`Uploading ${label.toLowerCase()}…`);updated={...updated,[field]:await uploadMedia(file,"site")};(form.elements.namedItem(inputName) as HTMLInputElement).value=""}}
      setValues(updated);setStatus("Saving settings…");const response=await fetch("/api/settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(updated)});const result=await response.json();if(!response.ok)throw new Error(result.error);setStatus("Settings and website images saved.");showToast("Settings saved successfully.");
    }catch(error){const message=error instanceof Error?error.message:"Could not save settings";setStatus(message);showToast(message,"error")}
  }
  return <div><p className="text-sm text-slate-500">Portal configuration</p><h1 className="text-3xl font-black">Settings</h1><form onSubmit={save} className="card mt-8 max-w-3xl p-6"><h2 className="text-xl font-black">Company information</h2><p className="mt-2 text-sm leading-6 text-slate-500">These details appear in public contact areas.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{([["companyName","Company name"],["email","Contact email"],["phone","Phone"],["location","Office location"]] as const).map(([key,label])=><label key={key} className="grid gap-2 text-sm font-bold">{label}<input className="input" value={values[key]} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))}/></label>)}</div><h2 className="mt-8 text-xl font-black">Website images</h2><p className="mt-2 text-sm text-slate-500">Upload cover images from your computer. The homepage, About page and page banners will use these files.</p><div className="mt-5 grid gap-5">{imageFields.map(([key,label,inputName])=><label key={key} className="grid gap-2 text-sm font-bold">{label}<input name={inputName} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="input"/>{values[key]&&<img src={values[key]} alt={label} className="h-28 w-48 rounded-lg object-cover"/>}</label>)}</div><button className="btn btn-primary mt-6">Save settings and uploads</button>{status&&<p role="status" className="mt-4 text-sm text-slate-600">{status}</p>}</form></div>
}
