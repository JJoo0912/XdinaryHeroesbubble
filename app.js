/* Fan Bubble App JS
 * Handles member list, profile view, chat view, nickname storage, data loading.
 */

const MEMBER_LIST = [
  {id:"Gunil", display:"건일"},
  {id:"Jeongsu", display:"정수"},
  {id:"Gaon", display:"가온"},
  {id:"Ode", display:"오드"},
  {id:"Junhan", display:"준한"},
  {id:"Jooyeon", display:"주연"},
];

// --- Utilities ---
function qs(sel,root=document){return root.querySelector(sel);}
function qsa(sel,root=document){return [...root.querySelectorAll(sel)];}
function getParam(name){
  const p=new URLSearchParams(location.search);
  return p.get(name);
}
function getNickname(){
  return localStorage.getItem("fanNickname") || "";
}
function setNickname(nick){
  localStorage.setItem("fanNickname", nick);
}
function getMemberDisplay(id){
  const m = MEMBER_LIST.find(x=>x.id===id);
  return m ? m.display : id;
}
function profileSrc(id){
  return `images/${id}_profile.jpg`;
}
function backgroundSrc(id){
  return `images/${id}_background.jpg`;
}
function dataSrc(id){
  return `data/${id}.json`;
}
function formatDateK(dateStr){
  const d = new Date(dateStr);
  if(!isNaN(d)){
    const y=d.getFullYear();
    const m=d.getMonth()+1;
    const day=d.getDate();
    const weekday=["일","월","화","수","목","금","토"][d.getDay()];
    return `${y}년 ${m}월 ${day}일 ${weekday}요일`;
  }
  return dateStr;
}

// ------------------ Archive (index.html) ------------------
function initArchive(){
  const listEl = qs("#archiveList");
  if(!listEl) return;
  MEMBER_LIST.forEach(m=>{
    const row=document.createElement("a");
    row.className="archive-row";
    row.href=`member.html?m=${m.id}`;

    row.innerHTML=`
      <span class="archive-row-avatar-wrap">
        <img class="archive-row-avatar" src="${profileSrc(m.id)}" alt="${m.display}"
             onerror="this.src='images/default_profile.jpg'">
      </span>
      <span class="archive-row-name">${m.display}</span>
      <span class="archive-row-status"> </span>
    `;
    listEl.appendChild(row);
  });
}

// ------------------ Member Profile (member.html) ------------------
function initMember(){
  const id=getParam("m");
  if(!id) return;
  const disp=getMemberDisplay(id);
  const bg=qs("#memberBg");
  const prof=qs("#memberProfile");
  const nameEl=qs("#memberDisplayName");
  const btn=qs("#viewChatBtn");
  if(bg) bg.src=backgroundSrc(id);
  if(prof){
    prof.src=profileSrc(id);
    prof.onerror=()=>{prof.src="images/default_profile.jpg";}
  }
  if(nameEl) nameEl.textContent=disp;
  if(btn){
    btn.addEventListener("click",()=>{ location.href=`chat.html?m=${id}`; });
  }
}

// ------------------ Chat (chat.html) ------------------
let currentMemberId=null;
function initChat(){
  const id=getParam("m");
  if(!id) return;
  currentMemberId=id;
  const disp=getMemberDisplay(id);
  const titleEl=qs("#chatMemberName");
  if(titleEl) titleEl.textContent=disp;

  // ✅ 닉네임 없으면 모달 띄우기
  if(!getNickname()){
    openNickModal();
  }

  // ✅ 채팅 데이터 불러오기
  loadChatData(id);
}

async function loadChatData(id){
  const box=qs("#chatScroll");
  if(!box) return;
  box.innerHTML="<div class='chat-date-sep'>불러오는 중...</div>";
  try{
    const res=await fetch(dataSrc(id));
    if(!res.ok) throw new Error(res.status);
    const data=await res.json();
    renderChat(box, data, id);
  }catch(err){
    box.innerHTML="<div class='chat-date-sep'>채팅 데이터를 불러올 수 없어요.</div>";
    console.error(err);
  }
}

function renderChat(box, data, memberId){
  box.innerHTML="";
  const fanNick=getNickname() || "나";
  let lastDate=null;
  data.forEach(msg=>{
    if(msg.date && msg.date!==lastDate){
      const sep=document.createElement("div");
      sep.className="chat-date-sep";
      sep.textContent=formatDateK(msg.date);
      box.appendChild(sep);
      lastDate=msg.date;
    }

    const who = msg.from === "artist" ? "artist" : "fan";

    if (msg.image) {
  const div = document.createElement("div");
  div.className = `chat-msg ${who}`;

  const img = document.createElement("img");
  img.src = msg.image;
  img.className = "chat-img";
  img.alt = "사진";
  img.onclick = () => showImagePopup(img.src);
  div.appendChild(img);

  if (msg.time) {
    const meta = document.createElement("div");
    meta.className = "chat-meta";
    meta.textContent = (who === "fan" ? fanNick : getMemberDisplay(memberId)) + " · " + msg.time;
    div.appendChild(meta);
  }

  box.appendChild(div);
      
} else {
  const div = document.createElement("div");
  div.className = `chat-msg ${who}`;
  
  // 채팅 텍스트
  const msgText = document.createTextNode(msg.text.replace("(name)", fanNick));
  div.appendChild(msgText);

  // 시간 + 이름 메타 정보
  if (msg.time) {
    const meta = document.createElement("div");
    meta.className = "chat-meta";
    meta.textContent = (who === "fan" ? fanNick : getMemberDisplay(memberId)) + " · " + msg.time;
    div.appendChild(meta);  // 👈 말풍선(div) 안에 append!!
  }

  box.appendChild(div);
}
  });
}

// ---- 닉네임 모달 ----
function openNickModal(){
  const m=qs("#nickModal");
  if(m) m.classList.remove("hidden");
}
function closeNickModal(){
  const m=qs("#nickModal");
  if(m) m.classList.add("hidden");
}
function saveNickname(){
  const inp=qs("#nickInput");
  const nick=(inp?.value||"").trim();
  if(nick){
    setNickname(nick);
    closeNickModal();
    if(currentMemberId){
      loadChatData(currentMemberId);
    }
  }
}

// ---- 이미지 팝업 ----
function showImagePopup(src){
  const popup = document.createElement("div");
  popup.className = "img-popup";
  popup.innerHTML = `
    <div class="img-popup-bg" onclick="this.parentNode.remove()"></div>
    <div class="img-popup-content">
      <img src="${src}" alt="채팅 이미지">
      <a class="img-save-btn" href="${src}" download>이미지 저장</a>
    </div>
  `;
  document.body.appendChild(popup);
}

// ---- 페이지 부트스트랩 ----
document.addEventListener("DOMContentLoaded",()=>{
  const path=location.pathname;
  if(path.endsWith("index.html") || path.endsWith("/")){
    initArchive();
  }else if(path.endsWith("member.html")){
    initMember();
  }else if(path.endsWith("chat.html")){
    initChat();

    const exitBtn = document.getElementById('exitButton');
    if(exitBtn){
      exitBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
      // 탭바의 Members 버튼 클릭 시 멤버 리스트를 다시 렌더링
document.getElementById("tabMembersBtn").addEventListener("click", () => {
  const archiveList = document.getElementById("archiveList");
  if (archiveList) {
    archiveList.innerHTML = "";  // 기존 목록 제거
    initArchive();               // 다시 멤버 출력
  }
});
    }
  }
});
