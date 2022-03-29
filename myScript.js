console.log( "=== myScript: load");  /* (VVV || "=== OK") */
/* !!! т.к. этот файл может подключаться "динамически"(т.е. в окне консоли)
   и поэтому интерпретироваться "на лету"  -
   то "перевод строки" не воспринимается как конец оператора => везде надо ставить ;
   коментарий -  /звезда ... звезда/
  */

/* //"use strict" */


function isUNDEFINED(v) {
 const UNDEFINED = "undefined";
 /* console.log(arguments[0])//.length) */
 return (typeof(v) == UNDEFINED)
}

function isOBJECT(v) {
 /* const UNDEFINED = "object" */
 return (typeof(v) == "object")
}


var ev, evF; /* [object ...Event]  - для проверок */
/* ev.toString()  "[object WheelEvent]"
 MouseEvent {e.type:"mouseover"   screenX: 1062, screenY: 186, clientX: 831, clientY: 41…}
 DragEvent  {  type: "drag" }  ev.toString() "[object DragEvent]"
 WheelEvent {  type:"mousewheel"  deltaX: -0, deltaY: -100, }
         ??? ev.type в EVENT "mousewheel" а потом "wheel" ???

 returnValue: true/false  toElement:  timeStamp: 

 <INPUT если файл выбран - .value="C:\fakepath\myScript.js"  если нет -  .value=""
*/


function EVENT(e,a) {
/*
e - [object ...Event]     arguments.length = 1

xx.onclick= EVENT //'vi("'+s+'")'
xx.addEventListener("click",EVENT)
<tag  onmousemove="EVENT(event)" ... >  ==>  function (event) { EVENT(event  ... )  }
*/

if (typeof(e) !== "object") { return };
let s = e.srcElement;
ev = e; evF=s; /* только для проверок в консоли */
/* debugger;   ??? в консоли ev.shiftKey и другие уже недоступны */

if (0 /*e.altKey*/) {
console.groupCollapsed("событие: "+e.type + " на ID  "+(s.id.length ? s.id : "?")+
               "   <"+s.nodeName+">  " + s.toString())
} else {
console.group("событие:",e.type, "на ID ",(s.id.length ? s.id : "?"),
              "   <",s.nodeName,"> ", s.toString())
}
console.log("Left ",s.offsetLeft, " Top "+s.offsetTop,
            "  mouse X Y ",e.screenX,e.screenY, "  which ",e.which)
console.log("shift ",e.shiftKey, " ctrl ",e.ctrlKey, " alt ",e.altKey, "   см. ev  evF");

switch(e.type) {
case 'mousewheel':
 console.log("wheelDelta "+e.wheelDelta+"  wheelDeltaX Y "+e.wheelDeltaX+" "+e.wheelDeltaY+
             "  deltaX Y "+e.deltaX+" "+e.deltaY+         /* ??? deltaX: -0 */ 
             "  movementX Y "+e.movementX+" "+e.movementY+
             "  offsetX Y "+e.offsetX+" "+e.offsetY+
             "  clientX Y "+e.clientX+" "+e.clientY+ "  x y "+e.x+" "+e.y);
 break;

case 'mouseover': 
case "dragstart":
case "dragend":
case "dragleave":
case "drag":
 console.log(/*"movementX Y "+e.movementX+" "+e.movementY+*/
             "offsetX Y "+e.offsetX+" "+e.offsetY+
             "  clientX Y "+e.clientX+" "+e.clientY+ "  x y "+e.x+" "+e.y);
 break;

/* ??? offsetX Y - для мыши от top/left обьекта в момент события */
/*     screenX Y - экранные координаты мыши на момент события */ 
/* сам обьект:   offsetWidth  offsetHeight - размеры (т.е.где следующее место) */
}
console.log(e.srcElement.value);
console.groupEnd();
/*// onchange  onselect => клавиши "undefined"
// onclick - заданы */
if (a) {alert("событие: "+ e.type)}

}

const YTchannel = "Yc";
const YTwatch = "Yw";
const YTembed = "Ye";


var mmh={title:"", type:"", ms:[], reader:null};  /* ms: [ [начало скрипта, длина], ...] */

function новый_mmh() {
/* очистить для разбора новой страницы */
mmh.title=""; mmh.type="";
mmh.ms=[]; mmh.reader=null;
}


var inp,ff,rr;


