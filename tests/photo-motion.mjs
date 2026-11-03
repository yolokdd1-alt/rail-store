import assert from 'node:assert/strict';
import {PhotoMotion,photoPose} from '../docs/photo-motion.js';
const engine=new PhotoMotion(),hooks=engine.items.map(m=>m.hook);
function valid(){assert.deepEqual(engine.items.map(m=>m.hook),hooks,'hooks never move');for(const m of engine.items){assert(Number.isFinite(m.open)&&m.open>=0&&m.open<=1);const pose=photoPose(m.open);assert(Math.abs(pose.frontOpacity+pose.sideOpacity-1)<1e-10);assert(pose.frontScale>=.24&&pose.frontScale<=1)}}
for(let i=0;i<100;i++){engine.select((i*7)%5);for(let j=0;j<4;j++){engine.step(1/60);valid()}}
const before=engine.items.map(m=>m.open);engine.select(2);assert.deepEqual(engine.items.map(m=>m.open),before,'retarget without a pose jump');
for(let i=0;i<240;i++)engine.step(1/60);assert(!engine.moving,'motion settles');engine.settle();assert.equal(engine.items[2].open,1);assert.equal(engine.items.reduce((s,m)=>s+m.open,0),1);
engine.preview(-60);for(let i=0;i<15;i++)engine.step(1/60);assert(engine.items[3].open>0,'drag reveals adjacent photo');engine.cancelPreview();for(let i=0;i<180;i++)engine.step(1/60);engine.settle();assert.equal(engine.items[2].open,1,'cancel restores current photo');assert.equal(engine.index,2);
const a=new PhotoMotion(),b=new PhotoMotion();a.select(1);b.select(1);for(let i=0;i<30;i++)a.step(1/60);for(let i=0;i<60;i++)b.step(1/120);assert(Math.abs(a.items[1].open-b.items[1].open)<.003,'refresh-rate independent timing');
engine.select(4);engine.settle();assert.equal(engine.items[4].open,1,'instant pose for reduced motion');assert(!engine.moving);
assert.equal(photoPose(0).frontOpacity,0);assert.equal(photoPose(1).sideOpacity,0);assert.equal(photoPose(1).frontScale,1);
console.log('PASS: fixed hooks, continuous interruption, photo blend, drag/cancel, stable timing, reduced motion.');
