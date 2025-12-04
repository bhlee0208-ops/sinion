// 헤더 고정 해제 스크립트 (768px 이상)
(function() {
    function removeStickyHeader() {
        if (window.innerWidth >= 768) {
            const headers = document.querySelectorAll('.header--sticky.sticky, header.header--sticky.sticky, header.header-one.header--sticky.sticky');
            headers.forEach(function(header) {
                header.style.position = 'relative';
                header.style.top = 'auto';
                header.style.left = 'auto';
                header.style.right = 'auto';
                header.style.bottom = 'auto';
                header.style.transform = 'none';
            });
        }
    }
    
    // 페이지 로드 시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            removeStickyHeader();
            // 스크롤 이벤트 리스너 추가 (sticky 클래스가 추가되는 것을 방지)
            let scrollTimeout;
            window.addEventListener('scroll', function() {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    if (window.innerWidth >= 768) {
                        removeStickyHeader();
                    }
                }, 10);
            }, { passive: true });
        });
    } else {
        removeStickyHeader();
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                if (window.innerWidth >= 768) {
                    removeStickyHeader();
                }
            }, 10);
        }, { passive: true });
    }
    
    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', function() {
        removeStickyHeader();
    }, { passive: true });
})();


