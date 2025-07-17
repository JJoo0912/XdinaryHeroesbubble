// More.js

document.addEventListener("DOMContentLoaded", () => {
  const moreBtn = document.getElementById("moreBtn");
  const moreMenu = document.getElementById("moreMenu");
  const updateBtn = document.getElementById("updateBtn");
  const managerBtn = document.getElementById("managerBtn");

  const inquiryModal = document.getElementById("inquiryModal");
  const closeInquiryBtn = document.getElementById("closeInquiryBtn");
  const sendInquiryBtn = document.getElementById("sendInquiryBtn");
  const inquiryMember = document.getElementById("inquiryMember");
  const inquiryDate = document.getElementById("inquiryDate");
  const inquiryText = document.getElementById("inquiryText");

  const managerLoginModal = document.getElementById("managerLoginModal");
  const managerPassword = document.getElementById("managerPassword");
  const managerLoginBtn = document.getElementById("managerLoginBtn");
  const closeManagerLoginBtn = document.getElementById("closeManagerLoginBtn");
  const managerLoginMsg = document.getElementById("managerLoginMsg");

  const managerPageModal = document.getElementById("managerPageModal");
  const closeManagerPageBtn = document.getElementById("closeManagerPageBtn");
  const inquiryList = document.getElementById("inquiryList");

  // 토글 메뉴 열기/닫기
  moreBtn.addEventListener("click", () => {
    moreMenu.classList.toggle("hidden");
  });

  // 문의 모달 열기
  updateBtn.addEventListener("click", () => {
    moreMenu.classList.add("hidden");
    inquiryModal.classList.remove("hidden");
  });

  // 문의 모달 닫기
  closeInquiryBtn.addEventListener("click", () => {
    inquiryModal.classList.add("hidden");
  });

  // 문의 전송 (임시 로컬 저장, 실제 서버 연동 필요)
  sendInquiryBtn.addEventListener("click", () => {
    const member = inquiryMember.value;
    const date = inquiryDate.value;
    const text = inquiryText.value.trim();

    if (!date || !text) {
      alert("날짜와 문의 내용을 입력해주세요.");
      return;
    }

    // 문의 저장 (여기서는 로컬스토리지 예시)
    const inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
    inquiries.push({ member, date, text, id: Date.now() });
    localStorage.setItem("inquiries", JSON.stringify(inquiries));

    alert("문의가 전송되었습니다.");
    inquiryModal.classList.add("hidden");

    // 입력 초기화
    inquiryDate.value = "";
    inquiryText.value = "";
  });

  // 관리자 버튼 클릭 시 로그인 모달 열기
  managerBtn.addEventListener("click", () => {
    moreMenu.classList.add("hidden");
    managerLoginModal.classList.remove("hidden");
    managerPassword.value = "";
    managerLoginMsg.style.display = "none";
  });

  // 관리자 로그인 처리
  managerLoginBtn.addEventListener("click", () => {
    const pw = managerPassword.value;
    if (pw === "0912") {
      managerLoginModal.classList.add("hidden");
      openManagerPage();
    } else {
      managerLoginMsg.style.display = "block";
    }
  });

  // 관리자 로그인 모달 닫기
  closeManagerLoginBtn.addEventListener("click", () => {
    managerLoginModal.classList.add("hidden");
  });

  // 관리자 페이지 닫기
  closeManagerPageBtn.addEventListener("click", () => {
    managerPageModal.classList.add("hidden");
  });

  // 관리자 페이지 열기 및 문의사항 출력
  function openManagerPage() {
    managerPageModal.classList.remove("hidden");
    loadInquiries();
  }

  // 문의사항 불러와서 리스트 출력
  function loadInquiries() {
    const inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
    inquiryList.innerHTML = "";

    if (inquiries.length === 0) {
      inquiryList.innerHTML = "<li>문의사항이 없습니다.</li>";
      return;
    }

    inquiries.forEach(({ member, date, text, id }) => {
      const li = document.createElement("li");
      li.textContent = `[${date}] ${member}: ${text}`;
      inquiryList.appendChild(li);
    });
  }

  // 채팅 업로드 버튼 클릭 이벤트 (실제 구현은 별도 서버 연동 필요)
  const uploadBtn = document.getElementById("uploadBtn");
  const uploadMember = document.getElementById("uploadMember");
  const uploadDate = document.getElementById("uploadDate");
  const uploadText = document.getElementById("uploadText");
  const uploadImage = document.getElementById("uploadImage");

  uploadBtn.addEventListener("click", () => {
    const member = uploadMember.value;
    const dateTime = uploadDate.value;
    const text = uploadText.value.trim();
    const imageFile = uploadImage.files[0];

    if (!dateTime) {
      alert("날짜/시간을 선택해주세요.");
      return;
    }
    if (!text && !imageFile) {
      alert("텍스트 또는 이미지를 입력해주세요.");
      return;
    }

    // 여기에 서버 업로드 코드 필요 (현재는 로컬스토리지 예시)
    // 로컬스토리지 채팅 데이터 배열 가져오기
    const chatsKey = `chats_${member}`;
    const chats = JSON.parse(localStorage.getItem(chatsKey) || "[]");

    // 이미지 파일을 base64로 변환 후 저장 (단순 예시)
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const newChat = {
          id: Date.now(),
          datetime: dateTime,
          text: text,
          image: reader.result,
        };
        chats.push(newChat);
        localStorage.setItem(chatsKey, JSON.stringify(chats));
        alert("채팅이 업로드되었습니다.");
        clearUploadForm();
      };
      reader.readAsDataURL(imageFile);
    } else {
      // 이미지 없을 때
      const newChat = {
        id: Date.now(),
        datetime: dateTime,
        text: text,
        image: null,
      };
      chats.push(newChat);
      localStorage.setItem(chatsKey, JSON.stringify(chats));
      alert("채팅이 업로드되었습니다.");
      clearUploadForm();
    }
  });

  // 업로드 폼 초기화
  function clearUploadForm() {
    uploadDate.value = "";
    uploadText.value = "";
    uploadImage.value = "";
  }
});
