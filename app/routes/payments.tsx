import { useState } from "react";
import { Icon, Modal, PageHeader } from "../components";
import { useApp } from "../app-context";
const bills=[{id:"nea",name:"Nepal Electricity Authority",account:"014.07.112233",amount:1840,due:"12 Sep 2026"},{id:"kukl",name:"Kathmandu Upatyaka Khanepani",account:"KTM-883102",amount:650,due:"18 Sep 2026"},{id:"vehicle",name:"Bagmati vehicle tax",account:"BA 2 PA 4821",amount:600,due:"30 Sep 2026"}];
export default function Payments(){
 const {paidBills,payBill,showToast}=useApp();
 const [selected,setSelected]=useState<(typeof bills)[number]|null>(null);
 const [pin,setPin]=useState("");
 const due=bills.filter(b=>!paidBills.includes(b.id)).reduce((a,b)=>a+b.amount,0);
 const confirm=()=>{if(pin.length<4){showToast("Enter the 4-digit demo PIN");return}if(selected){payBill(selected.id);showToast("Payment completed and receipt created");setSelected(null);setPin("")}};
 return <div className="page">
  <PageHeader eyebrow="GOVERNMENT PAYMENT HUB" title="Payments" copy="Review dues, pay government bills, and keep official receipts together."/>
  <section className="payment-balance"><div><p>Total due</p><h2>रू {due.toLocaleString()}</h2><span>{bills.filter(b=>!paidBills.includes(b.id)).length} bills awaiting payment</span></div><div className="payment-mark">रू</div></section>
  <section className="bill-list"><div className="list-head"><h2>Linked bills</h2><span>Updated today</span></div>{bills.map(b=>{const paid=paidBills.includes(b.id);return <div className="bill-row" key={b.id}><span className="bill-icon"><Icon name={b.id==="vehicle"?"card":"building"}/></span><span><b>{b.name}</b><small>{b.account} · Due {b.due}</small></span><strong>रू {b.amount.toLocaleString()}</strong>{paid?<span className="status approved">Paid</span>:<button className="button small" onClick={()=>setSelected(b)}>Pay now</button>}</div>})}</section>
  <section className="receipt-note"><Icon name="file"/><div><h3>Official receipts, automatically filed</h3><p>Every completed payment receives an FCGO-compatible transaction reference in your activity history.</p></div></section>
  <Modal open={!!selected} onClose={()=>setSelected(null)} title="Confirm government payment">{selected&&<div className="pay-confirm"><div className="payee"><span>{selected.id==="nea"?"NEA":"GOV"}</span><div><b>{selected.name}</b><small>Account {selected.account}</small></div></div><dl><div><dt>Bill amount</dt><dd>रू {selected.amount.toLocaleString()}</dd></div><div><dt>Service charge</dt><dd>रू 0</dd></div><div className="pay-total"><dt>Total</dt><dd>रू {selected.amount.toLocaleString()}</dd></div></dl><label><span>Demo transaction PIN</span><input className="pin-input" inputMode="numeric" maxLength={4} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,""))} placeholder="••••"/></label><p className="form-hint">Use any four digits. No real payment will be made.</p><button className="button primary full" onClick={confirm}><Icon name="lock"/> Confirm payment</button></div>}</Modal>
 </div>
}
