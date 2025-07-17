/* More.js
 * Handles toggle menu (Update & Manager), inquiry form, manager login, etc.
 */

// More 토글 메뉴 열고 닫기
const moreMenu = document.getElementById("moreMenu");
const tabMoreBtn = document.getElementById("tabMoreBtn");
const tabMembersBtn = document.getElementById("tabMembersBtn");

if (tabMoreBtn) {
  tabMoreBtn.addEventListener("click", () => {
    moreMenu.classList.toggle("show");
  });
}

// Members 버튼 클릭 시 member.html로 이동
if (tabMembersBtn) {
  tabMembersBtn.addEventListener("click", () => {
    window.location.href = "member.html";
  });
}

// Update 버튼 누르면 문의 폼 열기
const updateBtn = document.getElementById("updateBtn");
const updateForm = document.getElementById("updateForm");

if (updateBtn && updateForm) {
  updateBtn.addEventListener("click", () => {
    updateForm.classList.toggle("show");
    moreMenu.classList.remove("show"); // 메뉴는 닫기
  });
}

// Manager 버튼 누르면 비밀번호 입력창 표시
const managerBtn = document.getElementById("managerBtn");
const managerLogin = document.getElementById("managerLogin");
const managerPasswordInput = document.getElementById("managerPassword");
const managerSubmitBtn = document.getElementById("managerSubmit");

if (managerBtn && managerLogin) {
  managerBtn.addEventListener("click", () => {
    managerLogin.classList.toggle("show");
    moreMenu.classList.remove("show"); // 메뉴는 닫기
  });
}

// 비밀번호 확인 후 관리자 메뉴 열기
if (managerSubmitBtn && managerPasswordInput) {
  managerSubmitBtn.addEventListener("click", () => {
    const password = managerPasswordInput.value;
    if (password === "0912") {
      document.getElementById("managerMenu").classList.add("show");
      managerLogin.classList.remove("show");
      managerPasswordInput.value = "";
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  });
}

// 관리자 메뉴 내 탭 전환
const newsTab = document.getElementById("newsTab");
const uploadTab = document.getElementById("uploadTab");
const newsSection = document.getElementById("newsSection");
const uploadSection = document.getElementById("uploadSection");

if (newsTab && uploadTab && newsSection && uploadSection) {
  newsTab.addEventListener("click", () => {
    newsTab.classList.add("active");
    uploadTab.classList.remove("active");
    newsSection.style.display = "block";
    uploadSection.style.display = "none";
  });

  uploadTab.addEventListener("click", () => {
    uploadTab.classList.add("active");
    newsTab.classList.remove("active");
    uploadSection.style.display = "block";
    newsSection.style.display = "none";
  });
}

// 채팅 업로드 기능
const uploadForm = document.getElementById("uploadForm");

if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const member = document.getElementById("uploadMember").value;
    const datetime = document.getElementById("uploadDatetime").value;
    const text = document.getElementById("uploadText").value;
    const image = document.getElementById("uploadImage").files[0];

    if (!member || !datetime || (!text && !image)) {
      alert("모든 필드를 입력하거나 이미지를 업로드하세요.");
      return;
    }

    const message = {
      member,
      datetime,
      text,
      image
    };

    console.log("채팅 메시지 업로드:", message);

    alert("채팅 메시지가 업로드되었습니다.");
    uploadForm.reset();
  });
}
