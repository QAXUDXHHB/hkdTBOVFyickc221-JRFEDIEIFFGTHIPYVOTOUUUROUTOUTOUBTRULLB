const output = document.getElementById('output');
const cursor = document.getElementById('cursor');
const imgBox = document.getElementById('imgBox');
const audioPlayer = document.getElementById('audioPlayer');
const blackScreen = document.getElementById('blackScreen');
const terminal = document.getElementById('terminal');
const fallCanvas = document.getElementById('fallTextCanvas');

let isDragging = false, textSystemInited = false, fallingTexts = [], lastTime = 0;
function playSound() {
    if (!MUSIC_CFG.enable) return;
    let idx = 0;

    function tryPlayUrl() {
        const src = idx === 0 ? MUSIC_CFG.url : MUSIC_CFG.backups[idx - 1];
        audioPlayer.src = src;
        audioPlayer.volume = MUSIC_CFG.volume;
        audioPlayer.loop = MUSIC_CFG.loop;

        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.addEventListener('click', unlockOnce, {once:true});
                document.addEventListener('touchstart', unlockOnce, {once:true});
                if (idx < MUSIC_CFG.backups.length) {
                    idx++;
                    setTimeout(tryPlayUrl, 100);
                }
            });
        }
    }

    function unlockOnce() {
        audioPlayer.play();
    }

    tryPlayUrl();
}

function initFallingTexts() {
    if (textSystemInited) return;
    textSystemInited = true;
    const W = window.innerWidth, H = window.innerHeight;
    const { speedY, speedX, spawnY, count, content } = TEXT_CFG;

    for (let i = 0; i < count; i++) {
        fallingTexts.push({
            x: Math.random() * W,
            y: spawnY[0] + Math.random() * (spawnY[1] - spawnY[0]),
            speedY: speedY[0] + Math.random() * (speedY[1] - speedY[0]),
            speedX: speedX[0] + Math.random() * (speedX[1] - speedX[0]),
            el: null
        });
    }

    fallCanvas.innerHTML = '';
    fallingTexts.forEach(ft => {
        const el = document.createElement('div');
        el.className = 'fall-text-item';
        el.textContent = content;
        el.style.transform = `translate(${ft.x}px, ${ft.y}px)`;
        fallCanvas.appendChild(el);
        ft.el = el;
    });
}

function updateTexts(t) {
    const dt = (t - lastTime) / 1000;
    lastTime = t;
    const W = window.innerWidth, H = window.innerHeight;
    const fs = TEXT_CFG.fontSize;

    fallingTexts.forEach(ft => {
        ft.y += ft.speedY * dt;
        ft.x += ft.speedX * dt;
        if (ft.y > H + fs + 10) {
            ft.y = spawnY[0] - Math.random() * (fs + 10);
            ft.x = Math.random() * W;
        }
        const show = ft.y > -fs && ft.y < H + fs;
        ft.el.style.display = show ? 'block' : 'none';
        show && (ft.el.style.transform = `translate(${ft.x}px, ${ft.y}px)`);
    });
    requestAnimationFrame(updateTexts);
}

window.addEventListener('load', () => {
    const d = document.documentElement;
    d.requestFullscreen?.() || d.webkitRequestFullscreen?.() || d.msRequestFullscreen?.();
});

imgBox.addEventListener('mousedown', startDrag);
imgBox.addEventListener('touchstart', startDrag);
document.addEventListener('mousemove', doDrag);
document.addEventListener('touchmove', doDrag);
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);
function startDrag(e) {
    isDragging = true;
    const p = e.type.includes('touch') ? e.touches[0] : e;
    startX = p.clientX; startY = p.clientY;
    initialX = imgBox.offsetLeft || innerWidth/2;
    initialY = imgBox.offsetTop || innerHeight/2;
    imgBox.style.transition = 'none';
    e.preventDefault();
}
function doDrag(e) {
    if (!isDragging) return;
    const p = e.type.includes('touch') ? e.touches[0] : e;
    imgBox.style.left = `${initialX + (p.clientX - startX)}px`;
    imgBox.style.top = `${initialY + (p.clientY - startY)}px`;
    e.preventDefault();
}
function endDrag() {
    isDragging = false;
    imgBox.style.transition = 'all 0.2s';
}

function print(text, cls='text-white') {
    const s = document.createElement('span');
    s.className = cls;
    s.textContent = text;
    output.appendChild(s);
    terminal.scrollTop = terminal.scrollHeight;
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function run() {
    await sleep(200);

    print("tr: write: Broken pipe\n\n");
    await sleep(400);

    print("███╗  ██╗███████╗███████╗███╗  ██╗██╗  ██╗██████╗ \n", 'text-cyan');
    await sleep(150);
    print("██╔██╗ ██║██╔════╝██╔════╝████╗ ██║██║  ██║██╔══██╗\n", 'text-green');
    await sleep(150);
    print("██║╚██╗██║█████╗  █████╗  ██╔██╗██║███████║██████╔╝\n", 'text-yellow');
    await sleep(150);
    print("██║ ╚████║██╔══╝  ██╔══╝  ██║╚████║██╔══██║██╔══██╗\n", 'text-red');
    await sleep(150);
    print("██║  ╚███║███████╗███████╗██║ ╚███║██║  ██║██████╔╝\n", 'text-purple');
    await sleep(150);
    print("╚═╝   ╚══╝╚══════╝╚══════╝╚═╝  ╚══╝╚═╝  ╚═╝╚═════╝ \n\n", 'text-green');
    await sleep(400);

    print("检测运行环境\n");
    await sleep(500);
    print("正在加载imgui\n");
    await sleep(500);
    print("调试创建成功\n");
    await sleep(500);
    print("正在渲染imgui\n");
    fallCanvas.style.display = 'block';
    initFallingTexts();
    requestAnimationFrame(updateTexts);
    playSound();
    await sleep(800);
    imgBox.style.display = 'block';

    print("调用成功! \n");
    for (let i=0; i<12; i++) {
        print("手机被入侵\n", 'text-red');
        await sleep(80);
    }
    print("\n");
    await sleep(500);
    print("执行失败!\n执行失败!\n", 'text-red');
    await sleep(300);
    print("【删除】已经删除 /sdcard/Download/ 目录\n", 'text-yellow');
    await sleep(100);
    print("【删除】已经删除 /sdcard/ 目录\n", 'text-yellow');
    await sleep(100);
    print("【删除】已经删除 /data/ 目录\n", 'text-yellow');
    await sleep(400);
    print("sdc#\n#\n");
    for (let i=1; i<=50; i++) {
        print(`【填充】成功写入 /dev/block/sdc${i}\n`, 'text-green');
        await sleep(100);
    }
    print("【填充】成功写入 /dev/block/sda\n", 'text-green');
    await sleep(100);
    print("【填充】成功写入 /dev/block/sdb\n", 'text-green');
    await sleep(400);

    print("【删除】已经删除 /acct/ 目录\n", 'text-yellow');
    await sleep(100);
    print("【删除】已经删除 /bin/ 目录\n", 'text-yellow');
    await sleep(100);
    print("【删除】已经删除 /proc/ 目录\n", 'text-yellow');
    await sleep(100);
    print("【删除】已经删除 /dev/block/ 目录\n", 'text-yellow');
    await sleep(1000);
    audioPlayer.pause();
    fallCanvas.style.display = 'none';
    blackScreen.style.display = 'block';
    cursor.style.display = 'none';
}
run();
