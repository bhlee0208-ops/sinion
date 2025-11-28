// 입력폼 관리 관련 함수들
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  Timestamp
} from "firebase/firestore";
import { db } from "./config.js";

// 컬렉션 이름 상수
const FORMS_COLLECTION = "forms";

/**
 * 입력폼 제출
 * @param {Object} formData - 폼 데이터 객체
 * @returns {Promise<Object>} - 성공 시 문서 ID 반환
 */
export const submitForm = async (formData) => {
  try {
    // 타임스탬프 추가
    const dataWithTimestamp = {
      ...formData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'pending' // pending, processing, completed, rejected
    };
    
    const docRef = await addDoc(collection(db, FORMS_COLLECTION), dataWithTimestamp);
    
    return {
      success: true,
      id: docRef.id,
      message: '문의가 성공적으로 제출되었습니다.'
    };
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      error: '문의 제출 중 오류가 발생했습니다. 다시 시도해주세요.',
      code: error.code
    };
  }
};

/**
 * 모든 입력폼 조회 (관리자용)
 * @param {number} maxResults - 최대 결과 수 (기본값: 50)
 * @returns {Promise<Object>} - 폼 목록 반환
 */
export const getAllForms = async (maxResults = 50) => {
  try {
    const q = query(
      collection(db, FORMS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );
    
    const querySnapshot = await getDocs(q);
    const forms = [];
    
    querySnapshot.forEach((doc) => {
      forms.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      forms: forms,
      count: forms.length
    };
  } catch (error) {
    console.error('Get forms error:', error);
    return {
      success: false,
      error: '문의 목록을 불러오는 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 특정 입력폼 조회
 * @param {string} formId - 폼 문서 ID
 * @returns {Promise<Object>} - 폼 데이터 반환
 */
export const getFormById = async (formId) => {
  try {
    const docRef = doc(db, FORMS_COLLECTION, formId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        form: {
          id: docSnap.id,
          ...docSnap.data()
        }
      };
    } else {
      return {
        success: false,
        error: '문의를 찾을 수 없습니다.'
      };
    }
  } catch (error) {
    console.error('Get form error:', error);
    return {
      success: false,
      error: '문의를 불러오는 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 입력폼 상태 업데이트 (관리자용)
 * @param {string} formId - 폼 문서 ID
 * @param {string} status - 새로운 상태 (pending, processing, completed, rejected)
 * @param {string} adminNote - 관리자 메모 (선택)
 * @returns {Promise<Object>} - 성공 여부 반환
 */
export const updateFormStatus = async (formId, status, adminNote = null) => {
  try {
    const docRef = doc(db, FORMS_COLLECTION, formId);
    const updateData = {
      status: status,
      updatedAt: Timestamp.now()
    };
    
    if (adminNote) {
      updateData.adminNote = adminNote;
    }
    
    await updateDoc(docRef, updateData);
    
    return {
      success: true,
      message: '문의 상태가 업데이트되었습니다.'
    };
  } catch (error) {
    console.error('Update form status error:', error);
    return {
      success: false,
      error: '문의 상태 업데이트 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 입력폼 삭제 (관리자용)
 * @param {string} formId - 폼 문서 ID
 * @returns {Promise<Object>} - 성공 여부 반환
 */
export const deleteForm = async (formId) => {
  try {
    const docRef = doc(db, FORMS_COLLECTION, formId);
    await deleteDoc(docRef);
    
    return {
      success: true,
      message: '문의가 삭제되었습니다.'
    };
  } catch (error) {
    console.error('Delete form error:', error);
    return {
      success: false,
      error: '문의 삭제 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 상태별 입력폼 조회
 * @param {string} status - 조회할 상태
 * @param {number} maxResults - 최대 결과 수
 * @returns {Promise<Object>} - 폼 목록 반환
 */
export const getFormsByStatus = async (status, maxResults = 50) => {
  try {
    const q = query(
      collection(db, FORMS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );
    
    const querySnapshot = await getDocs(q);
    const forms = [];
    
    querySnapshot.forEach((doc) => {
      forms.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      forms: forms,
      count: forms.length
    };
  } catch (error) {
    console.error('Get forms by status error:', error);
    return {
      success: false,
      error: '문의 목록을 불러오는 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

