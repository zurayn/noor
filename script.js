// script.js - COMPLETE FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startBtn = document.getElementById('start-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const restartBtn = document.getElementById('restart-btn');
    const responseText = document.getElementById('response-text');
    const backButton = document.getElementById('back-to-question');
    
    const introScreen = document.getElementById('intro-screen');
    const questionScreen = document.getElementById('question-screen');
    const yesScreen = document.getElementById('yes-screen');
    const secretScreen = document.getElementById('secret-screen');
    
    const heartsContainer = document.querySelector('.hearts-container');
    const confettiContainer = document.querySelector('.confetti-container');
    
    // State
    let noClickCount = 0;
    let isNoButtonMoving = false;
    let noButtonMoveInterval;
    let lastInteraction = Date.now();

    // === CHAT SYSTEM ===
    let chatTimeouts = [];
    let currentStep = 0;
    let userChoices = [];
    let originalNoClickCount = 0;

    // === SECRET MODE ===
    let isSecretModeActive = false;
    let secretTypingTimeout = null;
    let lastShakeTime = 0;
    let isTypingCancelled = false;
    let shakeReadings = [];          // for improved shake detection

    // ========== CHAT STORY (unchanged, identical to original) ==========
    const chatStory = { /* ... (same as provided) ... */ };
    // (content omitted for brevity – use the same as in original script.js)

    // ========== INIT ==========
    function initPage() {
        createBackgroundHearts();
        introScreen.classList.add('active');
    }
    initPage();

    function createBackgroundHearts() { /* same as original */ }

    // ========== NAVIGATION ==========
    function showQuestionScreen() {
        introScreen.classList.remove('active');
        questionScreen.classList.add('active');
        resetNoButton();
        responseText.textContent = "Choose wisely bbg... 😼";
    }

    // ========== YES BUTTON ==========
    function handleYesClick() {
        resetNoButton();                    // stop NO movement
        originalNoClickCount = noClickCount; // store NO count
        
        createHeartBurst();
        createConfetti();
        if (typeof createStickers === 'function') createStickers();
        
        const responses = [
            "Yay! I knew it! 😼❤️",
            "Ayo fr?? You're not lying right? 😂",
            "Even White Coat Man approves! (maybe) 😾",
            "bbg energy confirmed! ✌️",
            "Hatt! For real? 😭❤️"
        ];
        responseText.textContent = responses[Math.floor(Math.random() * responses.length)];
        
        setTimeout(() => {
            questionScreen.classList.remove('active');
            yesScreen.classList.add('active');
            setTimeout(initChatStory, 500);
        }, 800);
    }

    // ========== NO BUTTON ==========
    function handleNoClick() {
        noClickCount++;
        const sadResponses = [ /* ... */ ];
        responseText.textContent = sadResponses[Math.floor(Math.random() * sadResponses.length)];
        
        if (noClickCount === 1) {
            noBtn.classList.add('moving');
            setTimeout(() => {
                isNoButtonMoving = true;
                startNoButtonMovement();
            }, 500);
        }
    }

    function startNoButtonMovement() { /* same as original */ }
    function resetNoButton() { /* same as original */ }

    // ========== CHAT FUNCTIONS ==========
    function resetChatState() {
        chatTimeouts.forEach(clearTimeout);
        chatTimeouts = [];
        currentStep = 0;
        userChoices = [];
        const chatDisplay = document.getElementById('chat-display');
        const optionsContainer = document.getElementById('options-container');
        if (chatDisplay) chatDisplay.innerHTML = '';
        if (optionsContainer) optionsContainer.innerHTML = '';
    }

    function initChatStory() {
        resetChatState();
        const chatDisplay = document.getElementById('chat-display');
        const optionsContainer = document.getElementById('options-container');
        const ratingOverlay = document.getElementById('rating-overlay');
        if (!chatDisplay || !optionsContainer) return;
        
        document.querySelector('.chat-story-container').style.display = 'flex';
        ratingOverlay.style.display = 'none';
        
        const timer = setTimeout(() => processStep(0), 1000);
        chatTimeouts.push(timer);
    }

    function processStep(stepId) { /* same as original (with timer tracking) */ }
    function addMessage(sender, text, typingSpeed = 40) { /* same as original typing effect */ }
    function showOptions(options) { /* same */ }
    function showTypingIndicator(show) { /* same */ }
    function addNoCountReference() { /* same */ }

    // ========== END CHAT – NOW 3 SECONDS ==========
    function endChatStory() {
        const timer = setTimeout(() => {
            const chatContainer = document.querySelector('.chat-story-container');
            chatContainer.style.opacity = '0';
            chatContainer.style.transform = 'scale(0.95)';
            setTimeout(() => {
                chatContainer.style.display = 'none';
                document.getElementById('rating-overlay').style.display = 'flex';
                personalizeRatingMessage();
                setTimeout(() => {
                    const secretHint = document.getElementById('secret-hint-container');
                    if (secretHint) secretHint.classList.add('show');
                }, 2000);
            }, 500);
        }, 3000); // FIXED: changed from 5000 to 3000
        chatTimeouts.push(timer);
    }

    function personalizeRatingMessage() { /* same */ }

    // ========== ANIMATIONS ==========
    function createHeartBurst() { /* same */ }
    function createConfetti() { /* same */ }
    function createStickers() { /* same */ }

    // ========== RESTART ==========
    function restartExperience() {
        yesScreen.classList.remove('active');
        introScreen.classList.add('active');
        document.getElementById('secret-hint-container')?.classList.remove('show');
        document.querySelector('.chat-story-container').style.display = 'flex';
        document.querySelector('.chat-story-container').style.opacity = '1';
        document.querySelector('.chat-story-container').style.transform = 'scale(1)';
        document.getElementById('rating-overlay').style.display = 'none';
        document.querySelector('.stickers-container').innerHTML = '';
        resetChatState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ========== RATING STARS ==========
    document.querySelectorAll('.star').forEach((star, index) => {
        star.addEventListener('click', function() {
            // ... same as original
        });
    });

    // ========== AUTO-SCROLL (once) ==========
    function setupAutoScroll() {
        const chatDisplay = document.getElementById('chat-display');
        if (!chatDisplay || chatDisplay.parentElement.querySelector('.scroll-indicator')) return;
        // ... same as original
    }
    setupAutoScroll();

    // ========== RANDOM TEASER ==========
    setInterval(() => {
        if (questionScreen.classList.contains('active') && Date.now() - lastInteraction > 5000) {
            const teasers = [ /* ... */ ];
            document.querySelector('.tease-text').textContent = teasers[Math.floor(Math.random() * teasers.length)];
        }
    }, 8000);
    document.addEventListener('click', () => { lastInteraction = Date.now(); });

    // ========== EVENT LISTENERS ==========
    startBtn.addEventListener('click', showQuestionScreen);
    yesBtn.addEventListener('click', handleYesClick);
    noBtn.addEventListener('click', handleNoClick);
    restartBtn.addEventListener('click', restartExperience);
    if (backButton) {
        backButton.addEventListener('click', function() {
            resetChatState();
            restartExperience();
        });
    }

    // ============ ENHANCED SECRET MODE ============
    const typedText = document.getElementById('typed-text');
    const okayBtn = document.getElementById('okay-btn');
    
    if (secretScreen && okayBtn && typedText) {
        const secretMessage = `I joke a lot, but genuinely talking to you feels easy, hazyyy.
Our chats are never planned, never serious on purpose, but somehow they fit into my day naturally.
You're the first notification I see and the last one before the day ends, and yeah, that quietly makes a difference.

This site, the jokes, the chaos... it's just a small, coded way of saying you matter to me as a friend, more than you probably realize. ❤️

Okay, stopping here before this gets awkward. 😂✌️`;

        function createSecretBackground() { /* same */ }

        // ----- TYPING with button delay after completion -----
        function typeMessage() {
            if (secretTypingTimeout) clearTimeout(secretTypingTimeout);
            isTypingCancelled = false;
            typedText.innerHTML = '';
            
            // Hide button until typing finishes + delay
            okayBtn.classList.remove('show');
            
            let charIndex = 0;
            let lineIndex = 0;
            
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) typingIndicator.style.display = 'flex';
            
            function typeNextChar() {
                if (isTypingCancelled) return;
                
                if (charIndex < secretMessage.length) {
                    const currentChar = secretMessage[charIndex];
                    if (currentChar === '\n') {
                        typedText.innerHTML += '<br>';
                        lineIndex++;
                        charIndex++;
                        secretTypingTimeout = setTimeout(typeNextChar, 100);
                    } else {
                        // ... character insertion ...
                        typedText.innerHTML += currentChar;
                        charIndex++;
                        
                        // auto-scroll
                        const secretTextDiv = document.querySelector('.secret-text');
                        if (secretTextDiv) secretTextDiv.scrollTo({ top: secretTextDiv.scrollHeight, behavior: 'smooth' });
                        
                        let speed = 40;
                        if (/[.,;!?\n]/.test(currentChar)) speed = 70;
                        else if (currentChar === ' ') speed = 20;
                        else speed = 40 + Math.random() * 20;
                        
                        secretTypingTimeout = setTimeout(typeNextChar, speed);
                    }
                } else {
                    // Typing finished
                    if (typingIndicator) {
                        typingIndicator.style.opacity = '0';
                        setTimeout(() => { typingIndicator.style.display = 'none'; }, 300);
                    }
                    
                    typedText.innerHTML += `<span class="typing-complete"> 💫</span>`;
                    
                    // FIXED: wait 3 seconds, THEN show button
                    setTimeout(() => {
                        if (!isTypingCancelled) {
                            okayBtn.classList.add('show');
                            // subtle flash effect
                            const flash = document.createElement('div');
                            flash.className = 'secret-mode-flash';
                            document.body.appendChild(flash);
                            setTimeout(() => flash.remove(), 600);
                        }
                    }, 3000); // 3 seconds after typing ends
                }
            }
            typeNextChar();
        }

        // ----- OK button -----
        okayBtn.addEventListener('click', function() {
            isTypingCancelled = true;
            if (secretTypingTimeout) clearTimeout(secretTypingTimeout);
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 200);
            
            secretScreen.style.opacity = '0';
            secretScreen.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                secretScreen.classList.remove('active');
                introScreen.classList.add('active');
                isSecretModeActive = false;
                document.body.style.overflow = ''; // restore scroll
                secretScreen.style.opacity = '';
                secretScreen.style.transform = '';
            }, 300);
        });

        // ----- IMPROVED SHAKE DETECTION (threshold raised) -----
        const SHAKE_THRESHOLD = 45;       // much harder shake required
        const SHAKE_COOLDOWN = 1800;      // 1.8 seconds
        const SHAKE_SAMPLE_SIZE = 3;      // need 3 strong shakes in short period

        function handleShake(event) {
            if (isSecretModeActive) return;
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;
            
            const x = acc.x || 0, y = acc.y || 0, z = acc.z || 0;
            const magnitude = Math.sqrt(x*x + y*y + z*z);
            const now = Date.now();
            
            // store recent readings
            shakeReadings.push({ mag: magnitude, time: now });
            shakeReadings = shakeReadings.filter(r => now - r.time < 300); // last 300ms
            
            const strongShakes = shakeReadings.filter(r => r.mag > SHAKE_THRESHOLD).length;
            
            if (strongShakes >= SHAKE_SAMPLE_SIZE && (now - lastShakeTime) > SHAKE_COOLDOWN) {
                lastShakeTime = now;
                shakeReadings = [];
                
                if (navigator.vibrate) navigator.vibrate(50);
                
                // visual feedback
                document.body.style.transform = 'translateX(8px)';
                setTimeout(() => {
                    document.body.style.transform = 'translateX(-8px)';
                    setTimeout(() => document.body.style.transform = '', 60);
                }, 60);
                
                activateSecretMode();
            }
        }

        function activateSecretMode() {
            if (isSecretModeActive) return;
            isSecretModeActive = true;
            shakeReadings = [];
            createSecretBackground();
            
            // lock body scroll
            document.body.style.overflow = 'hidden';
            
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen) {
                activeScreen.style.opacity = '0';
                activeScreen.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    activeScreen.classList.remove('active');
                    activeScreen.style.opacity = '';
                    activeScreen.style.transform = '';
                }, 300);
            }
            
            secretScreen.style.opacity = '0';
            secretScreen.style.transform = 'scale(0.9)';
            secretScreen.classList.add('active');
            
            setTimeout(() => {
                secretScreen.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                secretScreen.style.opacity = '1';
                secretScreen.style.transform = 'scale(1)';
            }, 10);
            
            setTimeout(typeMessage, 800);
        }

        // iOS permission
        if (window.DeviceMotionEvent) {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                function requestPermissionOnce() {
                    DeviceMotionEvent.requestPermission()
                        .then(state => { if (state === 'granted') window.addEventListener('devicemotion', handleShake); })
                        .catch(console.error);
                    document.removeEventListener('click', requestPermissionOnce);
                }
                document.addEventListener('click', requestPermissionOnce);
            } else {
                window.addEventListener('devicemotion', handleShake);
            }
        }

        // Desktop fallback
        document.addEventListener('keydown', function(e) {
            if ((e.key === 's' || e.key === 'S') && !isSecretModeActive) {
                e.preventDefault();
                activateSecretMode();
            }
        });
    }

    // ========== SECRET HINT (mobile/desktop) ==========
    const secretHintContainer = document.getElementById('secret-hint-container');
    function isMobileDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }
    if (secretHintContainer) {
        yesScreen.addEventListener('animationstart', function() {
            setTimeout(() => {
                const hintText = secretHintContainer.querySelector('.secret-hint-desc');
                const hintSub = secretHintContainer.querySelector('.secret-hint-sub');
                if (isMobileDevice()) {
                    hintText.innerHTML = "Try shaking your phone for a secret message from Zurayn...";
                } else {
                    hintText.innerHTML = "Press the <strong>'S' key</strong> for a secret message from Zurayn...";
                    if (hintSub) hintSub.innerHTML = "(Or just pretend to shake your laptop 😂)";
                }
            }, 1000);
        });
    }

    // ========== ADDITIONAL SECRET MODE CSS (flash) ==========
    const style = document.createElement('style');
    style.textContent = `
        .secret-mode-flash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 80%);
            pointer-events: none;
            z-index: 10000;
            animation: flashFade 0.6s ease-out;
        }
        @keyframes flashFade { from { opacity: 1; } to { opacity: 0; } }
    `;
    document.head.appendChild(style);
});