// script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startBtn = document.getElementById('start-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const restartBtn = document.getElementById('restart-btn');
    const responseText = document.getElementById('response-text');
    
    // Screens
    const introScreen = document.getElementById('intro-screen');
    const questionScreen = document.getElementById('question-screen');
    const yesScreen = document.getElementById('yes-screen');
    
    // Containers
    const heartsContainer = document.querySelector('.hearts-container');
    const confettiContainer = document.querySelector('.confetti-container');
    
    // State variables
    let noClickCount = 0;
    let isNoButtonMoving = false;
    let noButtonMoveInterval;
    let hasShownStickers = false;
    
    // Initialize the page
    initPage();
    
    // Event Listeners
    startBtn.addEventListener('click', showQuestionScreen);
    yesBtn.addEventListener('click', handleYesClick);
    noBtn.addEventListener('click', handleNoClick);
    restartBtn.addEventListener('click', restartExperience);
    
    // Initialize page with background hearts and intro screen
    function initPage() {
        createBackgroundHearts();
        introScreen.classList.add('active');
    }
    
    // Create floating background hearts
    function createBackgroundHearts() {
        const heartEmojis = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖', '💗', '💓', '💞', '💕'];
        
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart-bg');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            // Random position
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = 15 + Math.random() * 30;
            heart.style.fontSize = `${size}px`;
            
            // Random animation delay and duration
            heart.style.animationDelay = `${Math.random() * 5}s`;
            heart.style.animationDuration = `${5 + Math.random() * 10}s`;
            
            heartsContainer.appendChild(heart);
        }
    }
    
    // Show the main question screen
    function showQuestionScreen() {
        introScreen.classList.remove('active');
        questionScreen.classList.add('active');
        
        // Reset state
        resetNoButton();
        responseText.textContent = "Choose wisely bbg... 😼";
    }
    
    // Handle YES button click
    function handleYesClick() {
        // Create heart burst effect
        createHeartBurst();
        
        // Create confetti
        createConfetti();

        // Show stickers only on first YES click
        if (!hasShownStickers) {
            createStickers();
            hasShownStickers = true;
        }
        
        // Show celebration screen after a short delay
        setTimeout(() => {
            questionScreen.classList.remove('active');
            yesScreen.classList.add('active');
            
            // Scroll to top of yes screen
            yesScreen.scrollIntoView({ behavior: 'smooth' });
        }, 800);

        // Show secret hint after YES click
setTimeout(() => {
    const secretHint = document.getElementById('secret-hint-container');
    if (secretHint) {
        // Show the hint immediately
        secretHint.classList.add('show');
        
        // Check if device is mobile or desktop
        function isMobileDevice() {
            return (('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0) ||
                   (navigator.msMaxTouchPoints > 0));
        }
        
        const hintDesc = secretHint.querySelector('.secret-hint-desc');
        const hintSub = secretHint.querySelector('.secret-hint-sub');
        
        if (isMobileDevice()) {
            // Mobile device
            if (hintDesc) {
                hintDesc.textContent = "Try shaking your phone for a secret message from Zurayn...";
            }
        } else {
            // Desktop
            if (hintDesc) {
                hintDesc.innerHTML = "Press the <strong>'S' key</strong> for a secret message from Zurayn...";
            }
            if (hintSub) {
                hintSub.textContent = "(Or just pretend to shake your laptop 😂)";
            }
        }
    }
}, 1500); // Show hint 1.5 seconds after YES screen appears
        
        // Update response text before transition
        const responses = [
            "Yay! I knew it! 😼❤️",
            "Ayo fr?? You're not lying right? 😂",
            "Even White Coat Man approves! (maybe) 😾",
            "bbg energy confirmed! ✌️",
            "Hatt! For real? 😭❤️"
        ];
        responseText.textContent = responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Handle NO button click
    function handleNoClick() {
        noClickCount++;
        
        // Different responses based on click count
        const sadResponses = [
            "Hatt! Think again 😾",
            "You can't do this to me 😔",
            "Hurr! But why?? 😭",
            "Blehh... that's harsh hazyyy 🥀",
            "Cyaa... you're breaking my heart 💔",
            "We r proud gay na? 🤣 Just kidding... but srsly 😾"
        ];
        
        const randomResponse = sadResponses[Math.floor(Math.random() * sadResponses.length)];
        responseText.textContent = randomResponse;
        
        // Make button move after first click
        if (noClickCount === 1) {
            // Add moving class
            noBtn.classList.add('moving');
            
            // Start moving the button after a short delay
            setTimeout(() => {
                isNoButtonMoving = true;
                startNoButtonMovement();
            }, 500);
        }
    }
    
    // Start moving the NO button randomly
    function startNoButtonMovement() {
        const container = document.querySelector('.buttons-container');
        const containerRect = container.getBoundingClientRect();
        const buttonRect = noBtn.getBoundingClientRect();
        
        // Set button to position absolute for movement
        noBtn.style.position = 'absolute';
        
        // Move button randomly within container
        noButtonMoveInterval = setInterval(() => {
            if (!isNoButtonMoving) return;
            
            const maxX = containerRect.width - buttonRect.width;
            const maxY = containerRect.height - buttonRect.height;
            
            // Generate random position within container
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);
            
            // Apply new position with smooth transition
            noBtn.style.transition = 'all 0.5s ease';
            noBtn.style.left = `${randomX}px`;
            noBtn.style.top = `${randomY}px`;
            
            // Occasionally change button text
            if (Math.random() > 0.7) {
                const noTexts = ["❌ NO", "😾 NO", "🥀 NO", "😭 NO", "💔 NO"];
                noBtn.textContent = noTexts[Math.floor(Math.random() * noTexts.length)];
            }
        }, 600); // Move every 600ms
    }
    
    // Reset NO button to initial state
    function resetNoButton() {
        noClickCount = 0;
        isNoButtonMoving = false;
        
        // Clear movement interval
        if (noButtonMoveInterval) {
            clearInterval(noButtonMoveInterval);
        }
        
        // Reset button styles
        noBtn.classList.remove('moving');
        noBtn.style.position = '';
        noBtn.style.left = '';
        noBtn.style.top = '';
        noBtn.textContent = '❌ NO';
        noBtn.style.transition = '';
    }
    
    // Create heart burst animation
    function createHeartBurst() {
        const heartBurst = document.querySelector('.heart-burst');
        heartBurst.style.animation = 'none';
        
        // Trigger reflow to restart animation
        void heartBurst.offsetWidth;
        
        heartBurst.style.animation = 'heartbeat 0.5s 3';
    }
    
    // Create confetti animation
    function createConfetti() {
        // Show confetti container
        confettiContainer.style.display = 'block';
        
        // Create confetti pieces
        const colors = ['#ff6b6b', '#ff8e8e', '#ffb6d9', '#ff85c0', '#ff4757'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random color
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random position
            confetti.style.left = `${Math.random() * 100}%`;
            
            // Random size
            const size = 5 + Math.random() * 10;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Random rotation
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            confettiContainer.appendChild(confetti);
            
            // Animate confetti falling
            animateConfetti(confetti);
        }
        
        // Hide confetti after animation
        setTimeout(() => {
            confettiContainer.style.display = 'none';
            // Remove all confetti elements
            while (confettiContainer.firstChild) {
                confettiContainer.removeChild(confettiContainer.firstChild);
            }
        }, 3000);
    }
    
    // Animate individual confetti piece
    function animateConfetti(confetti) {
        // Random animation values
        const duration = 2 + Math.random() * 2;
        const delay = Math.random() * 1;
        
        // Set initial position (above viewport)
        confetti.style.top = '-20px';
        confetti.style.opacity = '1';
        
        // Apply animation
        confetti.style.transition = `all ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1) ${delay}s`;
        
        // Trigger animation
        setTimeout(() => {
            confetti.style.top = '100vh';
            confetti.style.opacity = '0';
            confetti.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 100 - 50}px)`;
        }, 10);
    }
    
    // Restart the experience
    function restartExperience() {
        yesScreen.classList.remove('active');
        introScreen.classList.add('active');
        // Hide secret hint
    const secretHint = document.getElementById('secret-hint-container');
    if (secretHint) {
        secretHint.classList.remove('show');
    }
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Add interactive rating stars
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Fill all stars up to the clicked one
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = 'gold';
                    s.style.textShadow = '0 0 10px gold';
                } else {
                    s.style.color = '';
                    s.style.textShadow = '';
                }
            });
            
            // Show funny message based on rating
            const messages = [
                "Only {count}? Hatt! 😡",
                "{count} stars? Blehh... 😾",
                "{count}? Cyaa... you're harsh hazyyy 🥀",
                "{count} stars? I'll take it! 😼",
                "All {count}! Yeshh! My bbg energy! ✌️"
            ];
            
            const selectedMessage = messages[index];
            const ratingNote = document.querySelector('.rating-note');
            
            // Update the message after a delay
            setTimeout(() => {
                const originalText = ratingNote.textContent;
                ratingNote.textContent = selectedMessage.replace('{count}', index + 1);
                
                // Revert after 3 seconds
                setTimeout(() => {
                    ratingNote.textContent = originalText;
                }, 3000);
            }, 500);
        });
    });
    
    // Add some random text changes for dynamic feel
    setInterval(() => {
        if (questionScreen.classList.contains('active')) {
            const teasers = [
                "White Coat Man is watching... 👀",
                "Remember... we r proud gay 🤣",
                "Bailchara on top ✌️",
                "No pressure hazyyy... 🎀",
                "Just choose... it's not that deep 😂"
            ];
            
            // Only change if user hasn't interacted recently
            if (Date.now() - lastInteraction > 5000) {
                const randomTeaser = teasers[Math.floor(Math.random() * teasers.length)];
                document.querySelector('.tease-text').textContent = randomTeaser;
            }
        }
    }, 8000);
    
    let lastInteraction = Date.now();
    
    // Update last interaction time on any click
    document.addEventListener('click', () => {
        lastInteraction = Date.now();
    });

    // Create sticker pop-up animation
    function createStickers() {
        const stickersContainer = document.querySelector('.stickers-container');
        const stickerPaths = [
            'stickers/sticker1.png',
            'stickers/sticker2.png',
            'stickers/sticker3.png',
            'stickers/sticker4.png'
        ];
        
        stickerPaths.forEach((path, index) => {
            const sticker = document.createElement('div');
            sticker.classList.add('sticker');
            
            const img = document.createElement('img');
            img.src = path;
            img.alt = `Sticker ${index + 1}`;
            
            sticker.appendChild(img);
            
            // Alternate sides: left (even index) or right (odd index)
            const isLeft = index % 2 === 0;
            
            if (isLeft) {
                sticker.style.left = '10%';
                sticker.style.animation = `stickerPopFromLeft 5s ease-out forwards`;
            } else {
                sticker.style.right = '10%';
                sticker.style.animation = `stickerPopFromRight 5s ease-out forwards`;
            }
            
            // Vertical position with slight randomness
            const baseBottom = 20 + (index * 15);
            sticker.style.bottom = `${baseBottom}%`;
            
            // Stagger the animation start times
            sticker.style.animationDelay = `${index * 0.2}s`;
            
            stickersContainer.appendChild(sticker);
            
            // Remove sticker after animation completes
            setTimeout(() => {
                if (sticker && sticker.parentNode) {
                    sticker.remove();
                }
            }, 5000 + (index * 200));
        });
    }

    // ============ SECRET MODE FIXED ============
    const secretScreen = document.getElementById('secret-screen');
    const okayBtn = document.getElementById('okay-btn');
    const typedText = document.getElementById('typed-text');
    
    if (secretScreen && okayBtn && typedText) {
        let isSecretModeActive = false;
        let typingTimeout = null;
        let lastShakeTime = 0;
        
        const secretMessage = `I joke a lot, but genuinely talking to you feels easy, hazyyy.
Our chats are never planned, never serious on purpose, but somehow they fit into my day naturally.
You’re the first notification I see and the last one before the day ends and yeah, that quietly makes a difference.

This site, the jokes, the chaos it’s just a small, coded way of saying you matter to me as a friend, more than you probably realize ❤️

Okay, stopping here before this gets awkward 😂✌️`;
        
        // Type message with typing animation
        function typeMessage() {
            // Clear any existing typing
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                typingTimeout = null;
            }
            
            typedText.innerHTML = '';
            let charIndex = 0;
            
            function typeNextChar() {
                if (charIndex < secretMessage.length) {
                    // Handle newlines
                    if (secretMessage[charIndex] === '\n') {
                        typedText.innerHTML += '<br>';
                    } else {
                        typedText.innerHTML += secretMessage[charIndex];
                    }
                    
                    charIndex++;
                    
                    // Scroll to keep text visible
                    typedText.scrollTop = typedText.scrollHeight;
                    
                    // Random typing speed for natural feel
                    const speed = 30 + Math.random() * 20;
                    typingTimeout = setTimeout(typeNextChar, speed);
                }
            }
            
            typeNextChar();
        }
        
        // OK button event
        okayBtn.addEventListener('click', function() {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            secretScreen.classList.remove('active');
            document.getElementById('intro-screen').classList.add('active');
            isSecretModeActive = false;
        });
        
        // Shake detection
        function handleShake(event) {
            if (isSecretModeActive) return;
            
            const acceleration = event.accelerationIncludingGravity;
            if (!acceleration) return;
            
            // Calculate movement
            const movement = Math.abs(acceleration.x || 0) + 
                           Math.abs(acceleration.y || 0) + 
                           Math.abs(acceleration.z || 0);
            
            const now = Date.now();
            
            // Check for shake
            if (movement > 25 && (now - lastShakeTime) > 3000) {
                lastShakeTime = now;
                activateSecretMode();
            }
        }
        
        // Activate secret mode
        function activateSecretMode() {
            if (isSecretModeActive) return;
            
            isSecretModeActive = true;
            
            // Hide current screen
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen) {
                activeScreen.classList.remove('active');
            }
            
            // Show secret screen
            secretScreen.classList.add('active');
            
            // Start typing animation
            setTimeout(typeMessage, 500);
        }
        
        // Add shake listener
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', handleShake);
        }
        
        // Desktop testing - press 'S' key
        document.addEventListener('keydown', function(e) {
            if ((e.key === 's' || e.key === 'S') && !isSecretModeActive) {
                e.preventDefault();
                activateSecretMode();
            }
        });
    }
    // Secret hint functionality
const secretHintContainer = document.getElementById('secret-hint-container');

// Function to detect if device is mobile
function isMobileDevice() {
    return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
}

// Update hint based on device
if (secretHintContainer) {
    // Wait for YES screen to be shown, then update hint
    yesScreen.addEventListener('animationstart', function() {
        // Small delay to ensure content is loaded
        setTimeout(() => {
            if (isMobileDevice()) {
                // Mobile device - show shake hint
                const hintText = secretHintContainer.querySelector('.secret-hint-desc');
                if (hintText) {
                    hintText.innerHTML = "Try shaking your phone for a secret message from Zurayn...";
                }
            } else {
                // Desktop - show keyboard hint
                const hintText = secretHintContainer.querySelector('.secret-hint-desc');
                const hintSub = secretHintContainer.querySelector('.secret-hint-sub');
                if (hintText) {
                    hintText.innerHTML = "Press the <strong>'S' key</strong> for a secret message from Zurayn...";
                }
                if (hintSub) {
                    hintSub.innerHTML = "(Or just pretend to shake your laptop 😂)";
                }
            }
        }, 1000);
    });
    
    // Also add a desktop-specific hint that appears only on non-mobile
    if (!isMobileDevice()) {
        const desktopHint = document.createElement('div');
        desktopHint.className = 'desktop-hint';
        desktopHint.innerHTML = `
            <div style="margin-top: 10px; font-size: 0.85rem; color: #888;">
                <i class="fas fa-keyboard"></i> Desktop tip: Press 'S' key anytime
            </div>
        `;
        secretHintContainer.querySelector('.secret-hint-text').appendChild(desktopHint);
        desktopHint.style.display = 'block';
    }
}
});