function vr(s,a) {
/* вызов из консоли - создает <INPUT> на странице для запуска своих скриптов */
/* position="fixed" если a  не true   */

const id="_id_"+ (s ? s : s="1");
    let _HTTP = 0;

inp=document.getElementById(id);  
if (! inp) {
 /*
 ff=document.createElement("div");
 ff.style.position="fixed"; ff.style.top="50px";ff.style.right="0";
 ff.style.opacity="0.8";ff.draggable=true;
 ff.id=id+"d"; document.body.appendChild(ff);
*/

 inp=document.createElement("input");
 if (!a) { inp.style.position="fixed"};
 inp.style.top="5px";inp.style.right="0"; /* справа вверху */
 inp.style.opacity="0.8";
 inp.id=id;
 inp.type="file"; /*inp.multiple=true;*/
 inp.draggable=true;
 
 document.body.appendChild(inp);
 /*ff.appendChild(inp);*/
 console.log("=== created  " + id);

 inp.onclick = function (e) { /*EVENT(e);*/
  if (!e.shiftKey) { return }; /* => обычную обработку */

  let inp=e.srcElement; /* <INPUT */
  if (inp.files.length==0) { console.log("no selected file!"); return }
  
  /* будем читать файл */
  rr = new FileReader();

  ff = inp.files[0];
  if (!e.altKey) { /* только читаем */
    rr._ACT=0;
    if (ff.name.endsWith(".js")) { /* код для обработки загруженного скрипта */
     console.warn('s=document.createElement("script");s.innerText=rr.result;document.head.appendChild(s);s.remove()', 
                  "  // выполнить скрипт")}
  } else /* после чтения - на обработку */
   if (ff.name.endsWith(".js")) { rr._ACT=1 } else
   if (e.ctrlKey) { rr._ACT=3 /* + выполнить скрипты */ } else { rr._ACT=2 /* разобрать страницу */ };

  rr.readAsText(ff); /* "utf-8" */
  console.log("чтение",ff.name);

  rr.onloadend = function(e) { /* this. - это  FileReader */
   /* e: e.toString() "[object ProgressEvent]"
      ProgressEvent {type: "loadend"   lengthComputable: true, loaded: 985507, total: 985507, …}
      .srcElement : FileReader    timeStamp:18507051.995  */
   console.log(this.readyState==this.DONE?"прочитано "+e.total+" "+this.result.length : "?ошибка");
   if (! this._ACT) {}
   else if (this._ACT == 1) {
    vs(this.result) }
   else {
    console.log(vh3(this), "обнаружено скриптов -", mmh.ms.length);
    if (this._ACT == 3) {
     if (mmh.ms.length > 0) {
      console.log("выполнено скриптов ", vs(this.result, mmh.ms, "var ytInitialData ="));
      vCanal() } } } 
  }; /* .onloadend */

  return false; /* отменяем обычную обработку */
 }; /* inp.onclick */
 
 /*inp.ondrag = null //EVENT // ?? возникает с сумасшедшей скоростью */
 inp.ondragstart = function (e) {
   /*EVENT(e);*/
   let inp=e.srcElement;
   if (e.type[4]=="s") { /* "dragStart": "dragend"   .endsWith("t") */
    inp.XXX=e.screenX; inp.YYY=e.screenY } /*console.log(inp.XXX+" "+inp.YYY) } */
   else {
    inp.XXX=e.screenX-inp.XXX; inp.YYY=e.screenY-inp.YYY; /*console.log(inp.XXX+" "+inp.YYY) */
    inp.style.top = parseInt(inp.style.top)+inp.YYY+"px";
    inp.style.right = parseInt(inp.style.right)-inp.XXX+"px" } };
 inp.ondragend = inp.ondragstart; /*  inp.ondragstart=EVENT; inp.ondragend=EVENT;  */
 inp.onmousewheel = (e) => {if (e.shiftKey) {e.srcElement.remove()} };

 inp.oninput=EVENT; inp.onended=EVENT;  inp.onselectstart=EVENT; inp.change=EVENT;

 /*
  inp.onmouseover= (ev) => {if (ev.shiftKey) {EVENT(ev)} };
  inp.onmousewheel = (ev) => {if (!ev.shiftKey) {EVENT(ev)} else {ev.srcElement.remove()} };
  inp.onselect= (ev) => {EVENT(ev)};
 */

 return inp;
}

return ff=inp.files[0];  /*"! button"; */





if (inp.files.length==0) { console.log("no selected file!"); return inp};
ff = inp.files[0];

rr = new FileReader();
rr.onloadend = function(e) { /* this - это  FileReader */
 /* e: e.toString() "[object ProgressEvent]"
   ProgressEvent { lengthComputable: true, loaded: 985507, total: 985507, type: "loadend"…}
     .srcElement : FileReader    timeStamp:18507051.995  */
 console.log(this.readyState==this.DONE?"прочитано  "+this.result.length:"?ошибка");
 if (this._HTTP) { vh2(this,"var ytInitialData ="); vCanal() } };

if (ff.name.lastIndexOf(".")<0) {rr._HTTP=1}
rr.readAsText(ff); /* "utf-8" */
console.log("чтение  "+ff.name);
if (ff.name.endsWith(".js")) {
 console.warn('s=document.createElement("script");s.innerText=rr.result;document.head.appendChild(s);s.remove()')}
return /*/setTimeout(3000) tt=rr.result */
}


function vs_body() {

tt=mmh.reader.result;

for (let m of mmh.ms) {
 console.log(m[0],m[1],tt.substr(m[0],m[1]).substr(0,100))
}
}


function vs(tt, mn, mt) {
/* выполнить скрипт */

if (! mn) { mn = tt ? [[0, tt.length]] : mmh.ms }
if (! tt) { tt = mmh.reader.result}

let i=0;
for (let m of mn) {
 if (!mt) {}
 else if (Array.isArray(mt)) {

 }
 else if (tt.substr(m[0],m[1]).indexOf(mt) < 0) { continue }

 s=document.createElement("script");
 s.innerText = tt.substr(m[0],m[1]); /* innerHTML */
 document.body.appendChild(s); s.remove();
 ++i
}

return i;


/* if (arguments.length=0) { obj0 = arguments[0] } //; alert(typeof obj0) } */
let obj = arguments[1];

for (let i = 2; i < arguments.length; i++) {
 obj = obj[arguments[i]];
 if (!isOBJECT(obj)) { break }
}

if (obj.length>0) {
 s=document.createElement("script");
 s.innerText="var "+arguments[0]+"="+obj;
 document.head.appendChild(s); s.remove() }

}


function vs2(tt, mn, mt) {
/* выполнить скрипт */

let ss, s=document.body;
if (s) { ss = s.parentNode; s.remove() } else { ss=document.getElementsByTagName("html")[0] }
if (!ss) { console.log("no <html>"); return }

if (! mn) { mn = tt ? [[0, tt.length]] : mmh.ms }
if (! tt) { tt = mmh.reader.result}

let i=0;
for (let m of mn) {
 if (!mt) {}
 else if (Array.isArray(mt)) {

 }
 else if (tt.substr(m[0],m[1]).indexOf(mt) < 0) { continue }

 s=document.createElement("body");
 s.innerHTML = tt.substr(m[0],m[1]);
 ss.appendChild(s); /* s.remove(); */
 ++i
}

return i;
}



var tt;

function vr_NEW(fl, act, rd) {

if (isOBJECT(fl)) { /* <input или File  */
 if (fl.tagName) { /* <input */
  if (fl.files.length==0) { console.log("select!!!"); return}
  ff = fl.files[0] }
 else { ff=fl } } /* File  */
else { /* имя файла */
 ff = new File([" "," "] , fl); fl=ff
}
console.log(ff.name);
/*
// .tagName = "INPUT"
// <input - .toString() "[object HTMLInputElement]"  .valueOf()  <input...
// <input.Files - .toString()  "[object FileList]"   .valueOf()  FileList {length: 0}
*/

if (!rd) { rd = new FileReader() } 
rr=rd;

if (act==0) {
 rd.readAsText(ff);
  /*if (rd.readyState == rd.DONE) EMPTY  LOADING */ 
 tt=rd.result;
 return rd.readyState }
else {

}

}


