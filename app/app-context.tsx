import { createContext, useContext, useEffect, useState } from "react";
import { initialAcademicRecords, initialDocuments } from "./data";

export type Application={id:string;serviceId:string;name:string;nepali:string;date:string;status:"Submitted"|"In review"|"Approved";progress:number;reference:string};
export type Notification={id:string;title:string;body:string;time:string;read:boolean};
export type DocumentRecord=(typeof initialDocuments)[number];
export type AcademicRecord=(typeof initialAcademicRecords)[number];
type AppState={applications:Application[];documents:DocumentRecord[];academicRecords:AcademicRecord[];notifications:Notification[];paidBills:string[];language:"EN"|"ने";privacy:boolean;biometric:boolean};
type AppContextValue=AppState & {setLanguage:(v:"EN"|"ने")=>void;setPrivacy:(v:boolean)=>void;setBiometric:(v:boolean)=>void;addApplication:(a:Application)=>void;addDocument:(d:DocumentRecord)=>void;addAcademicRecord:(d:AcademicRecord)=>void;markRead:(id?:string)=>void;payBill:(id:string)=>void;toast:string;showToast:(s:string)=>void};

const initial:AppState={
 applications:[
  {id:"APP-240731",serviceId:"passport",name:"e-Passport pre-enrolment",nepali:"ई-पासपोर्ट पूर्वदर्ता",date:"31 Aug 2026",status:"In review",progress:64,reference:"PSP-2084-31"},
  {id:"APP-190722",serviceId:"pcc",name:"Police Clearance Certificate",nepali:"प्रहरी चारित्र्य प्रमाणपत्र",date:"22 Aug 2026",status:"Approved",progress:100,reference:"PCC-4821-09"},
 ],
 documents:initialDocuments,academicRecords:initialAcademicRecords,
 notifications:[
  {id:"N-1",title:"Passport application moved to review",body:"Your identity and attachments were accepted. The Department of Passport is reviewing your request.",time:"Today, 09:42",read:false},
  {id:"N-2",title:"Electricity bill is ready",body:"NEA consumer 014.07.112233 has a balance of रू 1,840 due on 12 September.",time:"Yesterday",read:false},
  {id:"N-3",title:"Police clearance approved",body:"Your digitally signed certificate is available in Documents.",time:"22 Aug",read:true},
 ],paidBills:[],language:"EN",privacy:false,biometric:true,
};
const Ctx=createContext<AppContextValue|null>(null);

export function AppProvider({children}:{children:React.ReactNode}){
 const [state,setState]=useState<AppState>(initial); const [toast,setToast]=useState("");
 useEffect(()=>{try{const saved=localStorage.getItem("nagarik-demo-state");if(saved)setState({...initial,...JSON.parse(saved)});}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem("nagarik-demo-state",JSON.stringify(state));}catch{}},[state]);
 const showToast=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(""),2800)};
 const value:AppContextValue={...state,
  setLanguage:v=>setState(x=>({...x,language:v})),setPrivacy:v=>setState(x=>({...x,privacy:v})),setBiometric:v=>setState(x=>({...x,biometric:v})),
  addApplication:a=>setState(x=>({...x,applications:[a,...x.applications],notifications:[{id:`N-${Date.now()}`,title:"Application submitted",body:`${a.name} was received. Reference ${a.reference}.`,time:"Just now",read:false},...x.notifications]})),
  addDocument:d=>setState(x=>({...x,documents:[d,...x.documents],notifications:[{id:`N-${Date.now()}`,title:"Document linked",body:`${d.type} is awaiting issuer verification.`,time:"Just now",read:false},...x.notifications]})),
  addAcademicRecord:d=>setState(x=>({...x,academicRecords:[d,...x.academicRecords],notifications:[{id:`N-${Date.now()}`,title:"Academic record synchronized",body:`${d.qualification} from ${d.institution} is ready for verification.`,time:"Just now",read:false},...x.notifications]})),
  markRead:id=>setState(x=>({...x,notifications:x.notifications.map(n=>!id||n.id===id?{...n,read:true}:n)})),
  payBill:id=>setState(x=>({...x,paidBills:[...x.paidBills,id],notifications:[{id:`N-${Date.now()}`,title:"Payment successful",body:`Payment receipt ${id.toUpperCase()}-2026 has been added to your records.`,time:"Just now",read:false},...x.notifications]})),toast,showToast};
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useApp(){const v=useContext(Ctx);if(!v)throw new Error("AppProvider missing");return v}
