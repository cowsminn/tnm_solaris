'use strict';

// ============================================================
// PERLIN NOISE
// ============================================================
var PERM=(function(){
  var p=new Uint8Array(512);
  var src=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  for(var i=0;i<256;i++)
     p[i]=p[i+256]=src[i];
  function fade(t)
  {
    return t*t*t*(t*(t*6-15)+10);
  }
  function lerp(a,b,t)
  {
    return a+(b-a)*t;
  }


  //Acesta este algoritmul de bază Perlin noise, care ia coordonatele 3D (x, y, z) și returnează o valoare de zgomot între -1 și 1.
  //  Folosește o funcție de interpolare linear interpolation
  function grad(h,x,y,z){
    h=h&15;var u=h<8?x:y,v=h<4?y:(h===12||h===14)?x:z;
    
    return((h&1)===0?u:-u)+((h&2)===0?v:-v);}
  function noise(x,y,z){
    if(z===undefined)z=0;
    var X=Math.floor(x)&255,Y=Math.floor(y)&255,Z=Math.floor(z)&255;
    x-=Math.floor(x);y-=Math.floor(y);z-=Math.floor(z);
    var u=fade(x),v=fade(y),w=fade(z);
    var A=p[X]+Y,AA=p[A]+Z,AB=p[A+1]+Z,B=p[X+1]+Y,BA=p[B]+Z,BB=p[B+1]+Z;
    return lerp(
      lerp(lerp(grad(p[AA],x,y,z),grad(p[BA],x-1,y,z),u),lerp(grad(p[AB],x,y-1,z),grad(p[BB],x-1,y-1,z),u),v),
      lerp(lerp(grad(p[AA+1],x,y,z-1),grad(p[BA+1],x-1,y,z-1),u),lerp(grad(p[AB+1],x,y-1,z-1),grad(p[BB+1],x-1,y-1,z-1),u),v),
      w
    );
  }
  //Fractal Brownian Motion (FBM), o tehnică care folosește mai multe straturi de Perlin noise cu frecvențe și amplitudini diferite 
  // pentru a crea un efect mai detaliat și mai complex.
  function fbm(x,y,z,oct){
    if(oct===undefined)oct=6;
    var val=0,amp=1,freq=1,max=0;
    for(var i=0;i<oct;i++){val+=noise(x*freq,y*freq,z*freq)*amp;max+=amp;amp*=0.5;freq*=2;}
    return val/max;
  }
  return {noise:noise,fbm:fbm};
})();

// ============================================================
// PLANET DATA
// ============================================================
var PD = {
  Sun:     {label:'Soare',   type:'Stea G2V',           diamKm:1392000,distAU:0,      periodDays:0,     moons:0,  gravity:'274 m/s2', temp:'5778 K',     mass:'1.989x10^30 kg', atm:[{n:'Hidrogen',p:73.5,c:'#fff176'},{n:'Heliu',p:24.9,c:'#80deea'},{n:'Oxigen',p:0.77,c:'#4fc3f7'},{n:'Carbon',p:0.29,c:'#a5d6a7'},{n:'Altele',p:0.54,c:'#b0bec5'}]},
  Mercury: {label:'Mercur',  type:'Planeta terestra',   diamKm:4879,   distAU:0.387,  periodDays:88,    moons:0,  gravity:'3.7 m/s2', temp:'-180/430C',  mass:'3.3x10^23 kg',   atm:[{n:'Oxigen',p:42,c:'#4fc3f7'},{n:'Sodiu',p:29,c:'#ffcc80'},{n:'Hidrogen',p:22,c:'#fff176'},{n:'Heliu',p:6,c:'#80deea'},{n:'Altele',p:1,c:'#b0bec5'}]},
  Venus:   {label:'Venus',   type:'Planeta terestra',   diamKm:12104,  distAU:0.723,  periodDays:225,   moons:0,  gravity:'8.87 m/s2',temp:'465C medie', mass:'4.87x10^24 kg',  atm:[{n:'CO2',p:96.5,c:'#ffcc80'},{n:'Azot N2',p:3.5,c:'#80cbc4'},{n:'SO2',p:0.015,c:'#fff176'},{n:'H2O',p:0.002,c:'#4fc3f7'},{n:'Altele',p:0.003,c:'#b0bec5'}]},
  Earth:   {label:'Pamant',  type:'Planeta terestra',   diamKm:12742,  distAU:1.0,    periodDays:365,   moons:1,  gravity:'9.81 m/s2',temp:'-88/58C',    mass:'5.97x10^24 kg',  atm:[{n:'Azot N2',p:78.09,c:'#80cbc4'},{n:'Oxigen O2',p:20.95,c:'#4fc3f7'},{n:'Argon Ar',p:0.93,c:'#ce93d8'},{n:'CO2',p:0.04,c:'#ffcc80'},{n:'Altele',p:0.02,c:'#b0bec5'}]},
  Mars:    {label:'Marte',   type:'Planeta terestra',   diamKm:6779,   distAU:1.524,  periodDays:687,   moons:2,  gravity:'3.72 m/s2',temp:'-87/-5C',    mass:'6.42x10^23 kg',  atm:[{n:'CO2',p:95.32,c:'#ffcc80'},{n:'Azot N2',p:2.6,c:'#80cbc4'},{n:'Argon Ar',p:1.9,c:'#ce93d8'},{n:'Oxigen O2',p:0.13,c:'#4fc3f7'},{n:'Altele',p:0.05,c:'#b0bec5'}]},
  Jupiter: {label:'Jupiter', type:'Gigant gazos',        diamKm:139820, distAU:5.203,  periodDays:4333,  moons:95, gravity:'24.79 m/s2',temp:'-108C nori',mass:'1.898x10^27 kg', atm:[{n:'Hidrogen',p:89.8,c:'#fff176'},{n:'Heliu',p:10.2,c:'#80deea'},{n:'Metan',p:0.3,c:'#a5d6a7'},{n:'Amoniac',p:0.026,c:'#ffcc80'},{n:'Altele',p:0.07,c:'#b0bec5'}]},
  Saturn:  {label:'Saturn',  type:'Gigant gazos',        diamKm:116460, distAU:9.537,  periodDays:10759, moons:146,gravity:'10.44 m/s2',temp:'-139C nori',mass:'5.68x10^26 kg',  atm:[{n:'Hidrogen',p:96.3,c:'#fff176'},{n:'Heliu',p:3.25,c:'#80deea'},{n:'Metan',p:0.45,c:'#a5d6a7'},{n:'Altele',p:0.04,c:'#b0bec5'}]},
  Uranus:  {label:'Uranus',  type:'Gigant de gheata',    diamKm:50724,  distAU:19.191, periodDays:30687, moons:27, gravity:'8.69 m/s2', temp:'-197C nori', mass:'8.68x10^25 kg',  atm:[{n:'Hidrogen',p:82.5,c:'#fff176'},{n:'Heliu',p:15.2,c:'#80deea'},{n:'Metan',p:2.3,c:'#4fc3f7'},{n:'Altele',p:0.1,c:'#b0bec5'}]},
  Neptune: {label:'Neptun',  type:'Gigant de gheata',    diamKm:49244,  distAU:30.069, periodDays:60190, moons:16, gravity:'11.15 m/s2',temp:'-201C nori', mass:'1.02x10^26 kg',  atm:[{n:'Hidrogen',p:80,c:'#fff176'},{n:'Heliu',p:19,c:'#80deea'},{n:'Metan',p:1.5,c:'#4fc3f7'},{n:'Altele',p:0.1,c:'#b0bec5'}]},
};

// ============================================================
// DATATEXTURE GENERATOR
// ============================================================
function makeDataTex(w, h, fillFn) {
  var data = new Uint8Array(w * h * 4);
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var rgba = fillFn(x, y, w, h);
      var idx = (y * w + x) * 4;
      data[idx]   = rgba[0];
      data[idx+1] = rgba[1];
      data[idx+2] = rgba[2];
      data[idx+3] = rgba[3] !== undefined ? rgba[3] : 255;
    }
  }
  var tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.needsUpdate = true;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function clamp(v,a,b){return v<a?a:v>b?b:v;}
function mix(a,b,t){return a*(1-t)+b*t;}

// ── TEXTURE GENERATORS ──────────────────────────────────────
function makeSunTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u = px/w, v = py/h;
    var lon = u*Math.PI*2, lat = (v-0.5)*Math.PI;
    var nx = Math.cos(lat)*Math.cos(lon), ny = Math.sin(lat), nz = Math.cos(lat)*Math.sin(lon);
    var g1 = PERM.fbm(nx*4+1, ny*4, nz*4, 8);
    var g2 = PERM.fbm(nx*8+2, ny*8+1, nz*8, 6);
    var g3 = PERM.fbm(nx*2, ny*2+3, nz*2, 5);
    var t = g1*0.55 + g2*0.3 + g3*0.15;
    var sp = PERM.noise(nx*3+5, ny*3, nz*3);
    var spot = (sp < -0.42 && Math.abs(lat) < 1.0) ? Math.min(1,(-sp-0.42)/0.2) : 0;
    var r,g,b;
    if(t > 0.55){r=255;g=clamp(235+t*20,0,255)|0;b=clamp(160+t*30,0,255)|0;}
    else if(t > 0.2){r=255;g=clamp(170+t*120,0,255)|0;b=clamp(30+t*100,0,255)|0;}
    else{r=clamp(195+t*60,0,255)|0;g=clamp(70+t*90,0,255)|0;b=0;}
    r=clamp(r*(1-spot*0.75),0,255)|0;
    g=clamp(g*(1-spot*0.75),0,255)|0;
    b=clamp(b*(1-spot*0.5),0,255)|0;
    return [r,g,b,255];
  });
}

function makeMercuryTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u=px/w, v=py/h;
    var lon=u*Math.PI*2, lat=(v-0.5)*Math.PI;
    var nx=Math.cos(lat)*Math.cos(lon), ny=Math.sin(lat), nz=Math.cos(lat)*Math.sin(lon);
    var base = PERM.fbm(nx*3, ny*3, nz*3, 8);
    var detail = PERM.fbm(nx*9+5, ny*9, nz*9, 6);
    var t = base*0.6 + detail*0.4;
    var warm = PERM.noise(nx*2, ny*2, nz*2)*0.5+0.5;
    var lum = clamp(100 + t*90, 60, 210)|0;
    return [clamp(lum+warm*18,0,255)|0, clamp(lum+warm*8,0,255)|0, clamp(lum-warm*10,0,255)|0, 255];
  });
}

function makeVenusTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u=px/w, v=py/h;
    var lon=u*Math.PI*2, lat=(v-0.5)*Math.PI;
    var nx=Math.cos(lat)*Math.cos(lon), ny=Math.sin(lat), nz=Math.cos(lat)*Math.sin(lon);
    var bnd = PERM.fbm(nx*1.5, ny*4+lon*0.3, nz*1.5, 8);
    var swrl = PERM.fbm(nx*3+bnd*0.5, ny*3, nz*3, 6);
    var fine = PERM.fbm(nx*7, ny*7+swrl*0.3, nz*7, 4);
    var t = bnd*0.5 + swrl*0.3 + fine*0.2;
    return [clamp(195+t*55,0,255)|0, clamp(148+t*55,0,255)|0, clamp(25+t*35,0,255)|0, 255];
  });
}

var CONTINENTS = [
  {cx:0.12,cy:0.38,rx:0.07,ry:0.20,noise:3.2},
  {cx:0.17,cy:0.62,rx:0.055,ry:0.16,noise:3.5},
  {cx:0.50,cy:0.28,rx:0.18,ry:0.13,noise:2.8},
  {cx:0.65,cy:0.25,rx:0.12,ry:0.10,noise:3.0},
  {cx:0.50,cy:0.52,rx:0.065,ry:0.14,noise:3.2},
  {cx:0.72,cy:0.62,rx:0.065,ry:0.065,noise:4.0},
  {cx:0.28,cy:0.14,rx:0.035,ry:0.065,noise:4.5},
];

function earthLand(u, v) {
  for(var k=0; k<CONTINENTS.length; k++) {
    var c = CONTINENTS[k];
    var dx = (u - c.cx)/c.rx, dy = (v - c.cy)/c.ry;
    var dist = dx*dx + dy*dy;
    if(dist < 1.0) {
      var lon2=u*Math.PI*2, lat2=(v-0.5)*Math.PI;
      var nx=Math.cos(lat2)*Math.cos(lon2), ny=Math.sin(lat2), nz=Math.cos(lat2)*Math.sin(lon2);
      var edge = PERM.fbm(nx*c.noise, ny*c.noise, nz*c.noise, 5)*0.35;
      if(dist < 0.75 + edge) return true;
    }
  }
  return false;
}

function makeEarthTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u=px/w, v=py/h;
    var lon=u*Math.PI*2, lat=(v-0.5)*Math.PI;
    var nx=Math.cos(lat)*Math.cos(lon), ny=Math.sin(lat), nz=Math.cos(lat)*Math.sin(lon);
    var n = PERM.fbm(nx*6, ny*6, nz*6, 7);
    if(v < 0.052 || v > 0.905) {
      var icen = PERM.fbm(nx*12, ny*12, nz*12, 4)*0.5+0.5;
      return [clamp(215+icen*35,0,255)|0, clamp(228+icen*22,0,255)|0, clamp(240+icen*15,0,255)|0, 255];
    }
    var isLand = earthLand(u, v);
    var r,g,b;
    if(isLand) {
      var elev = PERM.fbm(nx*8+1, ny*8, nz*8, 6)*0.5+0.5;
      var wet  = PERM.fbm(nx*4,   ny*4+5, nz*4, 4)*0.5+0.5;
      if(elev > 0.72) {
        var mv = elev*0.7+n*0.3;
        r=clamp(140+mv*80,0,255)|0; g=clamp(125+mv*65,0,255)|0; b=clamp(110+mv*70,0,255)|0;
      } else if(elev > 0.55) {
        r=clamp(110+elev*70+n*20,0,255)|0; g=clamp(82+elev*50+n*15,0,255)|0; b=clamp(48+elev*30+n*10,0,255)|0;
      } else {
        var latAbs = Math.abs(v-0.5)*2;
        if(latAbs > 0.72) {
          r=clamp(88+n*30,0,255)|0; g=clamp(95+n*25,0,255)|0; b=clamp(68+n*15,0,255)|0;
        } else if(wet > 0.58) {
          r=clamp(18+n*22,0,255)|0; g=clamp(78+n*40,0,255)|0; b=clamp(22+n*15,0,255)|0;
        } else if(wet > 0.42) {
          r=clamp(45+n*30,0,255)|0; g=clamp(105+n*38,0,255)|0; b=clamp(28+n*18,0,255)|0;
        } else {
          r=clamp(185+n*35,0,255)|0; g=clamp(148+n*28,0,255)|0; b=clamp(68+n*20,0,255)|0;
        }
      }
    } else {
      var depth = PERM.fbm(nx*3, ny*3+2, nz*3, 5)*0.5+0.5;
      var d = depth*0.65 + n*0.35;
      r=clamp(4+d*32,0,255)|0; g=clamp(28+d*68,0,255)|0; b=clamp(95+d*115,0,255)|0;
    }
    return [r,g,b,255];
  });
}

function makeCloudTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u=px/w, v=py/h;
    var lon=u*Math.PI*2, lat=(v-0.5)*Math.PI;
    var nx=Math.cos(lat)*Math.cos(lon), ny=Math.sin(lat), nz=Math.cos(lat)*Math.sin(lon);
    var c1 = PERM.fbm(nx*3+1, ny*3, nz*3, 8);
    var c2 = PERM.fbm(nx*6,   ny*6+2, nz*6, 6);
    var c3 = PERM.fbm(nx*1.5, ny*4, nz*1.5, 5);
    var cloud = c1*0.4 + c2*0.3 + c3*0.3;
    var a = clamp((cloud + 0.1)*270, 0, 255)|0;
    return [255, 255, 255, a];
  });
}

function makeMarsTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u=px/w, v=py/h;
    var lon=u*Math.PI*2, lat=(v-0.5)*Math.PI;
    var nx=Math.cos(lat)*Math.cos(lon), ny=Math.sin(lat), nz=Math.cos(lat)*Math.sin(lon);
    var base   = PERM.fbm(nx*3, ny*3, nz*3, 8);
    var detail = PERM.fbm(nx*9, ny*9+1, nz*9, 6);
    var t = base*0.6 + detail*0.4;
    var tdx=u-0.54, tdy=v-0.46;
    var tharsis = Math.max(0, 1-Math.sqrt(tdx*tdx*8+tdy*tdy*12))*0.35;
    var odx=u-0.41, ody=v-0.45;
    var olympus = Math.max(0, 1-Math.sqrt(odx*odx*60+ody*ody*60))*0.55;
    var vmLon=u-0.46, vmLat=Math.abs(v-0.48);
    var vm=(vmLon>0&&vmLon<0.22&&vmLat<0.022)?Math.max(0,(0.022-vmLat)/0.022)*Math.max(0,0.5-Math.abs(vmLon-0.11)/0.11)*0.4:0;
    var elev = t + tharsis + olympus - vm;
    if(v < 0.055 || v > 0.925) {
      var pc2 = PERM.fbm(nx*15,ny*15,nz*15,4)*0.5+0.5;
      return [clamp(215+pc2*30,0,255)|0, clamp(185+pc2*28,0,255)|0, clamp(170+pc2*25,0,255)|0, 255];
    }
    var r=clamp(155+elev*75+t*22,0,255)|0;
    var g=clamp(52+elev*32+t*18,0,255)|0;
    var b=clamp(22+elev*14+t*8,0,255)|0;
    var dust=PERM.fbm(nx*2+7,ny*2,nz*2,4)*0.5+0.5;
    if(dust>0.64){r=clamp(r+18,0,255)|0;g=clamp(g+10,0,255)|0;}
    return [r,g,b,255];
  });
}

var JUP_BANDS = [
  {y:0.00,h:0.07,c:[158,112,52]},{y:0.07,h:0.06,c:[225,198,130]},
  {y:0.13,h:0.07,c:[132,78,28]}, {y:0.20,h:0.06,c:[205,168,82]},
  {y:0.26,h:0.06,c:[95,50,18]},  {y:0.32,h:0.06,c:[195,155,72]},
  {y:0.38,h:0.09,c:[122,68,25]}, {y:0.47,h:0.06,c:[210,172,92]},
  {y:0.53,h:0.06,c:[148,88,35]}, {y:0.59,h:0.07,c:[198,160,75]},
  {y:0.66,h:0.08,c:[115,65,22]}, {y:0.74,h:0.06,c:[185,145,65]},
  {y:0.80,h:0.20,c:[162,115,48]}
];

function makeJupiterTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u=px/w, v=py/h;
    var turb = PERM.fbm(u*6, v*6, 0, 8)*0.042;
    var vt = v + turb;
    var bc = JUP_BANDS[JUP_BANDS.length-1].c;
    for(var k=0; k<JUP_BANDS.length; k++) {
      var B=JUP_BANDS[k];
      if(vt>=B.y && vt<B.y+B.h){bc=B.c;break;}
    }
    var bn  = PERM.fbm(u*12+2, vt*8, 0, 6);
    var wv  = PERM.fbm(u*5, vt*25, 0, 4)*0.5;
    var t   = bn*0.6 + wv*0.4;
    var gdu=u-0.38, gdv=v-0.622;
    var grs = Math.max(0, 1-Math.sqrt(gdu*gdu*18+gdv*gdv*75));
    var r=clamp(bc[0]+t*28,0,255)|0, g=clamp(bc[1]+t*18,0,255)|0, bb=clamp(bc[2]+t*10,0,255)|0;
    if(grs>0.12) {
      var gi=Math.min(1,(grs-0.12)/0.88);
      r=clamp(mix(r,188,gi*0.88),0,255)|0;
      g=clamp(mix(g,55,gi*0.88),0,255)|0;
      bb=clamp(mix(bb,22,gi*0.88),0,255)|0;
      var core=Math.max(0,(grs-0.58)/0.42);
      r=clamp(r+(255-r)*core*0.35,0,255)|0;
      g=clamp(g+(255-g)*core*0.35,0,255)|0;
      bb=clamp(bb+(255-bb)*core*0.25,0,255)|0;
    }
    return [r,g,bb,255];
  });
}

function makeSaturnTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u=px/w, v=py/h;
    var turb = PERM.fbm(u*5, v*5, 0, 7)*0.028;
    var vt = v + turb;
    var bnd = Math.sin(vt*Math.PI*20)*0.10 + Math.sin(vt*Math.PI*8)*0.05;
    var n = PERM.fbm(u*8, vt*8, 0, 6)*0.5+0.5;
    var t = n*0.72 + bnd*0.28;
    if(vt<0.09) {
      var pn=PERM.fbm(u*20,vt*20,0,4)*0.5+0.5;
      var hex=Math.abs(Math.sin(u*Math.PI*6))*0.06;
      return [clamp(188+pn*22+hex*18,0,255)|0, clamp(162+pn*16+hex*12,0,255)|0, clamp(92+pn*10+hex*6,0,255)|0, 255];
    }
    return [clamp(188+t*58,0,255)|0, clamp(163+t*47,0,255)|0, clamp(95+t*38,0,255)|0, 255];
  });
}

function makeSaturnRingTex(sz) {
  var data = new Uint8Array(sz * 4);
  var RBANDS = [
    {s:0.00, e:0.08, op:0.0,  r:0,   g:0,   b:0},
    {s:0.08, e:0.20, op:0.72, r:210, g:195, b:152},
    {s:0.20, e:0.25, op:0.28, r:192, g:178, b:138},
    {s:0.25, e:0.43, op:0.92, r:202, g:187, b:145},
    {s:0.43, e:0.47, op:0.15, r:178, g:163, b:122},
    {s:0.47, e:0.77, op:0.62, r:188, g:172, b:132},
    {s:0.77, e:1.00, op:0.10, r:162, g:150, b:118},
  ];
  for(var i=0; i<sz; i++) {
    var t = i/sz;
    var band = null;
    for(var k=0; k<RBANDS.length; k++){if(t>=RBANDS[k].s&&t<RBANDS[k].e){band=RBANDS[k];break;}}
    if(!band||band.op===0){data[i*4]=0;data[i*4+1]=0;data[i*4+2]=0;data[i*4+3]=0;continue;}
    var noise = PERM.fbm(i/80, 0, 0, 4)*0.5+0.5;
    var op = clamp(band.op*(0.65+noise*0.7), 0, 1);
    data[i*4]   = band.r;
    data[i*4+1] = band.g;
    data[i*4+2] = band.b;
    data[i*4+3] = (op*255)|0;
  }
  var tex = new THREE.DataTexture(data, sz, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.needsUpdate = true;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function makeUranusTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u=px/w, v=py/h;
    var bnd = Math.sin(v*Math.PI*14)*0.045;
    var n   = PERM.fbm(u*4, v*4, 0, 6)*0.5+0.5;
    var lat = Math.abs(v-0.5)*2;
    var t   = n*0.72 + bnd*0.18 + (1-lat)*0.10;
    return [clamp(32+t*62,0,255)|0, clamp(165+t*52,0,255)|0, clamp(185+t*55,0,255)|0, 255];
  });
}

function makeNeptuneTex(sz) {
  return makeDataTex(sz, sz, function(px, py, w, h) {
    var u=px/w, v=py/h;
    var turb = PERM.fbm(u*5, v*5+1, 0, 7)*0.038;
    var vt   = v + turb;
    var bnd  = Math.sin(vt*Math.PI*11)*0.065;
    var n    = PERM.fbm(u*6+3, vt*6, 0, 7)*0.5+0.5;
    var t    = n*0.65 + bnd*0.35;
    var gdu=u-0.42, gdv=v-0.38;
    var gds = Math.max(0, 1-Math.sqrt(gdu*gdu*22+gdv*gdv*44));
    var r=clamp(12+t*42,0,255)|0, g=clamp(32+t*62,0,255)|0, b=clamp(138+t*95,0,255)|0;
    if(gds>0.15){var gi=(gds-0.15)/0.85;r=clamp(mix(r,7,gi*0.8),0,255)|0;g=clamp(mix(g,18,gi*0.8),0,255)|0;b=clamp(mix(b,88,gi*0.65),0,255)|0;}
    var scu=u-0.68, scv=v-0.42;
    var sc=Math.max(0,1-Math.sqrt(scu*scu*85+scv*scv*210));
    if(sc>0.3){var si=(sc-0.3)/0.7;r=clamp(r+(255-r)*si*0.6,0,255)|0;g=clamp(g+(255-g)*si*0.6,0,255)|0;b=clamp(b+(220-b)*si*0.4,0,255)|0;}
    return [r,g,b,255];
  });
}

// ============================================================
// TEXTURES
// ============================================================
var TEXSZ = 512;
var TEXSZ_HQ = 1536;

function progress(pct, msg) {
  document.getElementById('lbar').style.width = pct + '%';
  document.getElementById('ltxt').textContent = msg;
}

var TEXTURES = {};
function buildAllTextures() {
  progress(5, 'Soare...');
  TEXTURES.sun_lo  = makeSunTex(TEXSZ);
  progress(15, 'Mercur...');
  TEXTURES.mercury_lo = makeMercuryTex(TEXSZ);
  progress(22, 'Venus...');
  TEXTURES.venus_lo = makeVenusTex(TEXSZ);
  progress(30, 'Pamant (continente)...');
  TEXTURES.earth_lo = makeEarthTex(TEXSZ);
  progress(45, 'Nori...');
  TEXTURES.clouds_lo = makeCloudTex(Math.floor(TEXSZ*0.75));
  progress(52, 'Marte...');
  TEXTURES.mars_lo = makeMarsTex(TEXSZ);
  progress(60, 'Jupiter...');
  TEXTURES.jupiter_lo = makeJupiterTex(TEXSZ);
  progress(68, 'Saturn...');
  TEXTURES.saturn_lo = makeSaturnTex(TEXSZ);
  TEXTURES.saturnring = makeSaturnRingTex(1024);
  progress(76, 'Uranus...');
  TEXTURES.uranus_lo = makeUranusTex(TEXSZ);
  progress(83, 'Neptun...');
  TEXTURES.neptune_lo = makeNeptuneTex(TEXSZ);
  progress(90, 'Initializare scena...');
}

// ============================================================
// GLSL SHADERS
// ============================================================
var ATM_VERT = [
  'varying vec3 vNormal;',
  'varying vec3 vViewDir;',
  'void main(){',
  '  vNormal=normalize(normalMatrix*normal);',
  '  vec4 mv=modelViewMatrix*vec4(position,1.0);',
  '  vViewDir=normalize(-mv.xyz);',
  '  gl_Position=projectionMatrix*mv;',
  '}'
].join('\n');

var ATM_FRAG = [
  'uniform vec3 atmColor;',
  'uniform float intensity;',
  'varying vec3 vNormal;',
  'varying vec3 vViewDir;',
  'void main(){',
  '  float rim=1.0-max(0.0,dot(vNormal,vViewDir));',
  '  float power=pow(rim,3.2)*intensity;',
  '  gl_FragColor=vec4(atmColor,power);',
  '}'
].join('\n');

var CORONA_VERT = [
  'varying vec3 vN;',
  'varying vec3 vV;',
  'void main(){',
  '  vN=normalize(normalMatrix*normal);',
  '  vec4 mv=modelViewMatrix*vec4(position,1.0);',
  '  vV=normalize(-mv.xyz);',
  '  gl_Position=projectionMatrix*mv;',
  '}'
].join('\n');