function vt() {

let obj;
obj = window.ytInitialData;
/* //console.log(obj == "undefined")
//console.log(typeof obj == "undefined")
//if ( ytInitialData || false) { window.stop(); return "STOP!!!!"; console.log("STOP!!!!") }
*/

if (obj) { window.stop(); return "STOP!!!!"; console.log("STOP!!!!") }
return;

if (arguments.length>0) { obj = arguments[0] }
else {
/* //let obj0 = ytInitialData //[{},0,2,[1,1]] // ytInitialData
//let obj0 = window.ytplayer
// obj = ytInitialData // window.ytcfg
*/
}
 
}


function vv() {
/*

 console.log("====")
//debugger 


let xhr = new XMLHttpRequest();

xhr.open('GET', 'https://www.biathlon.com.ua');
//xhr.open('GET', 'https://www.youtube.com/channel/UCQ4YOFsXjG9eXWZ6uLj2t2A');
//xhr.open('GET', 'https://mediametrics.ru/rating/ru/online.html');

xhr.send();

// xhr.onload = function() {
//   if (xhr.status != 200) { // HTTP ошибка?
//     // обработаем ошибку
//     alert( 'Ошибка: ' + xhr.status);
//     return;
//   }
// XMLHttpRequest cannot load https://www.youtube.com/channel/UCQ4YOFsXjG9eXWZ6uLj2t2A. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.

console.log(xhr.status)

  bbb= xhr.response // responseText

// Fetch API cannot load https://www.youtube.com/channel/UCQ4YOFsXjG9eXWZ6uLj2t2A. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

 console.log(typeof bbb)
debugger 

return

bbb=fetch("https://www.youtube.com/channel/UCQ4YOFsXjG9eXWZ6uLj2t2A")

*/

}


function vk(a) {

let obj;

if (arguments.length>0) { obj = arguments[0] } 
else {
 obj = ytInitialData /* window.ytcf   window.ytplayer  */
}

for(let k in obj) {	
 console.log(k + ": " + obj[k])
}

}


function vCanal(_to) {
/* структура ytInitialData на странице канала Youtube  */ 

let ss, ss0;
let i=0, s, nm, ms, id="";

/* _to: 0 или отсутствует - минимум на консоль + return,  id - минимум в <textarea  
      весь обьем: >= 1  2 - на лист  1 - на консоль log  3 - warm  4 - groupColl 5 - groupEnd */

let vyvod = true; /* false; */

let vse = (+(_to) >= 1);

try { if (!ytInitialData || !isOBJECT(ytInitialData)) { console.warn("ytInitialData не заполнен"); return }}
catch(e) { console.warn("ytInitialData не создан"); return }

ss = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs; /* = ytInitialData["contents"]... */

if (vse) {
 if (vyvod) {console.groupCollapsed("Вкладки на странице канала")}
 for (i = 0; i < ss.length-1; i++) {
  if (vyvod) {console.log (ss[i].tabRenderer.title)} } /* название */
  if (vyvod) {console.groupEnd()}
 if (vyvod) {console.log("=========")}
}
 
ss0 = ss[0].tabRenderer;  /* первая вкладка  "Головна" */
nm = " <" + ss0.title + ">  "; /* ее название */
ms = ss0.content.sectionListRenderer.contents;  /* все "секции" на этой вкладке */
s = ms[0];  /* первая секция - или "трансляция (прямой эфир или "предлагаемая")" или "списочная" */

s=s.itemSectionRenderer.contents;
if (vse) { if (s.length !== 1) {console.info(s.length)}}; /* ??? - было только 1 */
s=s[0];

let id0=""; /* videoId для return */
if ("shelfRenderer" in s) { i=0 } /* нет трансляции - "списочная" */
else {
 let v_efire = false;
 if ("channelFeaturedContentRenderer" in s) { /* эфирная */
  v_efire = true;
  s = s.channelFeaturedContentRenderer;
  ss0 = s.items; /* транслируемые */
  if (ss0.length>1)
   { i=0; console.groupCollapsed(s.title.runs[1].text+ "  " + ss0.length)}
  else { i=-1 }
  s=ss0[0].videoRenderer }
 else { s = s.channelVideoPlayerRenderer; i=-1 } /* "предлагаемая" */

 while (true) {
  id0 = s.videoId + (v_efire ? "  ON AIR" : ""); /* "предлагаемое" видео для просмотра */
  consolelog("videoId  "+id0, _to); /* if (vyvod) {} */

  id=s.title.runs[0].text; /* название видео */
  console.log (" "+id);

  id=s.title.accessibility.accessibilityData.label; /* название + автор + просмотров */
  if (vse) {consolelog(" "+id, _to)};

  if (v_efire) {
   id=s.descriptionSnippet.runs[0].text; /* описание */
   if (vyvod) {console.log (" "+id)} }

  if (i<0) { break }
  if (++i == ss0.length) { break } 
  s=ss0[i].videoRenderer
 }
 if (i>0) {console.groupEnd()}

 if (!vse) {return id0 }
 if (vyvod) {console.log("=========")}; /* конец "транслируемых" */
 i=1
}

if (vyvod) {console.log("Другие секции на вкладке "+nm+"  "+ms.length)}
else { i = ms.length /* чтобы обойти след. for */ };

for (; i < ms.length; i++) { /* список секций */
 /* console.log(ms[i].itemSectionRenderer.contents.length); /* ??? - было только 1 */
 s = ms[i].itemSectionRenderer.contents[0].shelfRenderer;
 id = s.title.runs[0].text;  /* название секции */
 
 try {
  s = s.content;
  if ("horizontalListRenderer" in s) { s = s.horizontalListRenderer }
  else if ("expandedShelfContentsRenderer" in s) { s = s.expandedShelfContentsRenderer };
  s = s.items }
 catch(err) { console.log("=== "+id +"  ???"); continue;   debugger }

 /* console.log("=== "+id +"  " + s.length); /* название + кол. видео в секции*/
 console.groupCollapsed("=== "+id +"  " + s.length); /* название + кол. видео в секции*/
 
 for (let i = 0; i < s.length; i++) { /* список записей в секции */
  j=1;
  if ("gridVideoRenderer" in s[i]) { s2 = s[i].gridVideoRenderer }
  else if ("videoRenderer" in s[i]) { s2 = s[i].videoRenderer }
  else if ("gridPlaylistRenderer" in s[i]) { s2 = s[i].gridPlaylistRenderer; j=2 }
  else if ("gridChannelRenderer" in s[i]) { s2 = s[i].gridChannelRenderer; j=3 }
  else { j=-1; /* break; debugger */ }

  if (!vyvod) {}
  else if (j==1) {
   try { id = "  "+s2.publishedTimeText.simpleText} /* "Трансляція відбулася..." */
   catch(err) {id = ""}

   try {
    console.log(s2.videoId + "  "+s2.title.simpleText.substr(0,100) + id) }
   catch(e) {console.log(e.name+e.message); break;  debugger} }
  else if (j==2) { /* это Playlist */
   console.log(s2.title.runs[0].text + "  " + s2.playlistId) } 
  else if (j==3) { /* список каналов */
   console.log(s2.title.simpleText+"  "+s2.channelId) } 
  else {
   console.warn(i+" / "+s.length, "???") }
 } /* список записей */
 console.groupEnd();
} /* список секций */

return id0
} /* vCanal  */



