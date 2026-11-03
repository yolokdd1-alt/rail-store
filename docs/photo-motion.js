// Photographs stay on fixed hooks. Only their reveal and a tiny settling swing change.
export class PhotoMotion {
  constructor(count=5,index=2){this.count=count;this.index=index;this.items=Array.from({length:count},(_,i)=>({hook:(i+.5)/count*100,open:i===index?1:0,target:i===index?1:0,velocity:0,sway:0,swayVelocity:0,label:0,labelVelocity:0}))}
  select(index){const next=(index+this.count)%this.count;if(next!==this.index){const direction=next>this.index?1:-1;this.items[next].swayVelocity+=direction*2.6;this.items[this.index].swayVelocity-=direction*1.6;this.items[next].labelVelocity-=direction*4}this.index=next;this.cancelPreview();return next}
  preview(dx){this.cancelPreview();const adjacent=(this.index+(dx<0?1:-1)+this.count)%this.count;const pull=Math.min(.72,Math.abs(dx)/110);this.items[this.index].target=1-pull;this.items[adjacent].target=pull}
  cancelPreview(){this.items.forEach((m,i)=>m.target=i===this.index?1:0)}
  settle(){this.items.forEach(m=>{m.open=m.target;m.velocity=m.sway=m.swayVelocity=m.label=m.labelVelocity=0})}
  step(seconds){const dt=Math.min(Math.max(seconds,0),.06),steps=Math.max(1,Math.ceil(dt/(1/120))),h=dt/steps;for(let j=0;j<steps;j++)for(const m of this.items){m.velocity+=((m.target-m.open)*225-m.velocity*30)*h;m.open+=m.velocity*h;if(m.open<0||m.open>1){m.open=Math.min(1,Math.max(0,m.open));m.velocity=0}m.swayVelocity+=(-55*m.sway-12*m.swayVelocity)*h;m.sway+=m.swayVelocity*h;m.labelVelocity+=((-m.sway*1.4-m.label)*55-10*m.labelVelocity)*h;m.label+=m.labelVelocity*h}return this.moving}
  get moving(){return this.items.some(m=>Math.abs(m.open-m.target)>.0005||Math.abs(m.velocity)>.003||Math.abs(m.sway)>.006||Math.abs(m.swayVelocity)>.02||Math.abs(m.label)>.01||Math.abs(m.labelVelocity)>.03)}
}
export const smoothstep=(a,b,value)=>{const t=Math.max(0,Math.min(1,(value-a)/(b-a)));return t*t*(3-2*t)};
export function photoPose(open,sideRatio=.32){const p=Math.max(0,Math.min(1,open)),spread=Math.sin(p*Math.PI/2),blend=smoothstep(.16,.28,p),frontScale=.24+.76*spread,match=smoothstep(.02,.14,p),sideScale=.78+(frontScale/sideRatio-.78)*match;return {frontScale,sideScale,frontOpacity:blend,sideOpacity:1-blend,tagShift:spread*.21,shadowScale:.28+.72*spread}}
