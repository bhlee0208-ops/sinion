// 공지사항 관리 관련 함수들
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
const NOTICES_COLLECTION = "notices";

/**
 * 공지사항 작성 (관리자용)
 * @param {Object} noticeData - 공지사항 데이터 객체
 * @param {string} noticeData.title - 제목
 * @param {string} noticeData.content - 내용
 * @param {string} noticeData.category - 카테고리 (선택)
 * @param {boolean} noticeData.isImportant - 중요 공지 여부
 * @param {string} noticeData.authorId - 작성자 ID
 * @returns {Promise<Object>} - 성공 시 문서 ID 반환
 */
export const createNotice = async (noticeData) => {
  try {
    const dataWithTimestamp = {
      title: noticeData.title,
      content: noticeData.content,
      category: noticeData.category || 'general',
      isImportant: noticeData.isImportant || false,
      authorId: noticeData.authorId,
      views: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      published: noticeData.published !== undefined ? noticeData.published : true
    };
    
    const docRef = await addDoc(collection(db, NOTICES_COLLECTION), dataWithTimestamp);
    
    return {
      success: true,
      id: docRef.id,
      message: '공지사항이 작성되었습니다.'
    };
  } catch (error) {
    console.error('Create notice error:', error);
    return {
      success: false,
      error: '공지사항 작성 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 모든 공지사항 조회
 * @param {number} maxResults - 최대 결과 수 (기본값: 20)
 * @param {boolean} publishedOnly - 발행된 공지만 조회 (기본값: true)
 * @returns {Promise<Object>} - 공지사항 목록 반환
 */
export const getAllNotices = async (maxResults = 20, publishedOnly = true) => {
  try {
    let q;
    
    if (publishedOnly) {
      q = query(
        collection(db, NOTICES_COLLECTION),
        where('published', '==', true),
        orderBy('isImportant', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
      );
    } else {
      q = query(
        collection(db, NOTICES_COLLECTION),
        orderBy('isImportant', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const notices = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notices.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        category: data.category,
        isImportant: data.isImportant,
        views: data.views || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        published: data.published
      });
    });
    
    return {
      success: true,
      notices: notices,
      count: notices.length
    };
  } catch (error) {
    console.error('Get notices error:', error);
    return {
      success: false,
      error: '공지사항 목록을 불러오는 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 특정 공지사항 조회
 * @param {string} noticeId - 공지사항 문서 ID
 * @param {boolean} incrementViews - 조회수 증가 여부 (기본값: true)
 * @returns {Promise<Object>} - 공지사항 데이터 반환
 */
export const getNoticeById = async (noticeId, incrementViews = true) => {
  try {
    const docRef = doc(db, NOTICES_COLLECTION, noticeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // 조회수 증가
      if (incrementViews && data.published) {
        await updateDoc(docRef, {
          views: (data.views || 0) + 1,
          updatedAt: Timestamp.now()
        });
        data.views = (data.views || 0) + 1;
      }
      
      return {
        success: true,
        notice: {
          id: docSnap.id,
          ...data
        }
      };
    } else {
      return {
        success: false,
        error: '공지사항을 찾을 수 없습니다.'
      };
    }
  } catch (error) {
    console.error('Get notice error:', error);
    return {
      success: false,
      error: '공지사항을 불러오는 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 공지사항 수정 (관리자용)
 * @param {string} noticeId - 공지사항 문서 ID
 * @param {Object} updateData - 수정할 데이터
 * @returns {Promise<Object>} - 성공 여부 반환
 */
export const updateNotice = async (noticeId, updateData) => {
  try {
    const docRef = doc(db, NOTICES_COLLECTION, noticeId);
    
    const dataToUpdate = {
      ...updateData,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(docRef, dataToUpdate);
    
    return {
      success: true,
      message: '공지사항이 수정되었습니다.'
    };
  } catch (error) {
    console.error('Update notice error:', error);
    return {
      success: false,
      error: '공지사항 수정 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 공지사항 삭제 (관리자용)
 * @param {string} noticeId - 공지사항 문서 ID
 * @returns {Promise<Object>} - 성공 여부 반환
 */
export const deleteNotice = async (noticeId) => {
  try {
    const docRef = doc(db, NOTICES_COLLECTION, noticeId);
    await deleteDoc(docRef);
    
    return {
      success: true,
      message: '공지사항이 삭제되었습니다.'
    };
  } catch (error) {
    console.error('Delete notice error:', error);
    return {
      success: false,
      error: '공지사항 삭제 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 카테고리별 공지사항 조회
 * @param {string} category - 카테고리
 * @param {number} maxResults - 최대 결과 수
 * @returns {Promise<Object>} - 공지사항 목록 반환
 */
export const getNoticesByCategory = async (category, maxResults = 20) => {
  try {
    const q = query(
      collection(db, NOTICES_COLLECTION),
      where('category', '==', category),
      where('published', '==', true),
      orderBy('isImportant', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );
    
    const querySnapshot = await getDocs(q);
    const notices = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notices.push({
        id: doc.id,
        ...data
      });
    });
    
    return {
      success: true,
      notices: notices,
      count: notices.length
    };
  } catch (error) {
    console.error('Get notices by category error:', error);
    return {
      success: false,
      error: '공지사항 목록을 불러오는 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};

/**
 * 중요 공지사항만 조회
 * @param {number} maxResults - 최대 결과 수
 * @returns {Promise<Object>} - 공지사항 목록 반환
 */
export const getImportantNotices = async (maxResults = 5) => {
  try {
    const q = query(
      collection(db, NOTICES_COLLECTION),
      where('isImportant', '==', true),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );
    
    const querySnapshot = await getDocs(q);
    const notices = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notices.push({
        id: doc.id,
        ...data
      });
    });
    
    return {
      success: true,
      notices: notices,
      count: notices.length
    };
  } catch (error) {
    console.error('Get important notices error:', error);
    return {
      success: false,
      error: '공지사항 목록을 불러오는 중 오류가 발생했습니다.',
      code: error.code
    };
  }
};