function vCanal__(_to) {
/* структура ytInitialData на странице канала Youtube  */ 

let ss, ss0;
let i, s, nm, ms, id;

/* _to: 0 или отсутствует - минимум на консоль + return,  id - минимум в <textarea  
      весь обьем: 1 - на лист  2 - на консоль log  3 - warm  4 - group 5 - groupEnd */

let vyvod = false;

let vse = (+(_to) > 0);


try { if (!ytInitialData || !isOBJECT(ytInitialData)) { console.warn("ytInitialData не заполнен"); return }}
catch(e) { console.warn("ytInitialData не создан"); return }

ss = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs; /* = ytInitialData["contents"]... */

if (vse) {
 if (vyvod) {console.groupCollapsed("Вкладки на странице канала")}
 for (i = 0; i < ss.length-1; i++) {
  if (vyvod) {console.log (ss[i].tabRenderer.title)} } /* название */
  if (vyvod) {console.groupEnd()}
 if (vyvod) {console.log("=========")}
}
 
ss0 = ss[0].tabRenderer;  /* первая вкладка  "Головна" */
nm = " <" + ss0.title + ">  "; /* ее название */
ms = ss0.content.sectionListRenderer.contents;  /* все "секции" на этой вкладке */

s = ms[0];  /* "основная" секция */

s=s.itemSectionRenderer.contents;
if (vyvod) {console.log (s.length)}; /* ??? - было только 1 */
s=s[0];

let id0; /* videoId для return */
if ("shelfRenderer" in s) { i=0 } /* нет "основной" */
else {
 let v_efire = false;
 if ("channelFeaturedContentRenderer" in s) {
  s = s.channelFeaturedContentRenderer.items;
  v_efire = true;
  if (vyvod) {console.log (s.length)}; /* ??? - было только 1 */
  s=s[0].videoRenderer }
 else { s=s.channelVideoPlayerRenderer }

 id0 = s.videoId + (v_efire ? "  ON AIR" : ""); /* "предлагаемое" видео для просмотра */
 console.log ("videoId  "+id0); /* if (vyvod) {} */

 id=s.title.runs[0].text; /* название видео */
 if (vyvod) {console.log (" "+id)};

 id=s.title.accessibility.accessibilityData.label; /*  + автор ... просмотров */
 console.log (" "+id);

 if (v_efire) {
  id=s.descriptionSnippet.runs[0].text; /* описание */
  if (vyvod) {console.log (" "+id)}
 }
 if (vyvod) {console.log("=========")}; /* конец "основной" */
 i=1
}

if (vyvod) {console.log("Другие секции на вкладке "+nm+"  "+ms.length)}
else { i = ms.length /* обойти for */ };

for (; i < ms.length; i++) { /* список секций */
 /* console.log(ms[i].itemSectionRenderer.contents.length); /* ??? - было только 1 */
 s = ms[i].itemSectionRenderer.contents[0].shelfRenderer;
 id = s.title.runs[0].text;  /* название секции */
 
 try {
  s = s.content;
  if ("horizontalListRenderer" in s) { s = s.horizontalListRenderer }
  else if ("expandedShelfContentsRenderer" in s) { s = s.expandedShelfContentsRenderer };
  s = s.items }
 catch(err) { console.log("=== "+id +"  ???"); continue;   debugger }

 /* console.log("=== "+id +"  " + s.length); /* название + кол. видео в секции*/
 console.groupCollapsed("=== "+id +"  " + s.length); /* название + кол. видео в секции*/
 
 for (let i = 0; i < s.length; i++) { /* список видео в секции */
  j=0;
  if ("gridVideoRenderer" in s[i]) { s2 = s[i].gridVideoRenderer }
  else if ("videoRenderer" in s[i]) { s2 = s[i].videoRenderer }
  else if ("gridPlaylistRenderer" in s[i]) { s2 = s[i].gridPlaylistRenderer; j=1 }
  else { break;  debugger }

  if (!vyvod) {}
  else if (j==0) {
   try { id = "  "+s2.publishedTimeText.simpleText} /* "Трансляція відбулася..." */
   catch(err) {id = ""}

   try {
    console.log(s2.videoId + "  "+s2.title.simpleText.substr(0,100) + id) }
   catch(err) {console.log(err.name+err.message); break;  debugger} }
  else { /* это Playlist  */
   console.log(s2.playlistId + "  "+s2.title.runs[0].text.substr(0,100)) } /*+ id) } */ 
 } /* список видео */
 console.groupEnd();
} /* список секций */

return id0
} /* vCanal  */


