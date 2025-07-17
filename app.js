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

// Helper to map member id->display name
function getMemberDisplay(id){
  const m = MEMBER_LIST.find(x=>x.id===id);
  return m ? m.display : id;
}

// Where images live
function profileSrc(id){
  return `images/${id}_profile.jpg`;
}
function backgroundSrc(id){
  return `images/${id}_background.jpg`;
}

// Data path
function dataSrc(id){
  return `data/${id}.json`;
}

// Date formatting util -> "YYYY-MM-DD" input -> readable
function formatDateK(dateStr){
  // naive
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

  // show nickname modal if not set
  if(!getNickname()){
    openNickModal();
  }
// 멤버 클릭 시 닉네임 체크 및 페이지 이동
document.addEventListener("DOMContentLoaded", () => {
  const members = document.querySelectorAll(".member");

  members.forEach(member => {
    member.addEventListener("click", () => {
      const name = member.getAttribute("data-name");
      let nickname = localStorage.getItem("nickname");

      if (!nickname) {
        nickname = prompt("닉네임을 설정하세요:");
        if (nickname) {
          localStorage.setItem("nickname", nickname);
        } else {
          return;
        }
      }

      window.location.href = `chat.html?member=${name}`;
    });
  });
});
  // load chat data
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
    // date separator
    if(msg.date && msg.date!==lastDate){
      const sep=document.createElement("div");
      sep.className="chat-date-sep";
      sep.textContent=formatDateK(msg.date);
      box.appendChild(sep);
      lastDate=msg.date;
    }

    const who = msg.from === "artist" ? "artist" : "fan";

    // image or text
    if (msg.image) {
      const img = document.createElement("img");
      img.src = msg.image;
      img.className = "chat-img";
      img.alt = "사진";
      img.onclick = () => showImagePopup(img.src);
      box.appendChild(img);
    } else {
      const div = document.createElement("div");
      div.className = `chat-msg ${who}`;
      div.textContent = msg.text.replace("(name)", fanNick);
      box.appendChild(div);
    }

    // meta (time + name)
    if(msg.time){
      const meta=document.createElement("div");
      meta.className="chat-meta";
      meta.textContent = (who==="fan"?fanNick:getMemberDisplay(memberId)) + " · " + msg.time;
      box.appendChild(meta);
    }
  });
}

// ---- nickname modal ----
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
    // re-render chat to apply nickname
    if(currentMemberId){
      loadChatData(currentMemberId);
    }
  }
}

// ---- 이미지 팝업 및 저장 버튼 ----
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

// ---- bootstrap by page ----
document.addEventListener("DOMContentLoaded",()=>{
  const path=location.pathname;
  if(path.endsWith("index.html") || path.endsWith("/")){
    initArchive();
  }else if(path.endsWith("member.html")){
    initMember();
  }else if(path.endsWith("chat.html")){
    initChat();

    // 여기에 exitButton 이벤트 추가
    const exitBtn = document.getElementById('exitButton');
    if(exitBtn){
      exitBtn.addEventListener('click', () => {
        window.location.href = 'index.html';  // index로 이동
      });
    }
  }
});
