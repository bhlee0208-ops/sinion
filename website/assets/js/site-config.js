// 사이트 설정 - 도메인 변경 시 이 파일만 수정하면 됩니다
const SITE_CONFIG = {
  // 배포 도메인 (도메인 변경 시 여기만 수정)
  domain: 'https://sinion.vercel.app',
  
  // 사이트 정보
  siteName: '시니온(SINION)',
  defaultTitle: '시니온(SINION) - 시니어 전문 교육 프로그램',
  defaultDescription: '시니온(SINION) - 시니어 전문 교육 브랜드. 시니어의 삶에 따뜻한 빛과 기억을 다시 켜드리는 전문 교육 프로그램 및 케어 서비스를 제공합니다.',
  logoImage: '/assets/images/logo/logo.png'
};

// 페이지별 설정 (필요시 확장 가능)
const PAGE_CONFIG = {
  'index.html': {
    url: '/',
    title: '시니온(SINION) - 시니어 전문 교육 프로그램',
    description: '시니온(SINION) - 시니어 전문 교육 브랜드. 시니어의 삶에 따뜻한 빛과 기억을 다시 켜드리는 전문 교육 프로그램 및 케어 서비스를 제공합니다.'
  },
  'login.html': {
    url: '/login.html',
    title: '시니온(SINION) - 로그인',
    description: '시니온(SINION) - 로그인. 시니어 전문 교육 프로그램 회원 로그인'
  },
  'register.html': {
    url: '/register.html',
    title: '시니온(SINION) - 회원가입',
    description: '시니온(SINION) - 회원가입. 시니어 전문 교육 프로그램 회원가입'
  },
  'news.html': {
    url: '/news.html',
    title: '시니온(SINION) - 시니온 소식',
    description: '시니온(SINION) - 시니온 소식. 공지사항과 포토갤러리를 통해 시니온의 최신 소식과 교육 프로그램 활동을 확인하실 수 있습니다.'
  },
  'academy.html': {
    url: '/academy.html',
    title: '교육 아카데미 - 시니온(SINION)',
    description: '시니온(SINION) - 교육 아카데미. 시니어 전문 강사 자격증 취득 프로그램'
  },
  'program.html': {
    url: '/program.html',
    title: '프로그램 - 시니온(SINION)',
    description: '시니온(SINION) - 프로그램. 추억음악, 회상미술, 신체활동, 감정회상 프로그램'
  },
  'program-art.html': {
    url: '/program-art.html',
    title: '회상미술 프로그램 - 시니온(SINION)',
    description: '시니온(SINION) - 회상미술 프로그램'
  },
  'program-music.html': {
    url: '/program-music.html',
    title: '추억음악 프로그램 - 시니온(SINION)',
    description: '시니온(SINION) - 추억음악 프로그램'
  },
  'program-physical.html': {
    url: '/program-physical.html',
    title: '신체활동 프로그램 - 시니온(SINION)',
    description: '시니온(SINION) - 신체활동 프로그램'
  },
  'program-emotion.html': {
    url: '/program-emotion.html',
    title: '감정회상 프로그램 - 시니온(SINION)',
    description: '시니온(SINION) - 감정회상 프로그램'
  },
  'contact.html': {
    url: '/contact.html',
    title: '문의하기 - 시니온(SINION)',
    description: '시니온(SINION) - 문의하기'
  },
  'education.html': {
    url: '/education.html',
    title: '교육신청문의 - 시니온(SINION)',
    description: '시니온(SINION) - 교육신청문의'
  }
};

// 현재 페이지 파일명 가져오기
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  return filename === '' ? 'index.html' : filename;
}

// 메타 태그 업데이트 함수
function updateMetaTags() {
  const currentPage = getCurrentPage();
  const pageConfig = PAGE_CONFIG[currentPage] || PAGE_CONFIG['index.html'];
  
  const fullUrl = SITE_CONFIG.domain + pageConfig.url;
  const imageUrl = SITE_CONFIG.domain + SITE_CONFIG.logoImage;
  
  // Open Graph 메타 태그 업데이트
  updateMetaTag('property', 'og:url', fullUrl);
  updateMetaTag('property', 'og:title', pageConfig.title);
  updateMetaTag('property', 'og:description', pageConfig.description);
  updateMetaTag('property', 'og:image', imageUrl);
  updateMetaTag('property', 'og:site_name', SITE_CONFIG.siteName);
  
  // Twitter 메타 태그 업데이트
  updateMetaTag('name', 'twitter:url', fullUrl);
  updateMetaTag('name', 'twitter:title', pageConfig.title);
  updateMetaTag('name', 'twitter:description', pageConfig.description);
  updateMetaTag('name', 'twitter:image', imageUrl);
  
  // Canonical URL 업데이트
  updateCanonical(fullUrl);
}

// 메타 태그 업데이트 헬퍼 함수
function updateMetaTag(attr, value, content) {
  let meta = document.querySelector(`meta[${attr}="${value}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, value);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

// Canonical URL 업데이트
function updateCanonical(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

// JSON-LD 구조화된 데이터 업데이트 (index.html에만 있음)
function updateStructuredData() {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (script) {
    try {
      const data = JSON.parse(script.textContent);
      if (data.url) {
        data.url = SITE_CONFIG.domain;
      }
      if (data.logo) {
        data.logo = SITE_CONFIG.domain + SITE_CONFIG.logoImage;
      }
      script.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      console.warn('Failed to update structured data:', e);
    }
  }
}

// 페이지 로드 시 메타 태그 및 구조화된 데이터 업데이트
function initializeSiteConfig() {
  updateMetaTags();
  updateStructuredData();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSiteConfig);
} else {
  initializeSiteConfig();
}

