document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (mobileNavToggle && navList) {
        mobileNavToggle.addEventListener('click', () => {
            navList.classList.toggle('active');

            const bars = mobileNavToggle.querySelectorAll('.bar');
            if (navList.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    document.querySelectorAll('.nav-list a').forEach((link) => {
        link.addEventListener('click', () => {
            if (!navList || !mobileNavToggle || !navList.classList.contains('active')) {
                return;
            }

            navList.classList.remove('active');
            const bars = mobileNavToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            const header = document.querySelector('.main-header');
            if (targetElement && header) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach((el) => {
        fadeObserver.observe(el);
    });

    const animateCounter = (element) => {
        const target = Number(element.dataset.counter || 0);
        const duration = 1800;
        const start = performance.now();

        const formatValue = (value) => new Intl.NumberFormat().format(Math.round(value));

        const tick = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = formatValue(target * eased);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                element.textContent = formatValue(target);
            }
        };

        requestAnimationFrame(tick);
    };

    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.55 });

        counters.forEach((counter) => counterObserver.observe(counter));
    }

    const comparisonRoot = document.querySelector('[data-comparison]');
    if (comparisonRoot) {
        const range = comparisonRoot.querySelector('[data-comparison-range]');
        if (range) {
            const updateComparison = () => {
                comparisonRoot.style.setProperty('--comparison-position', `${range.value}%`);
            };

            range.addEventListener('input', updateComparison);
            updateComparison();
        }
    }
});
