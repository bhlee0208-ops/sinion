/**
 * 인증 상태에 따른 헤더 버튼 관리
 * 모든 페이지에서 사용할 수 있는 공통 스크립트
 */

// 초기 상태 설정: 모든 버튼을 올바른 상태로 설정
(function() {
    'use strict';
    
    // DOM이 로드되기 전에 초기 상태 설정
    function setInitialState() {
        // 로그아웃 버튼 숨기기
        const logoutBtn = document.getElementById('header-logout-btn');
        const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
        
        // 관리자 버튼 숨기기
        const adminBtn = document.getElementById('header-admin-btn');
        const mobileAdminBtn = document.getElementById('mobile-admin-btn');
        if (adminBtn) adminBtn.style.display = 'none';
        if (mobileAdminBtn) mobileAdminBtn.style.display = 'none';
        
        // 로그인/회원가입 버튼 표시
        const loginBtn = document.getElementById('header-login-btn');
        const registerBtn = document.getElementById('header-register-btn');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const mobileRegisterBtn = document.getElementById('mobile-register-btn');
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'block';
    }
    
    // 즉시 실행 (DOM이 준비되기 전에도)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setInitialState);
    } else {
        setInitialState();
    }
    
    // Firebase SDK를 동적으로 로드하고 인증 상태 관리
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
        import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
        import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
        
        const firebaseConfig = {
            apiKey: "AIzaSyBIPC1cb6Auw4JKmNbNjlvyYUwOYySvmqo",
            authDomain: "sinion-29380.firebaseapp.com",
            projectId: "sinion-29380",
            storageBucket: "sinion-29380.firebasestorage.app",
            messagingSenderId: "417218748288",
            appId: "1:417218748288:web:cce20cdeefa181c32b6b65",
            measurementId: "G-8NW54FCZ3R"
        };
        
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        
        // 사용자 role 캐시 (성능 최적화)
        const userRoleCache = new Map();
        
        // 관리자 여부 확인 함수 (Firestore에서 role 확인)
        async function isAdmin(user) {
            if (!user || !user.uid) return false;
            
            // 캐시 확인
            if (userRoleCache.has(user.uid)) {
                return userRoleCache.get(user.uid) === 'admin';
            }
            
            try {
                // Firestore에서 사용자 정보 조회
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('uid', '==', user.uid));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    const role = userData.role || 'user';
                    // 캐시에 저장
                    userRoleCache.set(user.uid, role);
                    return role === 'admin';
                }
                
                // Firestore에 정보가 없으면 기본값으로 'user' 저장
                userRoleCache.set(user.uid, 'user');
                return false;
            } catch (error) {
                console.error('관리자 확인 오류:', error);
                // 오류 발생 시 이메일로 폴백 체크
                const ADMIN_EMAILS = [
                    'sprince1004@naver.com',
                    'bhlee0208@gmail.com'
                ];
                return ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');
            }
        }
        
        // 헤더 버튼 업데이트 함수
        async function updateHeaderButtons(user) {
            const loginBtn = document.getElementById('header-login-btn');
            const registerBtn = document.getElementById('header-register-btn');
            const logoutBtn = document.getElementById('header-logout-btn');
            const adminBtn = document.getElementById('header-admin-btn');
            const mobileLoginBtn = document.getElementById('mobile-login-btn');
            const mobileRegisterBtn = document.getElementById('mobile-register-btn');
            const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
            const mobileAdminBtn = document.getElementById('mobile-admin-btn');
            
            if (user) {
                // 로그인된 상태: 로그인/회원가입 버튼 숨기고 로그아웃 버튼 표시
                if (loginBtn) loginBtn.style.display = 'none';
                if (registerBtn) registerBtn.style.display = 'none';
                if (logoutBtn) logoutBtn.style.display = 'inline-block';
                if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
                if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'none';
                if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
                
                // 관리자 여부에 따라 관리자 버튼 표시/숨김 (비동기)
                const isAdminUser = await isAdmin(user);
                if (adminBtn) {
                    adminBtn.style.display = isAdminUser ? 'inline-block' : 'none';
                }
                if (mobileAdminBtn) {
                    mobileAdminBtn.style.display = isAdminUser ? 'block' : 'none';
                }
            } else {
                // 로그아웃된 상태: 로그아웃 버튼 숨기고 로그인/회원가입 버튼 표시
                if (loginBtn) loginBtn.style.display = 'inline-block';
                if (registerBtn) registerBtn.style.display = 'inline-block';
                if (logoutBtn) logoutBtn.style.display = 'none';
                if (adminBtn) adminBtn.style.display = 'none';
                if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
                if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'block';
                if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
                if (mobileAdminBtn) mobileAdminBtn.style.display = 'none';
                
                // 로그아웃 시 캐시 초기화
                userRoleCache.clear();
            }
        }
        
        // 인증 상태 변경 감지 (즉시 실행)
        onAuthStateChanged(auth, (user) => {
            updateHeaderButtons(user);
        });
        
        // 로그아웃 함수 (전역 함수로 등록)
        window.handleLogout = async function() {
            if (confirm('로그아웃 하시겠습니까?')) {
                try {
                    await signOut(auth);
                    localStorage.removeItem('user');
                    // 캐시 초기화
                    userRoleCache.clear();
                    alert('로그아웃되었습니다.');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('로그아웃 오류:', error);
                    alert('로그아웃 중 오류가 발생했습니다.');
                }
            }
        };
    `;
    document.head.appendChild(script);
})();
