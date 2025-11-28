/**
 * Firebase 백엔드 사용 예제
 * 
 * 주의: 이 파일은 예제입니다. 실제 프로젝트에서는 
 * Vite나 다른 번들러를 사용하여 모듈을 번들링하거나,
 * 또는 전통적인 방식으로 스크립트를 작성해야 합니다.
 */

// ============================================
// 1. 로그인 예제
// ============================================
async function handleLogin(email, password) {
  try {
    // ES6 모듈 방식 (Vite 사용 시)
    const { loginWithEmail } = await import('./auth.js');
    
    const result = await loginWithEmail(email, password);
    
    if (result.success) {
      console.log('로그인 성공:', result.user);
      // 로그인 성공 후 처리
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = '/index.html';
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    alert('로그인 중 오류가 발생했습니다.');
  }
}

// HTML 폼에서 사용 예시:
// document.getElementById('loginForm').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const email = document.querySelector('input[name="email"]').value;
//   const password = document.querySelector('input[name="password"]').value;
//   await handleLogin(email, password);
// });

// ============================================
// 2. 회원가입 예제
// ============================================
async function handleRegister(email, password, displayName) {
  try {
    const { registerWithEmail } = await import('./auth.js');
    
    const result = await registerWithEmail(email, password, displayName);
    
    if (result.success) {
      alert(result.message || '회원가입이 완료되었습니다.');
      window.location.href = '/login.html';
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    alert('회원가입 중 오류가 발생했습니다.');
  }
}

// ============================================
// 3. 입력폼 제출 예제
// ============================================
async function handleFormSubmit(formData) {
  try {
    const { submitForm } = await import('./forms.js');
    
    const result = await submitForm(formData);
    
    if (result.success) {
      alert('문의가 성공적으로 제출되었습니다.');
      // 폼 초기화
      document.getElementById('contactForm').reset();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('폼 제출 오류:', error);
    alert('문의 제출 중 오류가 발생했습니다.');
  }
}

// HTML 폼에서 사용 예시:
// document.getElementById('contactForm').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const formData = {
//     name: document.querySelector('input[name="name"]').value,
//     email: document.querySelector('input[name="email"]').value,
//     phone: document.querySelector('input[name="phone"]').value,
//     message: document.querySelector('textarea[name="message"]').value,
//     type: document.querySelector('select[name="type"]').value
//   };
//   await handleFormSubmit(formData);
// });

// ============================================
// 4. 공지사항 조회 예제
// ============================================
async function loadNotices() {
  try {
    const { getAllNotices } = await import('./notices.js');
    
    const result = await getAllNotices(10);
    
    if (result.success) {
      const noticesContainer = document.getElementById('notices-container');
      noticesContainer.innerHTML = '';
      
      result.notices.forEach(notice => {
        const noticeElement = document.createElement('div');
        noticeElement.className = 'notice-item';
        noticeElement.innerHTML = `
          <h3>${notice.title}</h3>
          <p>${notice.content}</p>
          <span>${new Date(notice.createdAt.toDate()).toLocaleDateString('ko-KR')}</span>
        `;
        noticesContainer.appendChild(noticeElement);
      });
    } else {
      console.error('공지사항 로드 실패:', result.error);
    }
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
  }
}

// 페이지 로드 시 공지사항 불러오기
// window.addEventListener('DOMContentLoaded', loadNotices);

// ============================================
// 5. 인증 상태 확인 예제
// ============================================
function setupAuthStateListener() {
  const { onAuthStateChange } = await import('./auth.js');
  
  onAuthStateChange((user) => {
    if (user) {
      // 로그인된 상태
      console.log('사용자 로그인:', user);
      updateUIForLoggedInUser(user);
    } else {
      // 로그아웃된 상태
      console.log('사용자 로그아웃');
      updateUIForLoggedOutUser();
    }
  });
}

function updateUIForLoggedInUser(user) {
  // 로그인 버튼 숨기기, 로그아웃 버튼 표시
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  
  if (loginBtn) loginBtn.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'block';
  if (userInfo) {
    userInfo.textContent = `안녕하세요, ${user.displayName || user.email}님`;
    userInfo.style.display = 'block';
  }
}

function updateUIForLoggedOutUser() {
  // 로그인 버튼 표시, 로그아웃 버튼 숨기기
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  
  if (loginBtn) loginBtn.style.display = 'block';
  if (logoutBtn) logoutBtn.style.display = 'none';
  if (userInfo) userInfo.style.display = 'none';
}

// ============================================
// 6. 로그아웃 예제
// ============================================
async function handleLogout() {
  try {
    const { logout } = await import('./auth.js');
    
    const result = await logout();
    
    if (result.success) {
      localStorage.removeItem('user');
      alert('로그아웃되었습니다.');
      window.location.href = '/index.html';
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('로그아웃 오류:', error);
    alert('로그아웃 중 오류가 발생했습니다.');
  }
}

// ============================================
// 7. 전통적인 방식 (모듈 없이 사용)
// ============================================
// 만약 ES6 모듈을 사용할 수 없는 환경이라면,
// Firebase SDK를 직접 사용하는 방식으로 구현해야 합니다.

// 예시: 전통적인 방식의 로그인 함수
function traditionalLogin(email, password) {
  // Firebase SDK를 직접 import
  import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js';
  
  const auth = getAuth();
  
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('로그인 성공:', user);
      window.location.href = '/index.html';
    })
    .catch((error) => {
      console.error('로그인 오류:', error);
      alert('로그인에 실패했습니다: ' + error.message);
    });
}