var CORONA_FRAG = [
  'uniform float rr;',
  'varying vec3 vN;',
  'varying vec3 vV;',
  'void main(){',
  '  float rim=1.0-max(0.0,dot(vN,vV));',
  '  float p=pow(rim,2.5);',
  '  vec3 colA=vec3(1.0,0.88,0.22);',
  '  vec3 colB=vec3(1.0,0.42,0.0);',
  '  gl_FragColor=vec4(mix(colA,colB,p),p*rr);',
  '}'
].join('\n');

function makeAtmMesh(R, hexColor, intensity) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.055, 48, 48),
    new THREE.ShaderMaterial({
      uniforms: {
        atmColor:  {value: new THREE.Color(hexColor)},
        intensity: {value: intensity || 1.2}
      },
      vertexShader:   ATM_VERT,
      fragmentShader: ATM_FRAG,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
}

// ============================================================
// SCENE
// ============================================================
function logSz(km) { return Math.log10(km) * 1.95; }
function logDist(au) { return au === 0 ? 0 : Math.log10(au + 1) * 292 + 30; }

var mainRenderer, mainScene, mainCam;
var BODIES = {}, ANGS = {}, LBLS = [];

function buildMainScene() {
  var canvas = document.getElementById('c');
  mainRenderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
  mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mainRenderer.setSize(window.innerWidth, window.innerHeight);
  mainRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  mainRenderer.toneMappingExposure = 1.05;

  mainScene = new THREE.Scene();
  mainCam = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 9000);

  mainScene.add(new THREE.AmbientLight(0x07101e, 1.8));
  var sunPt = new THREE.PointLight(0xfff8e8, 10, 0, 1.2);
  mainScene.add(sunPt);
  mainScene.add(new THREE.HemisphereLight(0x0a1830, 0x000000, 0.5));

  buildStars(mainScene, 18000, 2000, 1800);

  function makeOrbitLine(r) {
    var n = 512, pts = [];
    for(var i = 0; i <= n; i++) {
      var a = i / n * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a)*r, 0, Math.sin(a)*r));
    }
    var g = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(g, new THREE.LineBasicMaterial({color:0x00ffff,transparent:true,opacity:0.92}));
  }

  var txMap = {
    Sun:'sun_lo', Mercury:'mercury_lo', Venus:'venus_lo', Earth:'earth_lo',
    Mars:'mars_lo', Jupiter:'jupiter_lo', Saturn:'saturn_lo', Uranus:'uranus_lo', Neptune:'neptune_lo'
  };
  var atmColors = {Earth:0x3daaff, Venus:0xff9922, Mars:0xff5522, Neptune:0x3355ff, Uranus:0x33cccc, Jupiter:0xc87030, Saturn:0xd4a055};

  for(var nm in PD) {
    var data = PD[nm];
    var Rp = logSz(data.diamKm);
    var orb = logDist(data.distAU);
    var geom = new THREE.SphereGeometry(Rp, 96, 48);
    var mat, mesh;

    if(nm === 'Sun') {
      mat = new THREE.MeshBasicMaterial({map: TEXTURES[txMap[nm]]});
      mesh = new THREE.Mesh(geom, mat);
      mainScene.add(mesh);
      var coronaRs = [0.18, 0.08, 0.04, 0.02];
      for(var k = 0; k < 4; k++) {
        var cm = new THREE.ShaderMaterial({
          uniforms: {rr: {value: coronaRs[k]}},
          vertexShader: CORONA_VERT, fragmentShader: CORONA_FRAG,
          transparent:true, side:THREE.FrontSide, depthWrite:false, blending:THREE.AdditiveBlending
        });
        mainScene.add(new THREE.Mesh(new THREE.SphereGeometry(Rp*(1.12+k*0.22), 32, 32), cm));
      }
    } else {
      mat = new THREE.MeshStandardMaterial({
        map: TEXTURES[txMap[nm]],
        roughness: nm==='Earth' ? 0.72 : nm==='Mars' ? 0.82 : 0.80,
        metalness: 0
      });
      mesh = new THREE.Mesh(geom, mat);
      var a0 = Math.random() * Math.PI * 2;
      ANGS[nm] = a0;
      mesh.position.set(Math.cos(a0)*orb, 0, Math.sin(a0)*orb);
      mainScene.add(mesh);
      mainScene.add(makeOrbitLine(orb));

      if(atmColors[nm]) mesh.add(makeAtmMesh(Rp, atmColors[nm], nm==='Venus'?1.8:nm==='Earth'?1.55:1.05));

      if(nm === 'Earth') {
        var cg = new THREE.SphereGeometry(Rp*1.013, 72, 36);
        var cloudMat = new THREE.MeshStandardMaterial({
          map: TEXTURES.clouds_lo, alphaMap: TEXTURES.clouds_lo,
          transparent: true, opacity: 0.85, roughness: 0.95, metalness: 0, depthWrite: false
        });
        var cloudMesh = new THREE.Mesh(cg, cloudMat);
        mesh.add(cloudMesh);
        mesh.userData.clouds = cloudMesh;
      }

      if(nm === 'Saturn') {
        var ringSizes = [[Rp*1.18, Rp*2.62, 1.0], [Rp*2.68, Rp*3.12, 0.5]];
        for(var ri = 0; ri < ringSizes.length; ri++) {
          var rs = ringSizes[ri];
          var rg = new THREE.RingGeometry(rs[0], rs[1], 200, 3);
          var rpos = rg.attributes.position;
          var ruv  = rg.attributes.uv;
          var rv3  = new THREE.Vector3();
          for(var vi = 0; vi < rpos.count; vi++) {
            rv3.fromBufferAttribute(rpos, vi);
            var t01 = (rv3.length() - rs[0]) / (rs[1] - rs[0]);
            ruv.setXY(vi, clamp(t01, 0, 1), 0.5);
          }
          ruv.needsUpdate = true;
          var ringMat = new THREE.MeshBasicMaterial({
            map: TEXTURES.saturnring, side: THREE.DoubleSide,
            transparent: true, opacity: rs[2], depthWrite: false
          });
          var ring = new THREE.Mesh(rg, ringMat);
          ring.rotation.x = Math.PI * 0.455;
          mesh.add(ring);
        }
      }

      if(nm === 'Uranus') {
        var urg = new THREE.RingGeometry(Rp*1.52, Rp*1.82, 128);
        var urm = new THREE.MeshBasicMaterial({color:0x88eedd, side:THREE.DoubleSide, transparent:true, opacity:0.22, depthWrite:false});
        var ur = new THREE.Mesh(urg, urm);
        ur.rotation.z = Math.PI * 0.484;
        mesh.add(ur);
      }
    }

    BODIES[nm] = {mesh:mesh, data:data, orb:orb, Rp:Rp};

    var lbl = document.createElement('div');
    lbl.className = 'lbl';
    lbl.textContent = data.label;
    document.body.appendChild(lbl);
    LBLS.push({el:lbl, nm:nm});
  }
}

function buildStars(scene, count, minR, spread) {
  var pos = new Float32Array(count * 3);
  var col = new Float32Array(count * 3);
  var starCols = [[1,0.92,0.82],[0.82,0.9,1],[1,1,1],[1,0.82,0.62],[0.65,0.72,1]];
  for(var i = 0; i < count; i++) {
    var r = minR + Math.random()*spread, t = Math.random()*Math.PI*2, p = Math.acos(2*Math.random()-1);
    pos[i*3]=r*Math.sin(p)*Math.cos(t); pos[i*3+1]=r*Math.sin(p)*Math.sin(t); pos[i*3+2]=r*Math.cos(p);
    var c = starCols[Math.floor(Math.random()*starCols.length)], b = 0.3+Math.random()*0.7;
    col[i*3]=c[0]*b; col[i*3+1]=c[1]*b; col[i*3+2]=c[2]*b;
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({vertexColors:true, size:1.1, sizeAttenuation:true, transparent:true, opacity:0.88})));
}

// ============================================================
// CAMERA CONTROLS
// ============================================================
var sph  = {t:0.3, p:1.12, r:295};
var tSph = {t:0.3, p:1.12, r:295};
var pan  = new THREE.Vector3();
var tPan = new THREE.Vector3();
var drag = false, rDrag = false;
var mDown = {x:0,y:0}, mClick = {x:0,y:0};

var canvas = document.getElementById('c');
canvas.addEventListener('mousedown', function(e){
  drag=true; rDrag=(e.button===2);
  mDown={x:e.clientX,y:e.clientY}; mClick={x:e.clientX,y:e.clientY};
});
canvas.addEventListener('contextmenu', function(e){e.preventDefault();});
window.addEventListener('mouseup',   function(){drag=false;});
window.addEventListener('mousemove', function(e){
  if(!drag) return;
  var dx=e.clientX-mDown.x, dy=e.clientY-mDown.y;
  mDown={x:e.clientX,y:e.clientY};
  if(rDrag) {
    var sp=tSph.r*0.001;
    var R=new THREE.Vector3(), U=new THREE.Vector3();
    R.setFromMatrixColumn(mainCam.matrix,0);
    U.setFromMatrixColumn(mainCam.matrix,1);
    tPan.addScaledVector(R,-dx*sp);
    tPan.addScaledVector(U, dy*sp);
  } else {
    tSph.t -= dx*0.005;
    tSph.p  = Math.max(0.04, Math.min(Math.PI*0.9, tSph.p - dy*0.005));
  }
});
canvas.addEventListener('wheel', function(e){
  tSph.r = Math.max(10, Math.min(2000, tSph.r*(1+e.deltaY*0.001)));
});