function vWatch(vyvod, obj) {


/* структура ytInitialData на странице канала Youtube  */ 

  var vse = false;
var ss, ss0, ss1;
var tt, i=0; /* ,   s, nm, ms, id; */

if (arguments.length<2) { obj = ytInitialData }

try { if (!obj || !isOBJECT(obj)) { console.warn("obj не заполнен"); return }}
catch(e) { console.warn("obj не создан"); return }
if (!vyvod) {vyvod = 0}

/**/if (vse) {
}
vyvod=1;

tt=obj.currentVideoEndpoint.watchEndpoint.videoId;

/*
.currentVideoEndpoint.commandMetadata.webCommandMetadata.url = /watch?v=TDGl3a-6-T0
.currentVideoEndpoint.commandMetadata.webCommandMetadata.webPageType = WEB_PAGE_TYPE_WATCH
.currentVideoEndpoint.watchEndpoint.watchEndpointSupportedOnesieConfig.html5PlaybackOnesieConfig.commonConfig.url = https://r7---sn-8vap5-3c2d.googlevideo.com/initplayback?....

contents.twoColumnBrowseResultsRenderer.tabs[0 / 7].tabRenderer.endpoint...webPageType = WEB_PAGE_TYPE_CHANNEL

header.c4TabbedHeaderRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.webPageType = WEB_PAGE_TYPE_CHANNEL
                             .title = Эхо Москвы
*/

ss0=obj.contents.twoColumnWatchNextResults;

ss1=ss0.results.results;

i=0;
/*
.contents[0] может быть .itemSectionRenderer - какой-то информационный блок INFO_PANEL_CONTENT_BACKGROUND
*/
ss=ss1.contents[i++].videoPrimaryInfoRenderer;
if (!ss) { ss=ss1.contents[i++].videoPrimaryInfoRenderer } /* ? efir */
ss1=ss1.contents[i].videoSecondaryInfoRenderer.owner.videoOwnerRenderer.title.runs[0];

tt=(i==1 ? "" : "ON AIR  ")+tt+"  "+
   ss.title.runs[0].text + "  "+ ss.dateText.simpleText+"  "+
   ss1.text+"  "+ss1.navigationEndpoint.browseEndpoint.browseId;
if (vyvod) {console.log(tt)}

ss0=ss0.secondaryResults.secondaryResults.results;
/* .secondaryResults.targetId = "watch-next-feed" смотреть следующий канал  */
if (vyvod) {console.groupCollapsed("Рекомендуемые видео  "+(ss0.length-1))}
/*console.log(ss0.length);*/

for (let i=0; i < ss0.length-1; i++) { /* ??? рекомендуемые - блок в правой части */
 try {
  ss=ss0[i].compactVideoRenderer;  /* .promotedSparklesWebRenderer.title.simpleText  .websiteText.simpleText  */
  /*tt=ss.videoId + "  "+ss.title.accessibility.accessibilityData.label; */
  tt=ss.videoId+"  "+ss.title.simpleText+"  "+
     ("lengthText" in ss ? ss.lengthText.simpleText+" "+ss.publishedTimeText.simpleText
                         : ss.badges[0].metadataBadgeRenderer.label /* в ефире */ ) +
     "  "+ss.longBylineText.runs[0].text+"  "+ss.longBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId
 } catch (e) { continue }
 if (vyvod) {console.log(i+" "+tt)}
}
if (vyvod) {console.groupEnd()}

ss0 = obj.playerOverlays.playerOverlayRenderer.endScreen.watchNextEndScreenRenderer;
ss1 = ss0.results;
if (vyvod) {console.groupCollapsed(ss0.title.simpleText+" (видео на плеере)  "+ss1.length)}

for (let i=0; i < ss1.length; i++) { /* ??? рекомендуемые - список на плеере */
 if (ss=ss1[i].endScreenVideoRenderer) {
  tt=ss.videoId + "  "+ ss.title.accessibility.accessibilityData.label }
 else if (ss=ss1[i].endScreenPlaylistRenderer) {
  /* ...url = "/watch?v=PSoAhPtzRms&list=RDCMUC8GVl-h0H2hI8ZHuzog25NA&start_radio=1&rv=odrKiSx3rTg" */
  tt=ss.playlistId + "  "+ ss.title.simpleText }
 else { continue }
 if (vyvod) {console.log(i+" "+tt)}
}
if (vyvod) {console.groupEnd()}

return;

} /* vWatch  */



var ww, wd;


function key() {
/* hotkey для плеера */

s0=ytInitialData.topbar.desktopTopbarRenderer.hotkeyDialog.hotkeyDialogRenderer;
console.log(s0.title.runs[0].text);

s0=s0.sections;
for (let i = 0; i < s0.length; i++) {
 s1=s0[i].hotkeyDialogSectionRenderer;
 console.log(s1.title.runs[0].text);

 for (let i = 0; i < s1.options.length; i++) {
  s=s1.options[i].hotkeyDialogSectionOptionRenderer;
  console.log("  "+s.label.runs[0].text + "  " + s.hotkey)
 }
}
}


function ss(nm, ss, nmX) {
/* выполнить скрипт */
/* if (arguments.length=0) { obj0 = arguments[0] } //; alert(typeof obj0) } */

let obj = ss;

for (let i = 2; i < arguments.length; i++) {
 obj = obj[arguments[i]];
 if (!isOBJECT(obj)) { break }
}

if (obj.length>0) {
 s=document.createElement("script");
 s.innerText = (tt = (nm ? "var "+nm+"= " : "")) + obj;
 document.body.appendChild(s); /*s.remove();*/
 
 console.log(obj.length + "  " + tt+obj.substr(0,80));
 return s }
}

function vh(tt) {
/* "разобрать" страницу сайта */
 /*  var ytInitialData =  */

if (!isOBJECT(t)) { if (!t) { console.warn(t); return} }
else if (!t.toString().endsWith(" FileReader]")) { console.warn(t.toString()); return }
else if (t.readyState !== t.DONE) { console.warn(t.readyState +" - файл не прочитан"); return }
else { t = t.result }

/*if (prompt(t.substr(0,50),"debug") == "debug" ) {debugger}; */

let i01=-1,i03;
let tag="", i1=0, i2, i3;
const lMAX=120;
  let iii=0;
debugger;
while (i1 < tt.length) {
/*  <tag .....> ... <tag ...> ... </tag>...  */
/*   i1/i01   i2     i1/i01 i2     i1   i2 */

 if (++iii > 1000) {console.log("stop 1000"); return}


 i1 = tt.indexOf("<", i1); if (i1<0) { break };
 i2 = tt.indexOf(">", ++i1);
 if (i2<0) { console.warn("Нет > для "+tt.slice(i1-1,10)+"  "+ (i1-1)); return }

 i3 = tt.slice(i1,i2).indexOf(" "); if (i3<0) { i3=i2-i1}; /* длина имени тега */
 tag = tt.substr(i1,i3); /* найденный тег */
 ++i2;

 if (tag[0] !== "/") { /* это открывающий тег */
/*if (tag=="script") {debugger}; */
  if (i01>=0) { /* предыдущий тег - тоже открывающий - выведим его  */
   i03 = i1-i01; /* (i1-1) - (i01-1) /* длина предущего: тег + возможное тело */
   console.log( tt.substr(i01-1,i03).substr(0,lMAX) + (i03>lMAX? " ...":"")) }
  i01=i1; i03=i3;
  i1=i2;
  continue }

 /* закрывающий тег */
 if (tag.substr(1,i3-1) !== tt.substr(i01,i03) ) { /* вложенный тег */
  console.log( tt.slice(i1-1,i2));
  i1=i2; i01=-1;
  continue }
 
      if (i01<0) { console.log("i01<0") ; return   }

 /* полная пара тегов: <tag>...</tag> */
 i3 = i2-i01; /* i2-(i01-1) суммарная длина */
 if (i3 <= lMAX) { i03=i1-i01; /* (i1-1) - (i01-1) /* длина предущего: тег + возможное тело */ }
            else { i03=lMAX-(i2-i1)-5; i3=0; /* " ... " */} /* i2-(i01-1) суммарная длина */
 console.log(tt.substr(i01-1,i03) + (i3 ? "" : " ... ") + tt.slice(i1-1,i2));
 i1=i2; i01=-1;
 continue;

 
 /*if (tag == "script") {
  if (!confirm(tag)) {return} } */

 i1=++i2;
 while(1) {
  if (tag=="script") {} else
  if (tag=="style") {} else
  if (tag=="title") {} else
  if (tag=="div") {} else
  if (tag=="a") {} else { break }

  i2 = tt.indexOf("</"+tag, i1);
  if (i2<0) {       return tt.slice(i1,10) }
  if (i2==i1) {} else {
  if (tag=="script") {
   i3=i2-i1;
   console.log("  === "+i1+" "+i3+" RUN: "+tt.substr(i1,i3>100? 100 : i3));
   s=document.createElement("script");
   s.innerText=tt.slice(i1,i2); /*document.head.appendChild(s);*/ s.remove() } else {
  if (tag=="title") { t0=tt.slice(i1,i2) } } }
  i1 = tt.indexOf(">", i2)+1;
  break }
}

};


