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
      const img = document.createElement("img");
      img.src = msg.image;
      img.className = "chat-img";
      img.alt = "사진";
      img.onclick = () => showImagePopup(img.src);
      box.appendChild(img);

    } else if (msg.video) {
      const video = document.createElement("video");
      video.src = msg.video;
      video.className = "chat-video";
      video.controls = true;
      video.preload = "metadata";
      video.style.maxWidth = "100%";
      box.appendChild(video);

    } else {
      const div = document.createElement("div");
      div.className = `chat-msg ${who}`;
      div.textContent = msg.text.replace("(name)", fanNick);
      box.appendChild(div);
    }

    if(msg.time){
      const meta=document.createElement("div");
      meta.className="chat-meta";
      meta.textContent = (who==="fan"?fanNick:getMemberDisplay(memberId)) + " · " + msg.time;
      box.appendChild(meta);
    }
  });
}