var touchDist = null;
canvas.addEventListener('touchstart', function(e){
  if(e.touches.length===1){drag=true;rDrag=false;mDown={x:e.touches[0].clientX,y:e.touches[0].clientY};mClick={...mDown};}
  if(e.touches.length===2) touchDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
},{passive:true});
canvas.addEventListener('touchend',   function(){drag=false;touchDist=null;},{passive:true});
canvas.addEventListener('touchmove',  function(e){
  if(e.touches.length===1&&drag){var dx=e.touches[0].clientX-mDown.x,dy=e.touches[0].clientY-mDown.y;mDown={x:e.touches[0].clientX,y:e.touches[0].clientY};tSph.t-=dx*0.005;tSph.p=Math.max(0.04,Math.min(Math.PI*0.9,tSph.p-dy*0.005));}
  if(e.touches.length===2&&touchDist!==null){var d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);tSph.r=Math.max(10,Math.min(2000,tSph.r*(touchDist/d)));touchDist=d;}
},{passive:true});

// ============================================================
// MODAL
// ============================================================
var raycaster = new THREE.Raycaster();
var mVec = new THREE.Vector2();

canvas.addEventListener('click', function(e){
  if(Math.hypot(e.clientX-mClick.x, e.clientY-mClick.y) > 6) return;
  mVec.x=(e.clientX/window.innerWidth)*2-1;
  mVec.y=-(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(mVec, mainCam);
  var meshes = [];
  for(var n in BODIES) meshes.push(BODIES[n].mesh);
  var hits = raycaster.intersectObjects(meshes);
  if(hits.length) {
    for(var n in BODIES){if(BODIES[n].mesh===hits[0].object){openModal(n);break;}}
  }
});
document.querySelectorAll('.sb').forEach(function(btn){
  btn.addEventListener('click', function(){openModal(btn.dataset.n);});
});

// ============================================================
// PLANET VIEWER
// ============================================================
var pRenderer=null, pScene=null, pCam=null, pMesh=null, pClouds=null;
var pRAF=null, pDrag=false, pPrev={x:0,y:0};
var pRot={x:0.18,y:0}, pRotV={x:0,y:0.004};

function openModal(nm) {
  var data = PD[nm];
  document.getElementById('mpn').textContent = data.label;
  document.getElementById('mpt').textContent = data.type;

  var sg = document.getElementById('sg');
  var stats = [
    ['Diametru', data.diamKm.toLocaleString('ro-RO')+' km'],
    ['Dist. Soare', data.distAU===0?'-':data.distAU+' UA'],
    ['Orbita', data.periodDays===0?'-':data.periodDays.toLocaleString('ro-RO')+' zile'],
    ['Luni', data.moons],
    ['Gravitatie', data.gravity],
    ['Temperatura', data.temp]
  ];
  sg.innerHTML = stats.map(function(s){
    return '<div class="sc"><div class="sk">'+s[0]+'</div><div class="sv">'+s[1]+'</div></div>';
  }).join('');

  var ab = document.getElementById('atmbars');
  ab.innerHTML = data.atm.map(function(g){
    return '<div class="ar"><div class="ah"><span class="an">'+g.n+'</span><span class="ap">'+g.p+'%</span></div>'
      +'<div class="ab"><div class="af" style="width:0%;background:'+g.c+'" data-w="'+g.p+'"></div></div></div>';
  }).join('');

  document.getElementById('modal').classList.add('show');
  initPlanetViewer(nm);
  setPlanetTheme(nm);

  requestAnimationFrame(function(){requestAnimationFrame(function(){
    document.querySelectorAll('.af').forEach(function(el){el.style.width=el.dataset.w+'%';});
  });});
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
  if(pRAF){cancelAnimationFrame(pRAF);pRAF=null;}
  if(pRenderer){pRenderer.dispose();pRenderer=null;}
  pScene=null; pMesh=null; pClouds=null;
}

document.getElementById('mcls').addEventListener('click', closeModal);
document.getElementById('mbk').addEventListener('click', closeModal);

function initPlanetViewer(nm) {
  if(pRAF){cancelAnimationFrame(pRAF);pRAF=null;}
  if(pRenderer){pRenderer.dispose();}

  var pcEl = document.getElementById('pc');
  pScene = new THREE.Scene();
  pCam = new THREE.PerspectiveCamera(46, pcEl.clientWidth/pcEl.clientHeight, 0.01, 1000);

  pRenderer = new THREE.WebGLRenderer({canvas:pcEl, antialias:true, alpha:true});
  pRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  pRenderer.setSize(pcEl.clientWidth, pcEl.clientHeight);
  pRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  pRenderer.toneMappingExposure = 1.12;

  var Rp = 3.8;
  pCam.position.set(0, 0, Rp*2.6);
  pRot = {x:0.15, y:0};
  pRotV = {x:0, y:0.004};

  if(nm === 'Sun') {
    pScene.add(new THREE.AmbientLight(0xffffff, 1.0));
  } else {
    pScene.add(new THREE.AmbientLight(0x0a1428, 1.2));
    var dl = new THREE.DirectionalLight(0xfff6e0, 4.0);
    dl.position.set(6, 2, 4);
    pScene.add(dl);
    var fl = new THREE.DirectionalLight(0x1030a0, 0.5);
    fl.position.set(-5, -2, -3);
    pScene.add(fl);
  }

  var txHQ = {
    Sun:'sun_hq', Mercury:'mercury_hq', Venus:'venus_hq', Earth:'earth_hq',
    Mars:'mars_hq', Jupiter:'jupiter_hq', Saturn:'saturn_hq', Uranus:'uranus_hq', Neptune:'neptune_hq'
  };
  if(!TEXTURES[txHQ[nm]]) {
    var builders = {
      Sun:makeSunTex, Mercury:makeMercuryTex, Venus:makeVenusTex, Earth:makeEarthTex,
      Mars:makeMarsTex, Jupiter:makeJupiterTex, Saturn:makeSaturnTex, Uranus:makeUranusTex, Neptune:makeNeptuneTex
    };
    TEXTURES[txHQ[nm]] = builders[nm](TEXSZ_HQ);
    if(nm === 'Earth' && !TEXTURES.clouds_hq) TEXTURES.clouds_hq = makeCloudTex(TEXSZ_HQ);
  }

  var geom = new THREE.SphereGeometry(Rp, 192, 128);
  var mat;
  if(nm === 'Sun') {
    mat = new THREE.MeshBasicMaterial({map: TEXTURES[txHQ[nm]]});
  } else {
    mat = new THREE.MeshStandardMaterial({
      map: TEXTURES[txHQ[nm]],
      roughness: nm==='Earth'?0.70:nm==='Mars'?0.80:0.78,
      metalness: 0
    });
  }
  pMesh = new THREE.Mesh(geom, mat);
  pScene.add(pMesh);

  var atmC2 = {Earth:0x3daaff, Venus:0xff9922, Mars:0xff5522, Neptune:0x3355ff, Uranus:0x33cccc, Jupiter:0xc87030, Saturn:0xd4a055};
  if(atmC2[nm]) pScene.add(makeAtmMesh(Rp, atmC2[nm], nm==='Venus'?1.9:nm==='Earth'?1.6:1.1));

  if(nm === 'Sun') {
    var cRs2 = [0.20,0.09,0.04];
    for(var k = 0; k < 3; k++) {
      var cm2 = new THREE.ShaderMaterial({
        uniforms:{rr:{value:cRs2[k]}},
        vertexShader:CORONA_VERT, fragmentShader:CORONA_FRAG,
        transparent:true,side:THREE.FrontSide,depthWrite:false,blending:THREE.AdditiveBlending
      });
      pScene.add(new THREE.Mesh(new THREE.SphereGeometry(Rp*(1.14+k*0.26),32,32), cm2));
    }
  }

  if(nm === 'Earth') {
    var cg2 = new THREE.SphereGeometry(Rp*1.013, 144, 72);
    var ct = TEXTURES.clouds_hq || TEXTURES.clouds_lo;
    var cm3 = new THREE.MeshStandardMaterial({map:ct, alphaMap:ct, transparent:true, opacity:0.88, roughness:0.95, metalness:0, depthWrite:false});
    pClouds = new THREE.Mesh(cg2, cm3);
    pMesh.add(pClouds);
  }

  if(nm === 'Saturn') {
    var pRingSizes = [[Rp*1.18,Rp*2.62,1.0],[Rp*2.68,Rp*3.12,0.5]];
    for(var ri2=0; ri2<pRingSizes.length; ri2++) {
      var prs=pRingSizes[ri2];
      var prg=new THREE.RingGeometry(prs[0],prs[1],200,3);
      var prpos=prg.attributes.position, pruv=prg.attributes.uv, prv3=new THREE.Vector3();
      for(var vi2=0;vi2<prpos.count;vi2++){prv3.fromBufferAttribute(prpos,vi2);pruv.setXY(vi2,clamp((prv3.length()-prs[0])/(prs[1]-prs[0]),0,1),0.5);}
      pruv.needsUpdate=true;
      var prm=new THREE.MeshBasicMaterial({map:TEXTURES.saturnring,side:THREE.DoubleSide,transparent:true,opacity:prs[2],depthWrite:false});
      var pr=new THREE.Mesh(prg,prm); pr.rotation.x=Math.PI*0.455; pScene.add(pr);
    }
  }
  if(nm === 'Uranus') {
    var purg=new THREE.RingGeometry(Rp*1.52,Rp*1.82,128);
    var purm=new THREE.MeshBasicMaterial({color:0x88eedd,side:THREE.DoubleSide,transparent:true,opacity:0.24,depthWrite:false});
    var pur=new THREE.Mesh(purg,purm); pur.rotation.z=Math.PI*0.484; pScene.add(pur);
  }

  buildStars(pScene, 2000, 80, 220);

  var pc2 = document.getElementById('pc');
  pc2.onmousedown  = function(e){pDrag=true;pPrev={x:e.clientX,y:e.clientY};pRotV={x:0,y:0};};
  pc2.onmouseup    = function(){pDrag=false;};
  pc2.onmousemove  = function(e){if(!pDrag)return;pRotV.y=(e.clientX-pPrev.x)*0.009;pRotV.x=(e.clientY-pPrev.y)*0.009;pRot.y+=pRotV.y;pRot.x+=pRotV.x;pPrev={x:e.clientX,y:e.clientY};};
  pc2.ontouchstart = function(e){pDrag=true;pPrev={x:e.touches[0].clientX,y:e.touches[0].clientY};pRotV={x:0,y:0};};
  pc2.ontouchend   = function(){pDrag=false;};
  pc2.ontouchmove  = function(e){if(!pDrag)return;pRotV.y=(e.touches[0].clientX-pPrev.x)*0.009;pRotV.x=(e.touches[0].clientY-pPrev.y)*0.009;pRot.y+=pRotV.y;pRot.x+=pRotV.x;pPrev={x:e.touches[0].clientX,y:e.touches[0].clientY};};

  var pClk = new THREE.Clock();
  function pLoop() {
    pRAF = requestAnimationFrame(pLoop);
    var dt = pClk.getDelta();
    if(!pDrag){pRotV.x*=0.90;pRotV.y*=0.90;if(Math.abs(pRotV.y)<0.0005)pRotV.y=0.004;}
    pRot.y += pRotV.y;
    pRot.x = clamp(pRot.x + pRotV.x, -1.4, 1.4);
    pMesh.rotation.set(pRot.x, pRot.y, 0);
    if(pClouds) pClouds.rotation.y += dt * 0.008;
    if(nm==='Sun') pMesh.rotation.y += dt * 0.02;
    if(pRenderer && pScene && pCam) pRenderer.render(pScene, pCam);
  }
  pLoop();
}

new ResizeObserver(function(){
  if(!pRenderer||!pCam) return;
  var el = document.getElementById('pc');
  pRenderer.setSize(el.clientWidth, el.clientHeight);
  pCam.aspect = el.clientWidth / el.clientHeight;
  pCam.updateProjectionMatrix();
}).observe(document.getElementById('mcw'));

// ============================================================
// SPEED / PAUSE
// ============================================================
var simSpd = 0.22, paused = false;
document.getElementById('spd').addEventListener('input', function(e){simSpd=e.target.value/100*2;});
document.getElementById('pbtn').addEventListener('click', function(){
  paused = !paused;
  document.getElementById('pbtn').textContent = paused ? '&#9654; Reia' : '&#9646;&#9646; Pauza';
});

// ============================================================
// PURE DATA PATCH — loaded from solar_system.pd file
// ============================================================
var PD_PATCH_SOURCE = null; // Will be loaded via fetch()

var PD_GRAPH = [
  {id:'loadbang', label:'loadbang', x:30,  y:20},
  {id:'metro',    label:'metro 7000', x:30, y:45, type:'ctrl'},
  {id:'random',   label:'random 8', x:30, y:70, type:'ctrl'},
  {id:'mtof0',    label:'mtof', x:30, y:120},
  {id:'osc0',     label:'osc~', x:30, y:160},
  {id:'osc1',     label:'osc~', x:100, y:160},
  {id:'osc2',     label:'osc~', x:170, y:160},
  {id:'osc3',     label:'osc~', x:240, y:160},
  {id:'oscsub',   label:'osc~ sub', x:310, y:160},
  {id:'mul0',     label:'*~ .28', x:30, y:190},
  {id:'mul1',     label:'*~ .20', x:100, y:190},
  {id:'mul2',     label:'*~ .14', x:170, y:190},
  {id:'mul3',     label:'*~ .09', x:240, y:190},
  {id:'add0',     label:'+~', x:120, y:220},
  {id:'noise',    label:'noise~', x:390, y:160},
  {id:'lop0',     label:'lop~ 80', x:390, y:190},
  {id:'osc_lfo',  label:'osc~ .09', x:460, y:160},
  {id:'lop1',     label:'lop~ 30', x:460, y:190},
  {id:'lop2',     label:'lop~ 1200', x:120, y:250, type:'ctrl'},
  {id:'mul_sub',  label:'*~', x:120, y:280},
  {id:'add1',     label:'+~', x:120, y:310},
  {id:'rev2',     label:'rev2~ .88 3', x:30, y:345, type:'ctrl'},
  {id:'delw',     label:'delwrite~ 500', x:200, y:345, type:'ctrl'},
  {id:'delr',     label:'delread~', x:200, y:375, type:'ctrl'},
  {id:'mul_del',  label:'*~ .38', x:200, y:405},
  {id:'add2',     label:'+~', x:90, y:405},
  {id:'mul_out',  label:'*~ 0.7', x:90, y:435},
  {id:'dac',      label:'dac~', x:90, y:465, type:'ctrl'},
];

var pdEngine = null;
var pdAudioCtx = null;
var pdIsRunning = false;
var pdVolGain = null;

// ── PLANET AUDIO THEMES ─────────────────────────────────────
// Each planet gets its own musical signature:
//   root     = MIDI root note for chord
//   modes    = array of interval sets (rotated each chord change)
//   revGain  = reverb wet amount (0–1)
//   delTime  = delay time in seconds
//   lopFreq  = low-pass filter base frequency (Hz)
//   lfoFreq  = LFO rate modulating the filter (Hz)
//   lfoAmt   = LFO depth applied to filter frequency
//   detune   = oscillator detune spread (cents)
//   tempo    = ms between chord changes
//   oscTypes = oscillator waveform rotation
var PLANET_AUDIO = {
  Sun:     {root:36,  modes:[[0,4,7,11,14],[0,4,7,12,16]],       revGain:0.35, delTime:0.22, lopFreq:2200, lfoFreq:0.25, lfoAmt:350, detune:5,  tempo:8000,  oscTypes:['sine','sine','triangle','sine']},
  Mercury: {root:60,  modes:[[0,7,12],[0,5,12],[0,7,14]],         revGain:0.10, delTime:0.16, lopFreq:3800, lfoFreq:0.9,  lfoAmt:900, detune:18, tempo:3200,  oscTypes:['triangle','sine','triangle','sine']},
  Venus:   {root:41,  modes:[[0,3,7,10,13],[0,4,7,10]],           revGain:0.88, delTime:0.55, lopFreq:700,  lfoFreq:0.04, lfoAmt:100, detune:28, tempo:13000, oscTypes:['sawtooth','sawtooth','triangle','sawtooth']},
  Earth:   {root:48,  modes:[[0,4,7,11],[0,2,4,7,11]],            revGain:0.50, delTime:0.38, lopFreq:1200, lfoFreq:0.09, lfoAmt:180, detune:8,  tempo:7000,  oscTypes:['sine','triangle','sine','triangle']},
  Mars:    {root:45,  modes:[[0,3,6,9],[0,1,5,8],[0,3,7,10]],     revGain:0.18, delTime:0.26, lopFreq:550,  lfoFreq:0.18, lfoAmt:70,  detune:22, tempo:4800,  oscTypes:['sawtooth','square','sawtooth','square']},
  Jupiter: {root:28,  modes:[[0,7,12,17,19],[0,5,10,17]],         revGain:0.72, delTime:0.65, lopFreq:380,  lfoFreq:0.03, lfoAmt:50,  detune:3,  tempo:9500,  oscTypes:['sine','sine','triangle','sine']},
  Saturn:  {root:32,  modes:[[0,7,14,19],[0,7,12,19]],            revGain:0.92, delTime:0.76, lopFreq:450,  lfoFreq:0.018,lfoAmt:35,  detune:14, tempo:14000, oscTypes:['triangle','sine','triangle','triangle']},
  Uranus:  {root:56,  modes:[[0,4,8,12],[0,3,8,13],[0,5,10,15]],  revGain:0.60, delTime:0.20, lopFreq:2600, lfoFreq:0.42, lfoAmt:650, detune:20, tempo:10500, oscTypes:['triangle','triangle','sine','triangle']},
  Neptune: {root:30,  modes:[[0,5,8,12],[0,3,7,10]],              revGain:0.95, delTime:0.90, lopFreq:320,  lfoFreq:0.012,lfoAmt:28,  detune:6,  tempo:19000, oscTypes:['sine','sine','sine','triangle']},
};

// PD graph nodes to highlight per planet (maps to visual patch objects)
var PLANET_PD_NODES = {
  Sun:     ['osc0','mul0','add0','mtof0'],
  Mercury: ['osc1','mul1','lop1'],
  Venus:   ['osc2','lop2','rev2','mul_sub'],
  Earth:   ['osc0','osc1','lop2','add1'],
  Mars:    ['osc2','osc3','mul2','mul3'],
  Jupiter: ['oscsub','mul3','add2','mul_out'],
  Saturn:  ['delw','delr','mul_del','add2'],
  Uranus:  ['osc_lfo','lop1','mul_sub'],
  Neptune: ['noise','lop0','rev2','mul_del'],
};

// Module-level audio nodes so setPlanetTheme can morph them in real-time
var pdLopNode=null, pdLfoNode=null, pdLfoGnNode=null, pdRevGnNode=null, pdDelNode=null;
var pdAllOscs=[], pdModeIdx=0, pdChordTimeout=null, pdTheme=null, currentPlanetNm=null;

function setPdStatus(msg, active) {
  var el = document.getElementById('pd-status');
  if(el) { el.textContent = msg; el.style.color = active ? 'var(--a)' : 'var(--dim)'; }
}

function highlightPdObj(id) {
  document.querySelectorAll('.pd-box').forEach(function(b){b.classList.remove('active');});
  var el = document.querySelector('[data-obj="'+id+'"]');
  if(el) el.classList.add('active');
}

function renderPdGraph() {
  var container = document.getElementById('pd-objects');
  if(!container) return;
  var rows = [
    [{id:'loadbang'}, {id:'metro'}, {id:'random'}, {id:'mtof0'}],
    [{id:'osc0'}, {id:'osc1'}, {id:'osc2'}, {id:'osc3'}, {id:'oscsub'}, {id:'osc_lfo'}, {id:'noise'}],
    [{id:'mul0'}, {id:'mul1'}, {id:'mul2'}, {id:'mul3'}, {id:'lop0'}, {id:'lop1'}],
    [{id:'add0'}, {id:'mul_sub'}],
    [{id:'lop2'}, {id:'add1'}],
    [{id:'rev2'}, {id:'delw'}, {id:'delr'}, {id:'mul_del'}],
    [{id:'add2'}, {id:'mul_out'}, {id:'dac'}],
  ];
  var wireRows = [
    '<span class="pd-wire">│  │  │  │  │  │</span>',
    '<span class="pd-wire">│  ╰──╯  ╰──╯  │</span>',
    '<span class="pd-wire">╰─────╮  ╭─────╯</span>',
    '<span class="pd-wire">      │  │       </span>',
    '<span class="pd-wire">      ╰──╯       </span>',
    '<span class="pd-wire">   ╭──╯  ╰──╮   </span>',
  ];
  var html = '';
  var objMap = {};
  PD_GRAPH.forEach(function(o){ objMap[o.id] = o; });
  rows.forEach(function(row, ri) {
    html += '<div class="pd-obj">';
    row.forEach(function(cell) {
      var o = objMap[cell.id];
      var cls = 'pd-box' + (o.type === 'ctrl' ? ' ctrl' : '');
      html += '<span class="'+cls+'" data-obj="'+o.id+'">'+o.label+'</span> ';
    });
    html += '</div>';
    if(ri < wireRows.length) html += '<div class="pd-send">'+wireRows[ri]+'</div>';
  });
  container.innerHTML = html;
}

function startFallbackEngine(actx) {
  setPdStatus('Running (native DSP)', true);
  pdAudioCtx = actx;
  pdTheme = PLANET_AUDIO[currentPlanetNm] || PLANET_AUDIO.Earth;

  pdVolGain = actx.createGain();
  pdVolGain.gain.value = 0;
  var limiter = actx.createDynamicsCompressor();
  limiter.threshold.value = -3; limiter.ratio.value = 10;
  pdVolGain.connect(limiter);
  limiter.connect(actx.destination);
  pdVolGain.gain.linearRampToValueAtTime(0.55, actx.currentTime + 2.5);

  // Reverb — convolver with exponential-decay impulse (simulates pd rev2~)
  var revLen = actx.sampleRate * 4.8 | 0;
  var revBuf = actx.createBuffer(2, revLen, actx.sampleRate);
  for(var ch = 0; ch < 2; ch++) {
    var d = revBuf.getChannelData(ch);
    for(var i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * Math.pow(0.001, i/d.length);
  }
  var pdRev = actx.createConvolver(); pdRev.buffer = revBuf;
  pdRevGnNode = actx.createGain(); pdRevGnNode.gain.value = pdTheme.revGain;
  pdRev.connect(pdRevGnNode); pdRevGnNode.connect(pdVolGain);

  // Delay with feedback (simulates pd delwrite~/delread~)
  pdDelNode = actx.createDelay(2.0); pdDelNode.delayTime.value = pdTheme.delTime;
  var delFb = actx.createGain(); delFb.gain.value = 0.38;
  pdDelNode.connect(delFb); delFb.connect(pdDelNode);
  var delGn = actx.createGain(); delGn.gain.value = 0.35;
  pdDelNode.connect(delGn); delGn.connect(pdVolGain);

  // LFO-modulated low-pass filter (simulates pd lop~ + osc~ .09)
  pdLopNode = actx.createBiquadFilter(); pdLopNode.type = 'lowpass';
  pdLopNode.frequency.value = pdTheme.lopFreq;
  pdLfoNode = actx.createOscillator(); pdLfoNode.frequency.value = pdTheme.lfoFreq;
  var lfoSmooth = actx.createBiquadFilter(); lfoSmooth.type = 'lowpass'; lfoSmooth.frequency.value = 30;
  pdLfoGnNode = actx.createGain(); pdLfoGnNode.gain.value = pdTheme.lfoAmt;
  pdLfoNode.connect(lfoSmooth); lfoSmooth.connect(pdLfoGnNode); pdLfoGnNode.connect(pdLopNode.frequency);
  pdLfoNode.start();

  // Background noise layer (simulates pd noise~ → lop~ 80)
  var noiseLen = actx.sampleRate * 4;
  var noiseBuf = actx.createBuffer(1, noiseLen, actx.sampleRate);
  var nd = noiseBuf.getChannelData(0);
  for(var ni = 0; ni < noiseLen; ni++) nd[ni] = Math.random()*2-1;
  var noiseNode = actx.createBufferSource(); noiseNode.buffer = noiseBuf; noiseNode.loop = true;
  var noiseLop = actx.createBiquadFilter(); noiseLop.type = 'lowpass'; noiseLop.frequency.value = 80;
  var noiseGn = actx.createGain(); noiseGn.gain.value = 0.022;
  noiseNode.connect(noiseLop); noiseLop.connect(noiseGn); noiseGn.connect(pdLopNode);
  noiseNode.start();

  pdLopNode.connect(pdVolGain); pdLopNode.connect(pdRev); pdLopNode.connect(pdDelNode);

  pdModeIdx = 0;
  pdAllOscs = [];
  pdFallbackSpawnChord(actx.currentTime);
  pdFallbackScheduleNext();
  pdIsRunning = true;
}

// Spawn the current chord of the active planet theme (simulates pd osc~ × n + *~ + +~)
function pdFallbackSpawnChord(t) {
  var theme = pdTheme || PLANET_AUDIO.Earth;
  pdAllOscs.forEach(function(o){try{o.osc.stop(t+0.05);}catch(e){}});
  pdAllOscs = [];
  var mode = theme.modes[pdModeIdx % theme.modes.length];
  var root = theme.root;
  mode.forEach(function(iv, i) {
    var freq = 440 * Math.pow(2, (root + iv - 69) / 12);
    var osc = pdAudioCtx.createOscillator();
    osc.type = theme.oscTypes[i % theme.oscTypes.length];
    osc.frequency.value = freq;
    osc.detune.value = (i % 2 === 0 ? -1 : 1) * theme.detune;
    var env = pdAudioCtx.createGain();
    var vol = i === 0 ? 0.28 : 0.16 / (i + 1);
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(vol, t + 2.0 + i * 0.25);
    env.gain.setTargetAtTime(vol * 0.65, t + 3.5, 2.2);
    osc.connect(env); env.connect(pdLopNode);
    osc.start(t); pdAllOscs.push({osc:osc, env:env});
  });
  // Sub-bass oscillator an octave below root (simulates pd osc~ sub)
  var sub = pdAudioCtx.createOscillator(); sub.type = 'sine';
  sub.frequency.value = 440 * Math.pow(2, (root - 12 - 69) / 12);
  var subGn = pdAudioCtx.createGain();
  subGn.gain.setValueAtTime(0, t);
  subGn.gain.linearRampToValueAtTime(0.26, t + 3.0);
  sub.connect(subGn); subGn.connect(pdVolGain);
  sub.start(t); pdAllOscs.push({osc:sub, env:subGn});
  // Highlight the PD nodes active for this planet
  var nodes = PLANET_PD_NODES[currentPlanetNm] || ['osc0','lop2','add1'];
  nodes.forEach(function(n, i){ setTimeout(function(){ highlightPdObj(n); }, i * 250); });
}

// Schedule the next chord using the current theme's tempo
function pdFallbackScheduleNext() {
  if(pdChordTimeout) clearTimeout(pdChordTimeout);
  var tempo = (pdTheme || PLANET_AUDIO.Earth).tempo;
  pdChordTimeout = setTimeout(function(){
    if(!pdIsRunning) return;
    pdModeIdx++;
    pdFallbackSpawnChord(pdAudioCtx.currentTime);
    pdFallbackScheduleNext();
  }, tempo);
}

function startPd() {
  if(pdIsRunning) return;
  var AudioCtx2 = window.AudioContext || window.webkitAudioContext;
  pdAudioCtx = new AudioCtx2();
  if(pdAudioCtx.state==='suspended') pdAudioCtx.resume();

  setPdStatus('Loading solar_system.pd...', false);

  // STEP 1: Fetch the Pure Data patch file as raw text (REQUIRED - no fallback)
  fetch('solar_system.pd')
    .then(function(response) {
      if(!response.ok) throw new Error('Failed to load solar_system.pd');
      // Download as plain text from disk
      return response.text();
    })
    .then(function(content) {
      // STEP 2: Store the raw text content in memory
      PD_PATCH_SOURCE = content;
      // STEP 3: Load WebPd compiler from CDN to parse and compile this patch
      initWebPd();
    })
    .catch(function(err) {
      console.warn('solar_system.pd not found, using native DSP fallback:', err.message);
      startFallbackEngine(pdAudioCtx);
    });
}

function initWebPd() {
  setPdStatus('Loading WebPd...', false);

  window._webpdLoaded = function(mods) {
    script.remove();
    //Compilatorul parseaza si compileaza textul din patch
    if(!mods || !mods.WebPd || !mods.Compiler) {
      console.warn('[WebPd] CDN unavailable – using native DSP fallback');
      startFallbackEngine(pdAudioCtx);
      return;
    }
    try {
      var Compiler = mods.Compiler;
      var WebPd = mods.WebPd;
      // STEP 4: Compiler parses and compiles the raw text into executable code
      Compiler.compile(PD_PATCH_SOURCE, {
        audioSettings: { sampleRate: pdAudioCtx.sampleRate, blockSize: 128, channelCount: { in:0, out:2 } }
      }).then(function(result) {
        // STEP 5: Transform compiled patch into executable audio engine
        var engine = WebPd.createEngine(pdAudioCtx);
        // STEP 6: Run the Pure Data patch - now it synthesizes audio
        WebPd.run(pdAudioCtx, result, {});
        pdEngine = engine;
        pdIsRunning = true;
        setPdStatus('solar_system.pd running', true);
        highlightPdObj('dac');
      }).catch(function(e) {
        console.warn('[WebPd] Compile failed, using native DSP fallback:', e.message);
        startFallbackEngine(pdAudioCtx);
      });
    } catch(e) {
      console.warn('[WebPd] Setup failed, using native DSP fallback:', e.message);
      startFallbackEngine(pdAudioCtx);
    }
  };

  document.head.appendChild(script);
}

function stopPd() {
  if(!pdIsRunning) return;
  pdIsRunning = false;
  if(pdChordTimeout) { clearTimeout(pdChordTimeout); pdChordTimeout = null; }
  var stopAt = pdAudioCtx ? pdAudioCtx.currentTime + 0.05 : 0;
  pdAllOscs.forEach(function(o){try{o.osc.stop(stopAt);}catch(e){}});
  pdAllOscs = [];
  if(pdVolGain) pdVolGain.gain.linearRampToValueAtTime(0, pdAudioCtx.currentTime + 1.5);
  if(typeof pdEngine === 'number') clearInterval(pdEngine);
  setTimeout(function(){ try{ pdAudioCtx.suspend(); } catch(e){} }, 1800);
  setPdStatus('Oprit', false);
  document.querySelectorAll('.pd-box').forEach(function(b){b.classList.remove('active');});
}

// Morph all audio parameters smoothly to the selected planet's signature
function setPlanetTheme(nm) {
  currentPlanetNm = nm;
  if(!pdIsRunning || !PLANET_AUDIO[nm]) return;
  var theme = PLANET_AUDIO[nm];
  pdTheme = theme;
  var t = pdAudioCtx.currentTime;
  var fade = 1.0;
  if(pdLopNode)   { pdLopNode.frequency.cancelScheduledValues(t);   pdLopNode.frequency.linearRampToValueAtTime(theme.lopFreq, t+fade); }
  if(pdLfoNode)   { pdLfoNode.frequency.linearRampToValueAtTime(theme.lfoFreq, t+fade); }
  if(pdLfoGnNode) { pdLfoGnNode.gain.linearRampToValueAtTime(theme.lfoAmt, t+fade); }
  if(pdRevGnNode) { pdRevGnNode.gain.linearRampToValueAtTime(theme.revGain, t+fade); }
  if(pdDelNode)   { pdDelNode.delayTime.linearRampToValueAtTime(theme.delTime, t+fade); }
  pdModeIdx = 0;
  pdFallbackSpawnChord(t + 0.12);
  pdFallbackScheduleNext();
  document.querySelectorAll('.pd-box').forEach(function(b){ b.classList.remove('active'); });
  var nodes = PLANET_PD_NODES[nm] || [];
  nodes.forEach(function(n, i){ setTimeout(function(){ highlightPdObj(n); }, i * 200); });
}

var musicBtn2 = document.getElementById('musicbtn');
var volWrap2  = document.getElementById('vol-wrap');
var vizBars2  = document.querySelectorAll('.vbar');

musicBtn2.addEventListener('click', function(){
  if(!pdIsRunning) {
    startPd();
    musicBtn2.classList.add('playing');
    document.getElementById('musiclabel').textContent = '\u23F8 Muzica';
    volWrap2.classList.add('show');
    vizBars2.forEach(function(b){b.classList.add('active');});
  } else {
    stopPd();
    musicBtn2.classList.remove('playing');
    document.getElementById('musiclabel').textContent = '\u25B6 Muzica';
    volWrap2.classList.remove('show');
    vizBars2.forEach(function(b){b.classList.remove('active');});
  }
});

document.getElementById('vol').addEventListener('input', function(e){
  var v = e.target.value/100;
  if(pdVolGain) pdVolGain.gain.linearRampToValueAtTime(v*0.6, pdAudioCtx.currentTime+0.05);
});

document.getElementById('patchbtn').addEventListener('click', function(){
  var p = document.getElementById('patch');
  p.classList.toggle('open');
  if(p.classList.contains('open')) renderPdGraph();
});

document.getElementById('dl-pd').addEventListener('click', function(){
  if(!PD_PATCH_SOURCE) {
    alert('Patch not yet loaded. Start Music first!');
    return;
  }
  var blob = new Blob([PD_PATCH_SOURCE], {type:'text/plain'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href=url; a.download='solar_system.pd'; a.click();
  URL.revokeObjectURL(url);
});

// ============================================================
// MAIN LOOP
// ============================================================
var clk = new THREE.Clock();
var tmpV = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  var dt = clk.getDelta();

  sph.t += (tSph.t - sph.t) * 0.08;
  sph.p += (tSph.p - sph.p) * 0.08;
  sph.r += (tSph.r - sph.r) * 0.08;
  pan.lerp(tPan, 0.08);
  mainCam.position.set(
    pan.x + sph.r*Math.sin(sph.p)*Math.sin(sph.t),
    pan.y + sph.r*Math.cos(sph.p),
    pan.z + sph.r*Math.sin(sph.p)*Math.cos(sph.t)
  );
  mainCam.lookAt(pan);

  if(!paused) {
    for(var nm in BODIES) {
      var body = BODIES[nm];
      if(nm === 'Sun'){body.mesh.rotation.y += dt*0.035; continue;}
      var sp = (1/body.data.periodDays)*simSpd*60;
      ANGS[nm] = (ANGS[nm]||0) + dt*sp;
      var a = ANGS[nm];
      body.mesh.position.set(Math.cos(a)*body.orb, 0, Math.sin(a)*body.orb);
      body.mesh.rotation.y += dt*(nm==='Jupiter'?0.26:nm==='Saturn'?0.22:0.15);
      if(nm==='Earth' && body.mesh.userData.clouds) body.mesh.userData.clouds.rotation.y += dt*0.006;
    }
  }

  for(var i = 0; i < LBLS.length; i++) {
    var lb = LBLS[i];
    var bd = BODIES[lb.nm];
    tmpV.copy(bd.mesh.position);
    tmpV.y += bd.Rp + 1.4;
    var proj = tmpV.clone().project(mainCam);
    if(proj.z > 1){lb.el.style.display='none';continue;}
    lb.el.style.display = 'block';
    lb.el.style.left = ((proj.x*0.5+0.5)*window.innerWidth) + 'px';
    lb.el.style.top  = ((-proj.y*0.5+0.5)*window.innerHeight) + 'px';
    var dist = bd.mesh.position.distanceTo(mainCam.position);
    lb.el.style.opacity = Math.min(1, Math.max(0, 1-(dist-20)/700));
  }

  mainRenderer.render(mainScene, mainCam);
}

// ============================================================
// INIT
// ============================================================
function init() {
  buildAllTextures();
  buildMainScene();
  progress(100, 'Gata!');
  setTimeout(function(){
    var ldr = document.getElementById('loader');
    ldr.style.opacity = '0';
    setTimeout(function(){ldr.remove();}, 800);
  }, 300);
  animate();

  window.addEventListener('resize', function(){
    mainCam.aspect = window.innerWidth/window.innerHeight;
    mainCam.updateProjectionMatrix();
    mainRenderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
