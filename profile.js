/**
 * 개발자 김민수 자기소개서 — Brittany Chiang 스타일 스크립트 (profile.js)
 */

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------------
    // 1. 마우스 커서 스포트라이트 (Spotlight Effect)
    // -------------------------------------------------------------------------
    const spotlight = document.getElementById('spotlight');

    if (spotlight) {
        window.addEventListener('pointermove', (e) => {
            const { clientX, clientY } = e;
            spotlight.style.background = `radial-gradient(600px circle at ${clientX}px ${clientY}px, rgba(29, 78, 216, 0.15), transparent 80%)`;
        }, { passive: true });
    }

    // -------------------------------------------------------------------------
    // 2. 스크롤 스파이 (Scroll-Spy) & Indicator Line 연동
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 180; // 상단 오프셋 계산

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navItems.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // 페이지 최상단일 때 첫 번째(ABOUT) 활성화
        if (window.scrollY < 120 && navItems.length > 0) {
            navItems.forEach((link, idx) => {
                if (idx === 0) link.classList.add('active');
                else link.classList.remove('active');
            });
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // -------------------------------------------------------------------------
    // 3. 연락처 클립보드 복사 & 토스트 메시지
    // -------------------------------------------------------------------------
    const copyEmailBtn = document.getElementById('btn-copy-email');
    const toast = document.getElementById('toast');
    let toastTimer = null;

    function triggerToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = 'minsoo.kim.dev@example.com';
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const temp = document.createElement('input');
                    temp.value = email;
                    document.body.appendChild(temp);
                    temp.select();
                    document.execCommand('copy');
                    document.body.removeChild(temp);
                }
                triggerToast('📋 이메일(' + email + ')이 클립보드에 복사되었습니다!');
            } catch (err) {
                triggerToast('📋 이메일 주소: ' + email);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 4. 인쇄 및 PDF 저장 핸들러
    // -------------------------------------------------------------------------
    const printBtn = document.getElementById('btn-print');
    const printCtaBtn = document.getElementById('btn-print-cta');

    const handlePrint = () => {
        window.print();
    };

    if (printBtn) printBtn.addEventListener('click', handlePrint);
    if (printCtaBtn) printCtaBtn.addEventListener('click', handlePrint);
});