function vh3(t, vyvod) {
/* "разобрать" страницу сайта */
 /*  var ytInitialData =  */


/* /новый_mmh(); */

if (!isOBJECT(t)) { if (!t) { console.warn(t); return 0} }
else if (!t.toString().endsWith(" FileReader]")) { console.warn(t.toString()); return 0}
else if (t.readyState !== t.DONE) { console.warn(t.readyState +" - файл не прочитан"); return 0}
else { t = t.result }

if (!vyvod) {vyvod=0}
let tag="";
let i1=0,i2,i3;

/*if (prompt(t.substr(0,50),"debug") == "debug" ) {debugger}; */

while (i1 < t.length) {
 if (t[i1] != "<") {   console.warn(i1, t.substr(i1,50)); return }
 i2 = t.indexOf(">", ++i1);
 if (i2<0) {    console.warn(i1, t.slice(i1-1,10)); return }

 i3 = t.slice(i1,i2).indexOf(" ");
 tag = (i3<0)? t.slice(i1,i2) : t.substr(i1,i3);
 if (vyvod) { console.log(t.slice(i1-1,i2+1).substr(0,100) )};
 /*if (tag == "script") {
  if (!confirm(tag)) {return} } */

 i1=++i2;
 while(1) {
  if (tag=="script") {} else
  if (tag=="style") {} else
  if (tag=="title") {} else
  if (tag=="div") {} else
  if (tag=="a") {} else { break }

  i2 = t.indexOf("</"+tag, i1);
  if (i2<0) {    console.warn(i1, t.slice(i1,10)); return }
  if (i2==i1) {}
  else if (tag=="script") {
  
   i3=i2-i1;
   if (vyvod) { console.log("  === "+i1+" "+i3+" RUN: "+t.substr(i1,i3>100? 100 : i3))};
   mmh.ms.push([i1,i3]); }

 /*  if (!mt) {}
   else if (t.slice(i1,i2).indexOf(mt) >=0 ) {
  console.log(i1)
    s=document.createElement("script");
    s.innerText=t.slice(i1,i2); document.head.appendChild(s); s.remove() }  else {console.log(mt)}  }
 */ 

  else if (tag=="title") { mmh.title=t.slice(i1,i2) };
  i1 = t.indexOf(">", i2)+1;
  break }
} /* while */

return mmh.title;
};



function vh2(t, mt) {
/* --- разобрать страницу сайта */
 /*  var ytInitialData =  */

let t0="";

if (!isOBJECT(t)) { if (!t) { console.warn(t); return 0} }
else if (!t.toString().endsWith(" FileReader]")) { console.warn(t.toString()); return 0}
else if (t.readyState !== t.DONE) { console.warn(t.readyState +" - файл не прочитан"); return 0}
else { t = t.result }

let vyvod= (!mt); 
let tag="";
let i1=0,i2,i3;

/*if (prompt(t.substr(0,50),"debug") == "debug" ) {debugger}; */

while (i1 < t.length) {
 if (t[i1] != "<") {   console.warn(i1, t.substr(i1,50)); return }
 i2 = t.indexOf(">", ++i1);
 if (i2<0) {    console.warn(i1, t.slice(i1-1,10)); return }

 i3 = t.slice(i1,i2).indexOf(" ");
 tag = (i3<0)? t.slice(i1,i2) : t.substr(i1,i3);
 if (vyvod) { console.log(t.slice(i1-1,i2+1).substr(0,100) )};
 /*if (tag == "script") {
  if (!confirm(tag)) {return} } */

 i1=++i2;
 while(1) {
  if (tag=="script") {} else
  if (tag=="style") {} else
  if (tag=="title") {} else
  if (tag=="div") {} else
  if (tag=="a") {} else { break }

  i2 = t.indexOf("</"+tag, i1);
  if (i2<0) {    console.warn(i1, t.slice(i1,10)); return }
  if (i2==i1) {}
  else if (tag=="script") {
   i3=i2-i1;
   if (vyvod) { console.log("  === "+i1+" "+i3+" RUN: "+t.substr(i1,i3>100? 100 : i3))};
   if (!mt) {}
   else if (t.slice(i1,i2).indexOf(mt) >=0 ) {
  console.log(i1);
    s=document.createElement("script");
    s.innerText=t.slice(i1,i2); document.head.appendChild(s); s.remove() }  else {console.log(mt)}  }
  else if (tag=="title") { t0=t.slice(i1,i2) };
  i1 = t.indexOf(">", i2)+1;
  break }
} /* while */

return t0;
};


