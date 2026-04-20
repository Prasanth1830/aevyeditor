// ===== AevyTV — Premium Animated Website =====
// Space canvas, flowing lines, scroll animations, counters

(function () {
    'use strict';

    // ===== SPACE CANVAS BACKGROUND =====
    const spaceCanvas = document.getElementById('spaceCanvas');
    const spaceCtx = spaceCanvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    let mouseX = 0, mouseY = 0;

    function resizeSpaceCanvas() {
        spaceCanvas.width = window.innerWidth;
        spaceCanvas.height = window.innerHeight;
    }

    function createStars(count) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * spaceCanvas.width,
                y: Math.random() * spaceCanvas.height,
                radius: Math.random() * 1.8 + 0.2,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
            });
        }
    }

    function createShootingStar() {
        if (shootingStars.length > 3) return;
        const angle = Math.random() * 0.5 + 0.2;
        shootingStars.push({
            x: Math.random() * spaceCanvas.width,
            y: 0,
            length: Math.random() * 80 + 40,
            speed: Math.random() * 8 + 4,
            angle: angle,
            opacity: 1,
            decay: Math.random() * 0.015 + 0.008,
        });
    }

    function drawSpace(time) {
        spaceCtx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);

        // Draw stars
        for (let star of stars) {
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5;
            const opacity = star.opacity * (0.4 + twinkle * 0.6);

            // Subtle parallax with mouse
            const px = star.x + (mouseX - spaceCanvas.width / 2) * star.radius * 0.01;
            const py = star.y + (mouseY - spaceCanvas.height / 2) * star.radius * 0.01;

            spaceCtx.beginPath();
            spaceCtx.arc(px, py, star.radius, 0, Math.PI * 2);
            spaceCtx.fillStyle = `rgba(200, 210, 255, ${opacity})`;
            spaceCtx.fill();

            // Glow for larger stars
            if (star.radius > 1.2) {
                spaceCtx.beginPath();
                spaceCtx.arc(px, py, star.radius * 3, 0, Math.PI * 2);
                const grad = spaceCtx.createRadialGradient(px, py, 0, px, py, star.radius * 3);
                grad.addColorStop(0, `rgba(150, 160, 255, ${opacity * 0.15})`);
                grad.addColorStop(1, 'transparent');
                spaceCtx.fillStyle = grad;
                spaceCtx.fill();
            }

            // Drift
            star.x += star.vx;
            star.y += star.vy;
            if (star.x < 0) star.x = spaceCanvas.width;
            if (star.x > spaceCanvas.width) star.x = 0;
            if (star.y < 0) star.y = spaceCanvas.height;
            if (star.y > spaceCanvas.height) star.y = 0;
        }

        // Draw shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const ss = shootingStars[i];
            const endX = ss.x - Math.cos(ss.angle) * ss.length;
            const endY = ss.y - Math.sin(ss.angle) * ss.length;

            const gradient = spaceCtx.createLinearGradient(ss.x, ss.y, endX, endY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
            gradient.addColorStop(1, 'transparent');

            spaceCtx.beginPath();
            spaceCtx.moveTo(ss.x, ss.y);
            spaceCtx.lineTo(endX, endY);
            spaceCtx.strokeStyle = gradient;
            spaceCtx.lineWidth = 1.5;
            spaceCtx.stroke();

            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.opacity -= ss.decay;

            if (ss.opacity <= 0 || ss.x > spaceCanvas.width + 100 || ss.y > spaceCanvas.height + 100) {
                shootingStars.splice(i, 1);
            }
        }

        requestAnimationFrame(drawSpace);
    }

    resizeSpaceCanvas();
    createStars(200);
    drawSpace(0);

    // Shooting star interval
    setInterval(createShootingStar, 3000);

    window.addEventListener('resize', () => {
        resizeSpaceCanvas();
        createStars(200);
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ===== CREATORS SECTION — WARP SPEED CANVAS =====
    const creatorsCanvas = document.getElementById('creatorsCanvas');
    if (creatorsCanvas) {
        const cCtx = creatorsCanvas.getContext('2d');
        let warpStars = [];

        function resizeCreatorsCanvas() {
            const parent = creatorsCanvas.parentElement;
            creatorsCanvas.width = parent.offsetWidth;
            creatorsCanvas.height = parent.offsetHeight;
        }

        function initWarpStars() {
            warpStars = [];
            const cx = creatorsCanvas.width / 2;
            const cy = creatorsCanvas.height / 2;
            for (let i = 0; i < 300; i++) {
                warpStars.push({
                    x: Math.random() * creatorsCanvas.width - cx,
                    y: Math.random() * creatorsCanvas.height - cy,
                    z: Math.random() * 1500 + 100,
                    pz: 0,
                    color: `hsl(${240 + Math.random() * 60}, 70%, ${60 + Math.random() * 30}%)`,
                });
            }
        }

        function drawWarp() {
            cCtx.fillStyle = 'rgba(10, 10, 18, 0.15)';
            cCtx.fillRect(0, 0, creatorsCanvas.width, creatorsCanvas.height);

            const cx = creatorsCanvas.width / 2;
            const cy = creatorsCanvas.height / 2;
            const speed = 3;

            for (let star of warpStars) {
                star.pz = star.z;
                star.z -= speed;

                if (star.z <= 0) {
                    star.x = Math.random() * creatorsCanvas.width - cx;
                    star.y = Math.random() * creatorsCanvas.height - cy;
                    star.z = 1500;
                    star.pz = star.z;
                }

                const sx = (star.x / star.z) * cx + cx;
                const sy = (star.y / star.z) * cy + cy;
                const px = (star.x / star.pz) * cx + cx;
                const py = (star.y / star.pz) * cy + cy;

                const size = Math.max(0, (1 - star.z / 1500) * 3);
                const opacity = Math.max(0, 1 - star.z / 1500);

                cCtx.beginPath();
                cCtx.moveTo(px, py);
                cCtx.lineTo(sx, sy);
                cCtx.strokeStyle = star.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
                cCtx.lineWidth = size;
                cCtx.stroke();

                cCtx.beginPath();
                cCtx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
                cCtx.fillStyle = `rgba(200, 210, 255, ${opacity})`;
                cCtx.fill();
            }

            requestAnimationFrame(drawWarp);
        }

        resizeCreatorsCanvas();
        initWarpStars();
        drawWarp();

        window.addEventListener('resize', () => {
            resizeCreatorsCanvas();
            initWarpStars();
        });
    }

    // ===== IMPACT SECTION — FLOWING ENERGY LINES =====
    const impactCanvas = document.getElementById('impactCanvas');
    if (impactCanvas) {
        const iCtx = impactCanvas.getContext('2d');
        let flowLines = [];

        function resizeImpactCanvas() {
            impactCanvas.width = impactCanvas.parentElement.offsetWidth;
            impactCanvas.height = impactCanvas.parentElement.offsetHeight;
        }

        function createFlowLines() {
            flowLines = [];
            for (let i = 0; i < 40; i++) {
                const points = [];
                const y = Math.random() * impactCanvas.height;
                const numPoints = 8;
                for (let j = 0; j < numPoints; j++) {
                    points.push({
                        x: (impactCanvas.width / (numPoints - 1)) * j,
                        y: y + (Math.random() - 0.5) * 100,
                        oy: y + (Math.random() - 0.5) * 100,
                        amplitude: Math.random() * 60 + 20,
                        frequency: Math.random() * 0.02 + 0.005,
                        phase: Math.random() * Math.PI * 2,
                    });
                }

                const hue = 260 + Math.random() * 60;
                flowLines.push({
                    points,
                    color: `hsla(${hue}, 70%, 60%, ${Math.random() * 0.3 + 0.1})`,
                    width: Math.random() * 2 + 0.5,
                    speed: Math.random() * 0.02 + 0.01,
                });
            }
        }

        function drawFlowLines(time) {
            iCtx.clearRect(0, 0, impactCanvas.width, impactCanvas.height);

            for (let line of flowLines) {
                iCtx.beginPath();
                const pts = line.points;

                for (let p of pts) {
                    p.phase += line.speed;
                    p.y = p.oy + Math.sin(p.phase) * p.amplitude;
                }

                iCtx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < pts.length - 1; i++) {
                    const xc = (pts[i].x + pts[i + 1].x) / 2;
                    const yc = (pts[i].y + pts[i + 1].y) / 2;
                    iCtx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
                }
                const last = pts[pts.length - 1];
                iCtx.lineTo(last.x, last.y);

                iCtx.strokeStyle = line.color;
                iCtx.lineWidth = line.width;
                iCtx.stroke();
            }

            requestAnimationFrame(drawFlowLines);
        }

        resizeImpactCanvas();
        createFlowLines();
        drawFlowLines(0);

        window.addEventListener('resize', () => {
            resizeImpactCanvas();
            createFlowLines();
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== SCROLL REVEAL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
            }
        });
    }, observerOptions);

    // Observe creator cards
    document.querySelectorAll('.creator-card').forEach(card => {
        revealObserver.observe(card);
    });

    // Observe step items
    document.querySelectorAll('.step-item').forEach((item, i) => {
        item.dataset.delay = i * 150;
        revealObserver.observe(item);
    });

    // General fade-in-up elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        revealObserver.observe(el);
    });

    // ===== COUNTER ANIMATION =====
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.impact-number').forEach(num => {
        counterObserver.observe(num);
    });

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.floor(easedProgress * target);

            el.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== CURSOR GLOW (desktop) =====
    if (window.matchMedia('(hover: hover)').matches) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ===== RECRUITER CARD TILT EFFECT =====
    document.querySelectorAll('.recruiter-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===== WHY CARD HOVER GLOW =====
    document.querySelectorAll('.why-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(99, 91, 255, 0.04) 0%, white 60%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = 'white';
        });
    });

    // ===== IMPACT CARD HOVER GLOW =====
    document.querySelectorAll('.impact-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(99, 91, 255, 0.08) 0%, rgba(255,255,255,0.03) 60%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = 'rgba(255, 255, 255, 0.03)';
        });
    });

    // ===== MAGNETIC BUTTON EFFECT =====
    document.querySelectorAll('.btn-hero, .btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ===== PARALLAX HERO ORBS =====
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const orbs = document.querySelectorAll('.hero-gradient-orb');
        orbs.forEach((orb, i) => {
            const speed = 0.3 + i * 0.1;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // ===== TEXT TYPING EFFECT FOR HERO (subtle) =====
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Add visible class after a slight delay for a polished feel
        setTimeout(() => {
            heroTitle.style.opacity = '1';
        }, 200);
    }

})();
