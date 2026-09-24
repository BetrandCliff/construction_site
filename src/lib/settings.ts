import "server-only";
import { supabaseRequest } from "@/lib/supabase";
export type SiteSettings={companyName:string;email:string;phone:string;location:string;homeHeroImage:string;aboutImage:string;bannerImage:string};
const defaults:SiteSettings={companyName:"BuildVision",email:"hello@buildvision.cm",phone:"+237 6XX XXX XXX",location:"Buea, Cameroon",homeHeroImage:"",aboutImage:"",bannerImage:""};
export async function getSiteSettings():Promise<SiteSettings>{try{const rows=await supabaseRequest<{data:Partial<SiteSettings>}[]>("site_settings",{query:"?id=eq.1&select=data"});return {...defaults,...rows[0]?.data}}catch{return defaults}}