function nw(obj0,key,txt,lMax,nnMax) {
/* доделывать  key txt  */

if (!obj0) { obj0 = window.ytInitialData } /*  yt  ytplayer  ytcfg */
if (!isOBJECT(obj0)) {console.warn("Задан не обьект!  "+typeof obj0); return }

let skn=0, ska=false, sk=false; if (key) { sk=(key.length>0); ska = Array.isArray(key)}
let stn=0, sta=false, st=false; if (txt) { st=(txt.length>0); sta = Array.isArray(txt)}

if (!lMax) {lMax=50};
let nmax=0; /* глубина вложенности obj0 */
let nn=0; /* кол. сформированных строк на листе */
if (!nnMax) {nnMax=5000};

var mc= ["red","green","blue","magenta","purple","cyan","brown",
         "red","green","blue","magenta","purple","cyan","brown",
         "red","green","blue","magenta","purple","cyan","brown"];
const dlm = (sk ? ". " : "|....");

ww = window.open("struct.htm","_blank","left=400,top=400,width=0,height=0,scrollbars=yes,status=yes,location=yes,toolbar=yes,menubar=yes");
if (isUNDEFINED(ww)) {console.log("Окно не создано"); return}
/* debugger */
wd = ww.document;
wd.open();
wd.write("<title>"+window.document.title+"</title>");
  wd.onkeypress=function () { alert("ppp") };

/*
myWindow.document.write("<html>");
myWindow.document.write("<head>");
myWindow.document.write("<title>Окно</title>");
myWindow.document.write("</head>");
myWindow.document.write("<body>");
*/
wd.write("");

/* debugger */

v2 = function (obj, n, t) {
if (n>nmax) { nmax=n }
let sf=false;

for(let k in obj) { 
 /* доделать
 if (sk) {
  if (ska) { sf=false; for (let key1 of key) { if (k == key1) { sf=true; ++skn; break } } }
  else { if ( sf=(k == key)) { ++skn } } }
 */

 if (++nn < nnMax) {}
 else if (confirm("строк > "+nnMax+". Продолжать?")) { nnMax += 5000 } 
      else { console.warn(">"+nnMax); wd=undefined}
 
 if (typeof obj[k] == "object") {
  wd.write("<br>"+dlm.repeat(n));
  wd.write('<b><a href="" style="color:'+mc[n] + 
           (sf ? ';background:lightgrey' : '')+'">' + k + "</a></b>" +
           (Array.isArray(obj[k]) ? "  ["+ String(obj[k].length) +"]" : "") + t);
  if (n>lMax) {wd.write(" <<<"); continue}
  v2(obj[k], n+1, Array.isArray(obj[k]) ? "  / " + String(obj[k].length) : "") }

 else {
  if (sk) { if (k == key) {++skn} else { continue }  }
  wd.write("<br>"+dlm.repeat(n));
  wd.write(k + "<a style='color:red'> : </a>" + 
               (typeof obj[k] !=="string" || obj[k].length < 80 ? obj[k] : '<a style="font-size: small">' + obj[k] +"</a>"))
 }
}
}; /* v2 */

try {
 v2(obj0, 0, Array.isArray(obj0) ? "  / " + String(obj0.length) : "");
 wd.write("<br>=== end ===");
} catch(e) {console.warn(e.name+":  "+e.message)}

return (sk ? skn+" found.  " : "  ") + nn+" lines.  глубина вложенности "+nmax;

wd.write("</body>");
wd.write("</html>");
}


/****

var mc= ["red","green","blue","magenta","purple","cyan","brown",
         "red","green","blue","magenta","purple","cyan","brown",
         "red","green","blue","magenta","purple","cyan","brown"];


function v2(obj, n, t) {
for(let k in obj) {	
 wd.write("<br>"+"|....".repeat(n));

 if (typeof obj[k] == "object") {
  wd.write('<b><a href="javascript:nnn()" style="color:'+mc[n]+'">' + (k+t)+ "</a></b>");
  v2(obj[k], n+1, Array.isArray(obj[k]) ? "  / " + String(obj[k].length) : "") }
 
 else { wd.write(k + "<a style='color:red'> = </a>" + 
  	             (obj[k].length < 80 ? obj[k] : '<a style="font-size: small">' + obj[k] +"</a>"))}
}
}

*****/

/*
//     word-wrap: inherit   ; word-wrap: break-word
// background:rgba(40,40,40,0.98)}  color:black  style="background:cyan; color:  font-size: 10px;


 // if (typeof obj[k] == "object") 
 //  { wd.write("<b>"+k+"</b>"); v2(obj[k], n+3) }
 // else { wd.write(k+" = " + obj[k])}

*/

