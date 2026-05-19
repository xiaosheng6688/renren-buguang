const fs = require('fs');
let d = fs.readFileSync('C:/Users/Administrator/.openclaw/workspace/light-master/index.html', 'utf8');

// Add checkPremium function after selectMode
const smIdx = d.indexOf('function selectMode(m){');
const afterSM = d.indexOf('}', smIdx) + 1;
const premiumCheck = `
function isPremium(){return S.isPremium}
function checkPremium(){
  if(!S.isPremium){showPremium();showToast('💎 请先解锁 Pro');return false}
  return true
}
const premiumModes=['aurora','music','strobe'];
`;

d = d.slice(0, afterSM) + premiumCheck + d.slice(afterSM);

// Patch toggleGrid
d = d.replace(
  'function toggleGrid(){S.gridOn=!S.gridOn;document.getElementById("gridBtn").classList.toggle("active",S.gridOn);document.querySelectorAll("#layoutOverlay .gl").forEach(e=>e.style.display=S.gridOn?"block":"none");showToast(S.gridOn?"网格已显示":"网格已隐藏")}',
  'function toggleGrid(){if(S.gridOn){S.gridOn=false;document.getElementById("gridBtn").classList.remove("active");document.querySelectorAll("#layoutOverlay .gl").forEach(e=>e.style.display="none");showToast("网格已隐藏");return}if(!checkPremium())return;S.gridOn=true;document.getElementById("gridBtn").classList.add("active");document.querySelectorAll("#layoutOverlay .gl").forEach(e=>e.style.display="block");showToast("网格已显示")}'
);

// Patch toggleLevel
d = d.replace(
  'function toggleLevel(){S.levelOn=!S.levelOn;document.getElementById("levelBtn").classList.toggle("active",S.levelOn);const ex=document.getElementById("levelIndicator");if(S.levelOn){if(ex)ex.remove();const d=document.createElement("div");d.id="levelIndicator";d.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;border-radius:50%;border:2px solid rgba(255,255,255,0.2);z-index:2;pointer-events:none;background:rgba(0,0,0,0.2);backdrop-filter:blur(4px)";const dot=document.createElement("div");dot.id="levelDot";dot.style.cssText="width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transition:all .1s;box-shadow:0 0 10px rgba(255,255,255,0.3)";d.appendChild(dot);document.body.appendChild(d);window.addEventListener("deviceorientation",handleOrient);showToast("📐 水平仪已开启",1500)}else{window.removeEventListener("deviceorientation",handleOrient);if(ex)ex.remove();showToast("水平仪已关闭",1000)}}',
  'function toggleLevel(){if(S.levelOn){S.levelOn=false;document.getElementById("levelBtn").classList.remove("active");const ex=document.getElementById("levelIndicator");window.removeEventListener("deviceorientation",handleOrient);if(ex)ex.remove();showToast("水平仪已关闭",1000);return}if(!checkPremium())return;S.levelOn=true;document.getElementById("levelBtn").classList.add("active");const d=document.createElement("div");d.id="levelIndicator";d.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;border-radius:50%;border:2px solid rgba(255,255,255,0.2);z-index:2;pointer-events:none;background:rgba(0,0,0,0.2);backdrop-filter:blur(4px)";const dot=document.createElement("div");dot.id="levelDot";dot.style.cssText="width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transition:all .1s;box-shadow:0 0 10px rgba(255,255,255,0.3)";d.appendChild(dot);document.body.appendChild(d);window.addEventListener("deviceorientation",handleOrient);showToast("📐 水平仪已开启",1500)}'
);

// Patch toggleMirror
d = d.replace(
  'function toggleMirror(){S.mirrorOn=!S.mirrorOn;document.getElementById("mirrorBtn").classList.toggle("active",S.mirrorOn);document.getElementById("lightCanvas").style.transform=S.mirrorOn?"scaleX(-1)":"none";showToast(S.mirrorOn?"镜像已开启":"镜像已关闭")}',
  'function toggleMirror(){if(S.mirrorOn){S.mirrorOn=false;document.getElementById("mirrorBtn").classList.remove("active");document.getElementById("lightCanvas").style.transform="none";showToast("镜像已关闭");return}if(!checkPremium())return;S.mirrorOn=true;document.getElementById("mirrorBtn").classList.add("active");document.getElementById("lightCanvas").style.transform="scaleX(-1)";showToast("镜像已开启")}'
);

// Add premium mode locking
const initEnd = d.indexOf('// Aurora CSS');
const modeLockCode = `
// Lock premium modes
document.querySelectorAll('.mode-btn').forEach(function(btn){
  btn.addEventListener('click',function(e){
    var mode=this.dataset.mode;
    if(mode&&premiumModes.includes(mode)&&!S.isPremium){
      e.stopPropagation();
      showPremium();
      showToast('💎 解锁 Pro 可使用此灯光模式');
      return;
    }
  });
});
`;
d = d.slice(0, initEnd) + modeLockCode + d.slice(initEnd);

fs.writeFileSync('C:/Users/Administrator/.openclaw/workspace/light-master/index.html', d, 'utf8');
console.log('Done. checkPremium:', d.includes('checkPremium'), 'premiumModes:', d.includes('premiumModes'));
