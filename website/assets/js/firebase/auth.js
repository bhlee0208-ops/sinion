// Firebase Authentication 관련 함수들
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "./config.js";

// 에러 메시지 한국어 변환
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
    'auth/user-disabled': '사용할 수 없는 계정입니다.',
    'auth/user-not-found': '등록되지 않은 사용자입니다.',
    'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/weak-password': '비밀번호는 최소 6자 이상이어야 합니다.',
    'auth/network-request-failed': '네트워크 오류가 발생했습니다.',
    'auth/too-many-requests': '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    'auth/operation-not-allowed': '이 작업은 허용되지 않습니다.',
    'auth/requires-recent-login': '보안을 위해 다시 로그인해주세요.'
  };
  
  return errorMessages[errorCode] || '오류가 발생했습니다. 다시 시도해주세요.';
};

/**
 * 이메일/비밀번호로 로그인
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} - 성공 시 사용자 정보 반환
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        emailVerified: userCredential.user.emailVerified
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

/**
 * 이메일/비밀번호로 회원가입
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @param {string} displayName - 사용자 이름 (선택)
 * @returns {Promise<Object>} - 성공 시 사용자 정보 반환
 */
export const registerWithEmail = async (email, password, displayName = null) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 사용자 이름이 제공된 경우 프로필 업데이트
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    // 이메일 인증 메일 전송
    await sendEmailVerification(userCredential.user);
    
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName,
        emailVerified: false
      },
      message: '회원가입이 완료되었습니다. 이메일 인증을 완료해주세요.'
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

/**
 * 로그아웃
 * @returns {Promise<Object>} - 성공 여부 반환
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: '로그아웃되었습니다.'
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

/**
 * 현재 로그인된 사용자 확인
 * @returns {Object|null} - 현재 사용자 정보 또는 null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * 인증 상태 변경 감지
 * @param {Function} callback - 사용자 상태 변경 시 호출될 콜백 함수
 * @returns {Function} - 구독 해제 함수
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * 비밀번호 재설정 이메일 전송
 * @param {string} email - 비밀번호를 재설정할 이메일
 * @returns {Promise<Object>} - 성공 여부 반환
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: '비밀번호 재설정 이메일이 전송되었습니다.'
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

