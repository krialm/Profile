const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

startRoleRotator();
initParticleField();

function startRoleRotator() {
    const el = document.getElementById('role-rotator');
    if (!el || prefersReducedMotion) return;
    const words = ['agentic systems', 'RAG pipelines', 'inference at scale', 'production AI systems', 'LLM-powered products', 'developer tools', 'things that ship'];
    let i = 0;
    setInterval(() => {
        i = (i + 1) % words.length;
        el.style.opacity = 0;
        setTimeout(() => {
            el.textContent = words[i];
            el.style.opacity = 1;
        }, 300);
    }, 2600);
}

function initParticleField() {
    const canvas = document.getElementById('c-field');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero) return;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const accent = '198,255,74';
    const N = 90;
    let W = 0, H = 0;
    let points = [];
    const mouse = { x: -999, y: -999 };

    function resize() {
        const rect = hero.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!points.length) {
            for (let i = 0; i < N; i++) {
                points.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35
                });
            }
        }
    }

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
        mouse.x = -999;
        mouse.y = -999;
    });
    window.addEventListener('resize', resize);

    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (const p of points) {
            const dx = p.x - mouse.x, dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 140) {
                const f = (140 - dist) / 140 * 0.9;
                p.vx += dx / dist * f;
                p.vy += dy / dist * f;
            }
            p.vx *= 0.94;
            p.vy *= 0.94;
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            p.x = Math.max(0, Math.min(W, p.x));
            p.y = Math.max(0, Math.min(H, p.y));
        }
        for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) {
                const a = points[i], b = points[j];
                const dd = Math.hypot(a.x - b.x, a.y - b.y);
                if (dd < 120) {
                    ctx.strokeStyle = `rgba(${accent},${0.16 * (1 - dd / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        for (const p of points) {
            ctx.fillStyle = `rgba(${accent},.85)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }

    resize();
    draw();
}