/*

//+ console.log (s.length +"  "+    ms[i]["itemSectionRenderer["contents[0]["shelfRenderer["title["runs[0]["text)


// return "" //id //alert(id)
 //alert(typeof ytInitialData) 
var ytInitialData = 

//<!-- <script src="D:\H\TEST\myScript.js"> </script>  -->
//<!-- <script> function myALERT2() { alert("WORK!!!")} </script>  -->



https://www.youtube.com/embed/gc0WiFYNv6g   solov 07.04    Yf8ilkbm1ds pozner sudba


dd=new Date()
Thu Apr 22 2021 01:41:13 GMT+0200 (Финляндия (зима))



s=document.getElementsByName("")

<link .toString()  = - "[object NodeList]"


<meta charset="utf-8">
<script>
s=document.createElement("script"); s.src="D:/H/TEST/myScript.js"; document.head.appendChild(s);s.remove()
   document.body.appendChild(s)
s=document.createElement("script"); s.innerText=rr.result; document.head.appendChild(s);s.remove()
</script>

s.toString() "[object HTMLScriptElement]"
s.nodeName "SCRIPT"
s.removeAttribute("src")

watch:   window.ytplayer.config.args.raw_player_response.videoDetails

vz='function zz(){console.log("OK")}'
s=document.createElement("script"); s.innerHTML=vz; document.head.appendChild(s)


s=document.createElement("script"); s.src="https://www.google.com/js/th/aRB5vtMgII7DALCmCUZFfhabFCI8RNJQqSbe_9t5ggE.js"; document.head.appendChild(s)

s=document.createElement("script"); s.src="https://drive.google.com/file/d/1Jt1ZLWWffSsR-92aZv0O9g9esQ2ztsdO/view?usp=sharing"; document.head.appendChild(s)

myScript
https://drive.google.com/file/d/1Jt1ZLWWffSsR-92aZv0O9g9esQ2ztsdO/view?usp=sharing
https://1drv.ms/u/s!AGUsGu4hePoKg04  ==>  https://onedrive.live.com/?cid=0afa7821ee1a2c65&id=AFA7821EE1A2C65%21462
https://1drv.ms/u/s!AmUsGu4hePoKg06SYnxK_JynoqCZ?e=qjRU4S

myTV
https://drive.google.com/file/d/1xQ64DYeq-sPj9lzt5nCiNUn4MYDq1SpN/view?usp=sharing


<html style="font-size: 10px;font-family: Roboto, Arial, sans-serif;" lang="ru-RU" themed-scrollbar="">

https://www.youtube.com/s/desktop/e9152424/jsbin/fetch-polyfill.vflset/fetch-polyfill.js
https://www.youtube.com/s/desktop/e9152424/jsbin/desktop_polymer_inlined_html_polymer_flags_legacy_browsers.vflset/desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js
строка  311
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt



// s.src="D:/H/TEST/myScript.js"
// document.head.appendChild(s)    document.body.appendChild(s)

// dojd  https://www.youtube.com/channel/UCdubelOloxR3wzwJG9x8YqQ  ?lang="ru-RU"  5ruC5DySK3Y  13.03 15:00
// solov https://www.youtube.com/channel/UCQ4YOFsXjG9eXWZ6uLj2t2A
// echo  https://www.youtube.com/channel/UCo4GExFphiUnNiMMExvFWdg   qcPSy2j3kMA  lang="uk-UA"
// Россия 1 https://www.youtube.com/channel/UC2D0dmLHKbIe9aACnlcTLPg
// 60 минут https://www.youtube.com/channel/UCR16nHT1nkmG7g9AkE9tGeQ
//  https://www.youtube.com/watch?v=qcPSy2j3kMA
// https://www.youtube.com/channel/UCCcprrrcbdaj14kYPjcbj9w  youtube  В гостях у Гордона
  // ?? <link rel="canonical" href="https://www.youtube.com/channel/UCCcprrrcbdaj14kYPjcbj9w">
// Web Academy		 https://www.youtube.com/channel/UCju2xJA3j9mT0cB6FEZtp5g
// Shuster Шустера    https://www.youtube.com/channel/UC2FCgT_PVESYWYSiekDFfCw
//  Прямий   https://www.youtube.com/channel/UCH9H_b9oJtSHBovh94yB5HA
//  rada new  https://www.youtube.com/channel/UCT_QirupNzM7h2EMypxuIxw
//  Рада  https://www.youtube.com/channel/UC5V8mErVFOpcQXEb3y9IMZw
// in time Ukraine     https://www.youtube.com/channel/UCL7Vqph7xNpidbgjmfxpNyg

// function gotWeather({ temperature, humidity }) {
// alert(`температура: ${temperature}, влажность: ${humidity}`);
//}

//let script = document.createElement('script');
//script.src = `http://another.com/weather.json?callback=gotWeather`;
//document.body.append(script);


// Refused to display 'https://accounts.google.com/ServiceLogin?service=youtube&uilel=3&passive=tr…3Ddesktop%26hl%3Duk%26next%3D%252Fsignin_passive%26feature%3Dpassive&hl=uk' in a frame because it set 'X-Frame-Options' to 'DENY'.


// Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https, chrome-extension-resource.

// Fetch API cannot load  file:///D:/youtubei/v1/guide?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8

// desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1677
// dojd XMLHttpRequest cannot load file:///D:/youtubei/v1/log_event?alt=json&key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8
// Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https, chrome-extension-resource.

// https://www.youtube.com/s/desktop/6babc418/jsbin/desktop_polymer_inlined_html_polymer_flags_legacy_browsers.vflset/desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js
// desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1677
// echo XMLHttpRequest cannot load file:///D:/youtubei/v1/log_event?alt=json&key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8

// desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1332 XMLHttpRequest cannot load file:///D:/youtubei/v1/log_event?alt=json&key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8. Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https, chrome-extension-resource.
// https://www.youtube.com/s/desktop/810941b4/jsbin/desktop_polymer_inlined_html_polymer_flags_legacy_browsers.vflset/desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js
// ok	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1332
// nk	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1320
// z	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1653
// aha	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1655
// Xga	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1353
// (anonymous function)	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1351
// ji	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1007
// Ik	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1351
// (anonymous function)	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1352
// (anonymous function)	@	desktop_polymer_inlined_html_polymer_flags_legacy_browsers.js:1231

    --blue: #2196f3;
    --indigo: #3f51b5;
    --purple: #9c27b0;
    --pink: #e91e63;
    --red: #f44336;
    --orange: #ff9800;
    --yellow: #ffeb3b;
    --green: #6dab64;
    --teal: #009688;
    --cyan: #00bcd4;
    --white: #ffffff;
    --gray: #6c757d;



online.forward-bank
<script async="" src="https://www.google-analytics.com/analytics.js"></script>
<script id="facebook-jssdk" src="https://connect.facebook.net/uk_UA/sdk/xfbml.customerchat.js"></script>

Failed to parse SourceMap: https://online.forward-bank.com/web-animations.min.js.map
 https://online.forward-bank.com/web-animations.min.js.map
Failed to parse SourceMap: https://online.forward-bank.com/popper.js.map
 https://online.forward-bank.com/popper.js.map


<script id="facebook-jssdk" src="https://connect.facebook.net/uk_UA/sdk/xfbml.customerchat.js"></script>
<script>
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/uk_UA/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  </script>


 

my_JS    https://docs.google.com/document/d/e/2PACX-1vQt8kU4NraViZOC0kUEk1YkhpexcrTQ1TeseYUoqSFrJDt3fmXxNniGHN5qLVC4XevA1fsNY47-vw0b/pub

<style type="text/css" nonce="s4UJEQ6sBJ6YiD4eJLzExw">
      @import url("https://fonts.googleapis.com/css?family=Google+Sans");
   

      @import url("https://fonts.googleapis.com/css?family=Roboto");
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxO.eot);
}



    @media only screen and (max-device-width: 800px) {
        #header {
          border-bottom-width: 5px;
          height: auto;
          display: block;
        }





d = new Date(2013, 11, 5, 16, 23, 45, 600)
Thu Dec 05 2013 16:23:45 GMT+0200 (Финляндия (зима))


*/

console.log( "=== myScript: OK");  /* (VVV || "=== OK") */
