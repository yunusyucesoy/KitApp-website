/**
 * KITAPP - MAIN JAVASCRIPT
 * Modern ve Responsive Landing Page İşlevselliği
 */

(function() {
    'use strict';

    // ============================================
    // 1. TEMA DEĞİŞTİRME
    // ============================================
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        if (!themeToggle) return;
        
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
        });
    }

    // ============================================
    // 2. SCROLL ANİMASYONLARI (Fade In)
    // ============================================
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in-section').forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // 3. S.S.S. (FAQ) AKORDİYON
    // ============================================
    function initFAQAccordion() {
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const isActive = btn.classList.contains('active');
                const answer = btn.nextElementSibling;
                
                // Tüm diğer FAQ'ları kapat
                document.querySelectorAll('.faq-question').forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        otherBtn.classList.remove('active');
                        otherBtn.nextElementSibling.style.maxHeight = 0;
                    }
                });
                
                // Mevcut FAQ'yı aç/kapat
                if (isActive) {
                    btn.classList.remove('active');
                    answer.style.maxHeight = 0;
                } else {
                    btn.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    }

    // ============================================
    // 4. YOL HARİTASI (ROADMAP) SCROLL ANİMASYONU
    // ============================================
    function initRoadmapAnimation() {
        const roadmapSection = document.getElementById('roadmap');
        const progressLine = document.querySelector('.roadmap-progress');
        const stepCards = document.querySelectorAll('.step-card');

        if (!roadmapSection || !progressLine) return;

        function updateRoadmap() {
            const sectionTop = roadmapSection.offsetTop;
            const sectionHeight = roadmapSection.offsetHeight;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Roadmap ekranda görünür olduğunda
            if (scrollY + windowHeight > sectionTop) {
                const start = sectionTop - windowHeight / 1.5;
                
                let percent = (scrollY - start) / (sectionHeight * 0.8);
                percent = Math.max(0, Math.min(1, percent));

                progressLine.style.height = `${percent * 100}%`;

                // Çizgi ilerledikçe kartları 'active' yap
                const currentLineBottom = sectionTop + (sectionHeight * percent);

                stepCards.forEach(card => {
                    const cardTop = card.getBoundingClientRect().top + window.scrollY;
                    
                    if (currentLineBottom > cardTop - 50) { 
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });
            }
        }

        // Throttle ile performans optimizasyonu
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateRoadmap();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ============================================
    // 5. MODAL (POP-UP) YÖNETİMİ
    // ============================================
    function initModal() {
        const modal = document.getElementById('package-modal');
        const modalBody = document.getElementById('modal-body');
        const closeBtn = document.getElementById('modal-close-btn');

        if (!modal || !modalBody) return;

        // Modal açma
        document.querySelectorAll('.cta-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.pricing-card') || btn.closest('.feature-box');
                
                if (card) {
                    const title = card.querySelector('h3')?.innerText || 'Paket Detayları';
                    const list = card.querySelector('ul')?.innerHTML || '';
                    
                    modalBody.innerHTML = `<h3>${title}</h3><ul>${list}</ul>`;
                    modal.classList.add('active');
                }
            });
        });

        // Modal kapatma
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Modal dışına tıklayınca kapat
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // ESC tuşu ile kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    // ============================================
    // 6. SMOOTH SCROLL (Yumuşak Kaydırma)
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // 7. SAYFA YÜKLENDİĞİNDE TÜM FONKSİYONLARI BAŞLAT
    // ============================================
    function init() {
        initThemeToggle();
        initScrollAnimations();
        initFAQAccordion();
        initRoadmapAnimation();
        initModal();
        initSmoothScroll();
    }

    // DOM hazır olduğunda başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
