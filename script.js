// script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startBtn = document.getElementById('start-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const restartBtn = document.getElementById('restart-btn');
    const responseText = document.getElementById('response-text');
    const backButton = document.getElementById('back-to-question'); // FIXED: moved here
    
    // Screens
    const introScreen = document.getElementById('intro-screen');
    const questionScreen = document.getElementById('question-screen');
    const yesScreen = document.getElementById('yes-screen');
    const secretScreen = document.getElementById('secret-screen'); // FIXED: for secret mode
    
    // Containers
    const heartsContainer = document.querySelector('.hearts-container');
    const confettiContainer = document.querySelector('.confetti-container');
    
    // State variables
    let noClickCount = 0;
    let isNoButtonMoving = false;
    let noButtonMoveInterval;
    let lastInteraction = Date.now();

    // === CHAT SYSTEM VARIABLES ===
    let chatHistory = [];
    let currentStep = 0;
    let userChoices = [];
    let originalNoClickCount = 0;   // FIXED: store NO count
    let chatTimeouts = [];          // FIXED: store all timers for cleanup
    
    // === SECRET MODE VARIABLES ===
    let isSecretModeActive = false;
    let secretTypingTimeout = null;
    let lastShakeTime = 0;
    let isTypingCancelled = false;  // FIXED: cancel typing on OK click
    
    // ============================

    const chatStory = { /* (same as original, unchanged) */
        steps: [
            // Step 0 - Initial message
            {
                id: 0,
                type: "zurayn",
                message: "Is this fr?",
                delay: 600,
                typingSpeed: 40,
                nextStep: 1
            },
            
            // Step 1 - Initial options
            {
                id: 1,
                type: "options",
                options: [
                    {
                        text: "yeah lol why not",
                        nextStep: 2,
                        value: "positive"
                    },
                    {
                        text: "nah you're dreaming 😂",
                        nextStep: 3,
                        value: "negative"
                    }
                ]
            },
            
            // POSITIVE PATH
            // Step 2 - Response to positive
            {
                id: 2,
                type: "zurayn",
                message: "wait fr? 👀",
                delay: 400,
                typingSpeed: 35,
                nextStep: 4
            },
            
            // NEGATIVE PATH
            // Step 3 - Response to negative
            {
                id: 3,
                type: "zurayn",
                message: "bruh<br>after all those convos? 😭",
                delay: 500,
                typingSpeed: 40,
                nextStep: 5
            },
            
            // Step 4 - Follow-up to positive
            {
                id: 4,
                type: "options",
                options: [
                    {
                        text: "yeah i'm being real",
                        nextStep: 6,
                        value: "serious"
                    },
                    {
                        text: "idk maybe 😏",
                        nextStep: 7,
                        value: "playful"
                    }
                ]
            },
            
            // Step 5 - Follow-up to negative
            {
                id: 5,
                type: "options",
                options: [
                    {
                        text: "lmao i'm just messing with you",
                        nextStep: 8,
                        value: "kidding"
                    },
                    {
                        text: "sorry but it's a no",
                        nextStep: 9,
                        value: "final_no"
                    }
                ]
            },
            
            // Step 6 - Serious path
            {
                id: 6,
                type: "zurayn",
                message: "okay okay<br>random question tho",
                delay: 400,
                typingSpeed: 40,
                nextStep: 10
            },
            
            // Step 7 - Playful path
            {
                id: 7,
                type: "zurayn",
                message: "\"maybe\" isn't an answer hazyyy 😒<br>do you like talking to me at least?",
                delay: 500,
                typingSpeed: 45,
                nextStep: 13
            },
            
            // Step 8 - Kidding response
            {
                id: 8,
                type: "zurayn",
                message: "HATT don't scare me like that 💀<br>so you do like me then?",
                delay: 500,
                typingSpeed: 40,
                nextStep: 14
            },
            
            // Step 9 - Final rejection
            {
                id: 9,
                type: "zurayn",
                message: "damn okay<br>respect for being honest i guess 🥀<br><br>but you gotta admit this site is kinda cool tho",
                delay: 600,
                typingSpeed: 50
                // Ends here
            },
            
            // Step 10 - Serious path question
            {
                id: 10,
                type: "options",
                options: [
                    {
                        text: "what?",
                        nextStep: 11,
                        value: "what"
                    },
                    {
                        text: "go ahead",
                        nextStep: 11,
                        value: "go_ahead"
                    }
                ]
            },
            
            // Step 11 - The comparison
            {
                id: 11,
                type: "zurayn",
                message: "me or white coat man? 👀",
                delay: 300,
                typingSpeed: 35,
                nextStep: 12
            },
            
            // Step 12 - Comparison options
            {
                id: 12,
                type: "options",
                options: [
                    {
                        text: "you obvs",
                        nextStep: 15,
                        value: "you_win"
                    },
                    {
                        text: "white coat man lol",
                        nextStep: 16,
                        value: "wcm_wins"
                    },
                    {
                        text: "why are you asking me this 😭",
                        nextStep: 17,
                        value: "confused"
                    }
                ]
            },
            
            // Step 13 - Playful path options
            {
                id: 13,
                type: "options",
                options: [
                    {
                        text: "yeah it's chill",
                        nextStep: 18,
                        value: "chill_yes"
                    },
                    {
                        text: "when you're not being cringe",
                        nextStep: 19,
                        value: "sometimes"
                    }
                ]
            },
            
            // Step 14 - Kidding path confirmation
            {
                id: 14,
                type: "options",
                options: [
                    {
                        text: "as a friend yeah",
                        nextStep: 20,
                        value: "friend"
                    },
                    {
                        text: "sure",
                        nextStep: 21,
                        value: "sure"
                    }
                ]
            },
            
            // Step 15 - You win response
            {
                id: 15,
                type: "zurayn",
                message: "YESSS 😭<br>proud gay moment fr 🤣",
                delay: 300,
                typingSpeed: 35,
                special: function() {
                    setTimeout(() => {
                        createConfetti();
                    }, 600);
                }
                // Ends here
            },
            
            // Step 16 - WCM wins
            {
                id: 16,
                type: "zurayn",
                message: "knew it 💀<br>he always wins huh<br><br>jk jk i'm not even pressed",
                delay: 500,
                typingSpeed: 40
                // Ends here
            },
            
            // Step 17 - Confused response
            {
                id: 17,
                type: "zurayn",
                message: "idk bro i panicked 😭<br>forget i asked lmao",
                delay: 400,
                typingSpeed: 40
                // Ends here
            },
            
            // Step 18 - Chill response
            {
                id: 18,
                type: "zurayn",
                message: "ayee<br>that's what i like to hear",
                delay: 300,
                typingSpeed: 35
                // Ends here
            },
            
            // Step 19 - Cringe response
            {
                id: 19,
                type: "zurayn",
                message: "CRINGE??? 💀<br>blehh you're mean<br><br>but fair i guess 😂",
                delay: 400,
                typingSpeed: 40
                // Ends here
            },
            
            // Step 20 - Friend response
            {
                id: 20,
                type: "zurayn",
                message: "obvvv we're just friends lol<br>proud gay and all that 🤣",
                delay: 300,
                typingSpeed: 40
                // Ends here
            },
            
            // Step 21 - Sure response
            {
                id: 21,
                type: "zurayn",
                message: "\"sure\" 💀<br>most enthusiastic response ever<br><br>i'll take it tho ✌️",
                delay: 400,
                typingSpeed: 40
                // Ends here
            }
        ]
    };
    
    // Initialize page
    initPage();
    
    // Event Listeners
    startBtn.addEventListener('click', showQuestionScreen);
    yesBtn.addEventListener('click', handleYesClick);
    noBtn.addEventListener('click', handleNoClick);
    restartBtn.addEventListener('click', restartExperience);
    
    // FIXED: Attach back button listener only once, and clean up timers
    if (backButton) {
        backButton.addEventListener('click', function() {
            resetChatState();      // Clear timers & messages
            restartExperience();   // Go back to intro
        });
    }

    // ============ INIT FUNCTIONS ============
    function initPage() {
        createBackgroundHearts();
        introScreen.classList.add('active');
    }
    
    function createBackgroundHearts() {
        const heartEmojis = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖', '💗', '💓', '💞', '💕'];
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart-bg');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            const size = 15 + Math.random() * 30;
            heart.style.fontSize = `${size}px`;
            heart.style.animationDelay = `${Math.random() * 5}s`;
            heart.style.animationDuration = `${5 + Math.random() * 10}s`;
            heartsContainer.appendChild(heart);
        }
    }
    
    // ============ SCREEN NAVIGATION ============
    function showQuestionScreen() {
        introScreen.classList.remove('active');
        questionScreen.classList.add('active');
        resetNoButton();
        responseText.textContent = "Choose wisely bbg... 😼";
    }
    
    // ============ YES BUTTON ============
    function handleYesClick() {
        // FIXED: Stop NO button movement and clear interval
        resetNoButton();
        
        // FIXED: Store the correct NO count
        originalNoClickCount = noClickCount;
        console.log("NO count stored:", originalNoClickCount);
        
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
    
    // ============ NO BUTTON ============
    function handleNoClick() {
        noClickCount++;
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
        
        if (noClickCount === 1) {
            noBtn.classList.add('moving');
            setTimeout(() => {
                isNoButtonMoving = true;
                startNoButtonMovement();
            }, 500);
        }
    }
    
    function startNoButtonMovement() {
        const container = document.querySelector('.buttons-container');
        const containerRect = container.getBoundingClientRect();
        const buttonRect = noBtn.getBoundingClientRect();
        
        noBtn.style.position = 'absolute';
        
        noButtonMoveInterval = setInterval(() => {
            if (!isNoButtonMoving) return;
            const maxX = containerRect.width - buttonRect.width;
            const maxY = containerRect.height - buttonRect.height;
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);
            noBtn.style.transition = 'all 0.5s ease';
            noBtn.style.left = `${randomX}px`;
            noBtn.style.top = `${randomY}px`;
            
            if (Math.random() > 0.7) {
                const noTexts = ["❌ NO", "😾 NO", "🥀 NO", "😭 NO", "💔 NO"];
                noBtn.textContent = noTexts[Math.floor(Math.random() * noTexts.length)];
            }
        }, 600);
    }
    
    function resetNoButton() {
        noClickCount = 0;
        isNoButtonMoving = false;
        if (noButtonMoveInterval) {
            clearInterval(noButtonMoveInterval);
            noButtonMoveInterval = null;
        }
        if (noBtn) {
            noBtn.classList.remove('moving');
            noBtn.style.position = '';
            noBtn.style.left = '';
            noBtn.style.top = '';
            noBtn.textContent = '❌ NO';
            noBtn.style.transition = '';
        }
    }
    
    // ============ CHAT STORY ============
    // FIXED: Clear all chat timers and reset state
    function resetChatState() {
        chatTimeouts.forEach(clearTimeout);
        chatTimeouts = [];
        currentStep = 0;
        userChoices = [];
        
        const chatDisplay = document.getElementById('chat-display');
        const optionsContainer = document.getElementById('options-container');
        if (chatDisplay) chatDisplay.innerHTML = '';
        if (optionsContainer) optionsContainer.innerHTML = '';
        
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.classList.remove('active');
        const typingBubble = document.getElementById('typing-bubble-indicator');
        if (typingBubble) typingBubble.remove();
    }
    
    function initChatStory() {
        console.log("Initializing chat story...");
        resetChatState(); // FIXED: clean slate
        
        const chatDisplay = document.getElementById('chat-display');
        const optionsContainer = document.getElementById('options-container');
        const chatContainer = document.querySelector('.chat-story-container');
        const ratingOverlay = document.getElementById('rating-overlay');
        
        if (!chatDisplay || !optionsContainer) {
            console.error("Chat elements not found!");
            showRatingOverlay();
            return;
        }
        
        if (chatContainer) {
            chatContainer.style.display = 'flex';
            chatContainer.style.opacity = '1';
            chatContainer.style.transform = 'scale(1)';
        }
        if (ratingOverlay) ratingOverlay.style.display = 'none';
        
        // Start chat
        const timer = setTimeout(() => processStep(0), 1000);
        chatTimeouts.push(timer);
    }
    
    function processStep(stepId) {
        currentStep = stepId;
        const step = chatStory.steps.find(s => s.id === stepId);
        if (!step) {
            endChatStory();
            return;
        }
        
        switch(step.type) {
            case "zurayn":
                showTypingIndicator(true);
                const timer1 = setTimeout(() => {
                    // FIXED: pass typingSpeed to addMessage
                    addMessage("zurayn", step.message, step.typingSpeed || 40);
                    showTypingIndicator(false);
                    
                    if (step.special && typeof step.special === 'function') {
                        step.special();
                    }
                    
                    // Show NO count reference if appropriate
                    if (originalNoClickCount > 3 && stepId === 2) {
                        const timer2 = setTimeout(() => addNoCountReference(), 1000);
                        chatTimeouts.push(timer2);
                    }
                    
                    if (step.nextStep !== undefined) {
                        const timer3 = setTimeout(() => processStep(step.nextStep), step.delay || 500);
                        chatTimeouts.push(timer3);
                    } else {
                        const timer4 = setTimeout(() => endChatStory(), 1500);
                        chatTimeouts.push(timer4);
                    }
                }, 1000);
                chatTimeouts.push(timer1);
                break;
                
            case "options":
                const timer5 = setTimeout(() => showOptions(step.options), 800);
                chatTimeouts.push(timer5);
                break;
        }
    }
    
    // FIXED: Real typing effect with support for <br> and auto-scroll
    function addMessage(sender, text, typingSpeed = 40) {
        const chatDisplay = document.getElementById('chat-display');
        if (!chatDisplay) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble ${sender === 'zurayn' ? 'receiver' : 'sender'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const p = document.createElement('p');
        contentDiv.appendChild(p);
        messageDiv.appendChild(contentDiv);
        chatDisplay.appendChild(messageDiv);
        
        // Split by <br> to handle line breaks
        const parts = text.split('<br>');
        let lineIndex = 0;
        let charIndex = 0;
        let currentLine = '';
        
        function typeChar() {
            if (isTypingCancelled) return; // For secret mode only, but safe
            
            if (lineIndex < parts.length) {
                if (charIndex < parts[lineIndex].length) {
                    // Type character
                    currentLine += parts[lineIndex][charIndex];
                    // Use innerHTML to display emojis correctly
                    p.innerHTML = currentLine + (lineIndex < parts.length - 1 ? '<br>' : '');
                    charIndex++;
                    const timer = setTimeout(typeChar, typingSpeed);
                    chatTimeouts.push(timer);
                    
                    // Auto-scroll during typing
                    chatDisplay.scrollTo({ top: chatDisplay.scrollHeight, behavior: 'smooth' });
                } else {
                    // Move to next line
                    lineIndex++;
                    if (lineIndex < parts.length) {
                        // Insert <br> and reset for next line
                        currentLine += '<br>';
                        p.innerHTML = currentLine;
                        charIndex = 0;
                        const timer = setTimeout(typeChar, typingSpeed * 2); // pause after line break
                        chatTimeouts.push(timer);
                    } else {
                        // Finished typing all lines
                        if (sender === 'user') {
                            setTimeout(() => {
                                const seen = document.createElement('span');
                                seen.className = 'seen-receipt';
                                seen.textContent = 'Seen just now';
                                contentDiv.appendChild(seen);
                                messageDiv.classList.add('message-seen');
                                chatDisplay.scrollTo({ top: chatDisplay.scrollHeight, behavior: 'smooth' });
                            }, 800);
                        }
                    }
                }
            }
        }
        
        // Start typing
        typeChar();
    }
    
    function showOptions(options) {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerHTML = option.text;
            
            button.addEventListener('click', function() {
                button.classList.add('selected');
                userChoices.push({ step: currentStep, choice: option.value, text: option.text });
                
                // Show user's choice with typing effect
                addMessage("user", option.text, 20);
                optionsContainer.innerHTML = '';
                
                const timer = setTimeout(() => processStep(option.nextStep), 800);
                chatTimeouts.push(timer);
            });
            
            optionsContainer.appendChild(button);
        });
        
        optionsContainer.style.opacity = '0';
        setTimeout(() => {
            optionsContainer.style.opacity = '1';
            optionsContainer.style.transform = 'translateY(0)';
        }, 10);
    }
    
    function showTypingIndicator(show) {
        const chatDisplay = document.getElementById('chat-display');
        if (!chatDisplay) return;
        
        if (show) {
            const typingBubble = document.createElement('div');
            typingBubble.className = 'message-bubble receiver typing-bubble';
            typingBubble.id = 'typing-bubble-indicator';
            
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'typing-dots';
            dotsContainer.innerHTML = '<span></span><span></span><span></span>';
            
            typingBubble.appendChild(dotsContainer);
            chatDisplay.appendChild(typingBubble);
            chatDisplay.scrollTo({ top: chatDisplay.scrollHeight, behavior: 'smooth' });
        } else {
            const typingBubble = document.getElementById('typing-bubble-indicator');
            if (typingBubble) typingBubble.remove();
        }
    }
    
    // FIXED: Add guard and only show if originalNoClickCount > 0
    function addNoCountReference() {
        const chatDisplay = document.getElementById('chat-display');
        if (!chatDisplay || originalNoClickCount === 0) return;
        
        const referenceDiv = document.createElement('div');
        referenceDiv.className = 'message-bubble system-message no-count-reference';
        referenceDiv.innerHTML = `(After ${originalNoClickCount} NOs, finally got that YES! 😂)`;
        chatDisplay.appendChild(referenceDiv);
        chatDisplay.scrollTo({ top: chatDisplay.scrollHeight, behavior: 'smooth' });
    }
    
    function endChatStory() {
        // Wait 5 seconds then show rating
        const timer = setTimeout(() => {
            document.querySelector('.chat-story-container').style.opacity = '0';
            document.querySelector('.chat-story-container').style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                document.querySelector('.chat-story-container').style.display = 'none';
                document.getElementById('rating-overlay').style.display = 'flex';
                personalizeRatingMessage();
                
                setTimeout(() => {
                    const secretHint = document.getElementById('secret-hint-container');
                    if (secretHint) secretHint.classList.add('show');
                }, 2000);
            }, 500);
        }, 5000);
        chatTimeouts.push(timer);
    }
    
    function personalizeRatingMessage() {
        const finalMessage = document.querySelector('.final-message h4');
        const note = document.querySelector('.rating-note');
        
        const youWinChoice = userChoices.find(c => c.value === 'you_win');
        const wcmWinsChoice = userChoices.find(c => c.value === 'wcm_wins');
        const cringe = userChoices.find(c => c.value === 'sometimes');
        
        if (youWinChoice) {
            finalMessage.textContent = "okay now rate this whole thing (be honest tho)";
            note.textContent = "(giving me 5 stars after saying i'm better than wcm would be kinda iconic ngl)";
        } else if (wcmWinsChoice) {
            finalMessage.textContent = "alright rate the site at least 😭";
            note.textContent = "(you already said wcm > me so throw me a bone here)";
        } else if (cringe) {
            finalMessage.textContent = "you called me cringe but rate this anyway lol";
            note.textContent = "(i know you're gonna give me 3 stars 💀)";
        } else if (originalNoClickCount > 5) {
            finalMessage.textContent = "NOW rate my coding after clicking NO " + originalNoClickCount + " times 😾";
            note.textContent = "(yeah i counted. pick all 5 to apologize)";
        } else {
            finalMessage.textContent = "alright rate this whole experience";
            note.textContent = "(no pressure but 5 stars would be valid)";
        }
    }
    
    // ============ ANIMATIONS & EFFECTS ============
    function createHeartBurst() {
        const heartBurst = document.querySelector('.heart-burst');
        if (!heartBurst) return;
        heartBurst.style.animation = 'none';
        void heartBurst.offsetWidth;
        heartBurst.style.animation = 'heartbeat 0.5s 3';
    }
    
    function createConfetti() {
        confettiContainer.style.display = 'block';
        const colors = ['#ff6b6b', '#ff8e8e', '#ffb6d9', '#ff85c0', '#ff4757'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}%`;
            const size = 5 + Math.random() * 10;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confettiContainer.appendChild(confetti);
            animateConfetti(confetti);
        }
        setTimeout(() => {
            confettiContainer.style.display = 'none';
            while (confettiContainer.firstChild) confettiContainer.firstChild.remove();
        }, 3000);
    }
    
    function animateConfetti(confetti) {
        const duration = 2 + Math.random() * 2;
        const delay = Math.random() * 1;
        confetti.style.top = '-20px';
        confetti.style.opacity = '1';
        confetti.style.transition = `all ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1) ${delay}s`;
        setTimeout(() => {
            confetti.style.top = '100vh';
            confetti.style.opacity = '0';
            confetti.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 100 - 50}px)`;
        }, 10);
    }
    
    function createStickers() {
        const stickersContainer = document.querySelector('.stickers-container');
        if (!stickersContainer) return;
        const stickerPaths = ['stickers/sticker1.png', 'stickers/sticker2.png', 'stickers/sticker3.png', 'stickers/sticker4.png'];
        stickerPaths.forEach((path, index) => {
            const sticker = document.createElement('div');
            sticker.classList.add('sticker');
            const img = document.createElement('img');
            img.src = path;
            img.alt = 'Sticker'; // FIXED: added alt
            sticker.appendChild(img);
            const isLeft = index % 2 === 0;
            if (isLeft) {
                sticker.style.left = '10%';
                sticker.style.animation = `stickerPopFromLeft 5s ease-out forwards`;
            } else {
                sticker.style.right = '10%';
                sticker.style.animation = `stickerPopFromRight 5s ease-out forwards`;
            }
            const baseBottom = 20 + (index * 15);
            sticker.style.bottom = `${baseBottom}%`;
            sticker.style.animationDelay = `${index * 0.2}s`;
            stickersContainer.appendChild(sticker);
            setTimeout(() => { if (sticker.parentNode) sticker.remove(); }, 5000 + (index * 200));
        });
    }
    
    function restartExperience() {
        yesScreen.classList.remove('active');
        introScreen.classList.add('active');
        
        const secretHint = document.getElementById('secret-hint-container');
        if (secretHint) secretHint.classList.remove('show');
        
        const chatContainer = document.querySelector('.chat-story-container');
        const ratingOverlay = document.getElementById('rating-overlay');
        if (chatContainer) {
            chatContainer.style.display = 'flex';
            chatContainer.style.opacity = '1';
            chatContainer.style.transform = 'scale(1)';
        }
        if (ratingOverlay) ratingOverlay.style.display = 'none';
        
        const stickersContainer = document.querySelector('.stickers-container');
        if (stickersContainer) stickersContainer.innerHTML = '';
        
        resetChatState(); // FIXED: clear chat timers and messages
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // ============ RATING STARS ============
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = 'gold';
                    s.style.textShadow = '0 0 10px gold';
                } else {
                    s.style.color = '';
                    s.style.textShadow = '';
                }
            });
            const messages = [
                "Only {count}? Hatt! 😡",
                "{count} stars? Blehh... 😾",
                "{count}? Cyaa... you're harsh hazyyy 🥀",
                "{count} stars? I'll take it! 😼",
                "All {count}! Yeshh! My bbg energy! ✌️"
            ];
            const selectedMessage = messages[index];
            const ratingNote = document.querySelector('.rating-note');
            setTimeout(() => {
                const originalText = ratingNote.textContent;
                ratingNote.textContent = selectedMessage.replace('{count}', index + 1);
                setTimeout(() => { ratingNote.textContent = originalText; }, 3000);
            }, 500);
        });
    });
    
    // ============ AUTO-SCROLL INDICATOR (SINGLETON) ============
    function setupAutoScroll() {
        const chatDisplay = document.getElementById('chat-display');
        if (!chatDisplay) return;
        // FIXED: prevent duplicate indicator
        if (chatDisplay.parentElement.querySelector('.scroll-indicator')) return;
        
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '↓';
        scrollIndicator.title = 'Scroll to latest messages';
        chatDisplay.parentElement.appendChild(scrollIndicator);
        
        chatDisplay.addEventListener('scroll', function() {
            const isAtBottom = chatDisplay.scrollHeight - chatDisplay.scrollTop <= chatDisplay.clientHeight + 50;
            if (isAtBottom) scrollIndicator.classList.remove('show');
            else scrollIndicator.classList.add('show');
        });
        
        scrollIndicator.addEventListener('click', function() {
            chatDisplay.scrollTo({ top: chatDisplay.scrollHeight, behavior: 'smooth' });
        });
    }
    setupAutoScroll(); // Called once
    
    // ============ RANDOM TEASER ROTATION ============
    setInterval(() => {
        if (questionScreen.classList.contains('active')) {
            const teasers = [
                "White Coat Man is watching... 👀",
                "Remember... we r proud gay 🤣",
                "Bailchara on top ✌️",
                "No pressure hazyyy... 🎀",
                "Just choose... it's not that deep 😂"
            ];
            if (Date.now() - lastInteraction > 5000) {
                const randomTeaser = teasers[Math.floor(Math.random() * teasers.length)];
                const teaserEl = document.querySelector('.tease-text');
                if (teaserEl) teaserEl.textContent = randomTeaser;
            }
        }
    }, 8000);
    
    document.addEventListener('click', () => { lastInteraction = Date.now(); });
    
    // ============ SECRET MODE (ENHANCED & FIXED) ============
    const typedText = document.getElementById('typed-text');
    const okayBtn = document.getElementById('okay-btn');
    
    if (secretScreen && okayBtn && typedText) {
        const secretMessage = `I joke a lot, but genuinely talking to you feels easy, hazyyy.
Our chats are never planned, never serious on purpose, but somehow they fit into my day naturally.
You're the first notification I see and the last one before the day ends, and yeah, that quietly makes a difference.

This site, the jokes, the chaos... it's just a small, coded way of saying you matter to me as a friend, more than you probably realize. ❤️

Okay, stopping here before this gets awkward. 😂✌️`;

        function createSecretBackground() {
            const heartsContainer = document.querySelector('.secret-hearts-container');
            const particlesContainer = document.querySelector('.secret-particles-container');
            if (!heartsContainer || !particlesContainer) return;
            
            heartsContainer.innerHTML = '';
            particlesContainer.innerHTML = '';
            
            const heartEmojis = ['❤️', '💖', '💗', '💓', '💞', '💕', '💌', '🌹', '🌸', '💐'];
            for (let i = 0; i < 15; i++) {
                const heart = document.createElement('div');
                heart.classList.add('secret-heart');
                heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.fontSize = `${15 + Math.random() * 20}px`;
                heart.style.animationDelay = `${Math.random() * 5}s`;
                heart.style.animationDuration = `${10 + Math.random() * 15}s`;
                heartsContainer.appendChild(heart);
            }
            
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.classList.add('secret-particle');
                const size = 1 + Math.random() * 4;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.opacity = `${0.2 + Math.random() * 0.5}`;
                particle.style.animationDelay = `${Math.random() * 3}s`;
                particle.style.animationDuration = `${10 + Math.random() * 20}s`;
                particle.style.setProperty('--random-x', `${Math.random() * 100 - 50}px`);
                particlesContainer.appendChild(particle);
            }
        }

        function typeMessage() {
            if (secretTypingTimeout) clearTimeout(secretTypingTimeout);
            isTypingCancelled = false; // FIXED: reset cancel flag
            typedText.innerHTML = '';
            let charIndex = 0;
            let lineIndex = 0;
            
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) typingIndicator.style.display = 'flex';
            
            function typeNextChar() {
                if (isTypingCancelled) return; // FIXED: stop typing if cancelled
                
                if (charIndex < secretMessage.length) {
                    const currentChar = secretMessage[charIndex];
                    if (currentChar === '\n') {
                        typedText.innerHTML += '<br>';
                        lineIndex++;
                        charIndex++;
                        secretTypingTimeout = setTimeout(typeNextChar, 100);
                    } else {
                        const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
                        if (emojiRegex.test(currentChar)) {
                            typedText.innerHTML += `<span class="secret-emoji">${currentChar}</span>`;
                        } else if (currentChar === '❤️') {
                            typedText.innerHTML += `<span class="secret-heart-char" style="color:#ff6b8b">${currentChar}</span>`;
                        } else {
                            typedText.innerHTML += currentChar;
                        }
                        charIndex++;
                        
                        // FIXED: scroll the correct container
                        const secretTextDiv = document.querySelector('.secret-text');
                        if (secretTextDiv) {
                            secretTextDiv.scrollTo({ top: secretTextDiv.scrollHeight, behavior: 'smooth' });
                        }
                        
                        let speed = 30;
                        if (/[.,;!?\n]/.test(currentChar)) speed = 70;
                        else if (currentChar === ' ') speed = 20;
                        else speed = 40 + Math.random() * 20;
                        
                        secretTypingTimeout = setTimeout(typeNextChar, speed);
                    }
                } else {
                    if (typingIndicator) {
                        setTimeout(() => {
                            typingIndicator.style.opacity = '0';
                            setTimeout(() => { typingIndicator.style.display = 'none'; }, 300);
                        }, 500);
                    }
                    typedText.innerHTML += `<span class="typing-complete"> 💫</span>`;
                    setTimeout(() => {
                        const secretTextDiv = document.querySelector('.secret-text');
                        if (secretTextDiv) secretTextDiv.scrollTo({ top: secretTextDiv.scrollHeight, behavior: 'smooth' });
                    }, 200);
                    
                    setTimeout(() => {
                        const okayBtn = document.getElementById('okay-btn');
                        if (okayBtn) okayBtn.classList.add('show');
                    }, 3000);
                }
            }
            typeNextChar();
        }

        okayBtn.addEventListener('click', function() {
            // FIXED: cancel typing and clear timeout
            isTypingCancelled = true;
            if (secretTypingTimeout) clearTimeout(secretTypingTimeout);
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = ''; }, 200);
            
            secretScreen.style.opacity = '0';
            secretScreen.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                secretScreen.classList.remove('active');
                introScreen.classList.add('active');
                isSecretModeActive = false;
                secretScreen.style.opacity = '';
                secretScreen.style.transform = '';
            }, 300);
        });

        function handleShake(event) {
            if (isSecretModeActive) return;
            const acceleration = event.accelerationIncludingGravity;
            if (!acceleration) return;
            const movement = Math.abs(acceleration.x || 0) + Math.abs(acceleration.y || 0) + Math.abs(acceleration.z || 0);
            const now = Date.now();
            if (movement > 20 && (now - lastShakeTime) > 2500) {
                lastShakeTime = now;
                document.body.style.transform = 'translateX(5px)';
                setTimeout(() => {
                    document.body.style.transform = 'translateX(-5px)';
                    setTimeout(() => { document.body.style.transform = ''; }, 50);
                }, 50);
                setTimeout(activateSecretMode, 200);
            }
        }

        function activateSecretMode() {
            if (isSecretModeActive) return;
            isSecretModeActive = true;
            createSecretBackground();
            
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

        // FIXED: iOS permission request – remove listener after first click
        if (window.DeviceMotionEvent) {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                function requestPermissionOnce() {
                    DeviceMotionEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                window.addEventListener('devicemotion', handleShake);
                            }
                        })
                        .catch(console.error);
                    document.removeEventListener('click', requestPermissionOnce);
                }
                document.addEventListener('click', requestPermissionOnce);
            } else {
                window.addEventListener('devicemotion', handleShake);
            }
        }

        // Desktop fallback: 'S' key
        document.addEventListener('keydown', function(e) {
            if ((e.key === 's' || e.key === 'S') && !isSecretModeActive) {
                e.preventDefault();
                const keyHint = document.querySelector('.desktop-hint');
                if (keyHint) {
                    keyHint.style.color = '#ff6b8b';
                    keyHint.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        keyHint.style.color = '';
                        keyHint.style.transform = '';
                    }, 300);
                }
                activateSecretMode();
            }
        });

        // Add emoji styling (same as original)
        const style = document.createElement('style');
        style.textContent = `
            .secret-emoji { display: inline-block; animation: gentleFloat 2s ease-in-out infinite; margin: 0 2px; }
            .secret-heart-char { display: inline-block; animation: gentleHeartbeat 1.5s infinite; margin: 0 2px; }
            .typing-complete { opacity: 0; animation: fadeIn 0.5s ease 0.3s forwards; }
            @keyframes fadeIn { to { opacity: 1; } }
        `;
        document.head.appendChild(style);
    }

    // ============ SECRET HINT (DEVICE DETECTION) ============
    const secretHintContainer = document.getElementById('secret-hint-container');
    function isMobileDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    }
    
    if (secretHintContainer) {
        yesScreen.addEventListener('animationstart', function() {
            setTimeout(() => {
                if (isMobileDevice()) {
                    const hintText = secretHintContainer.querySelector('.secret-hint-desc');
                    if (hintText) hintText.innerHTML = "Try shaking your phone for a secret message from Zurayn...";
                } else {
                    const hintText = secretHintContainer.querySelector('.secret-hint-desc');
                    const hintSub = secretHintContainer.querySelector('.secret-hint-sub');
                    if (hintText) hintText.innerHTML = "Press the <strong>'S' key</strong> for a secret message from Zurayn...";
                    if (hintSub) hintSub.innerHTML = "(Or just pretend to shake your laptop 😂)";
                }
                if (!isMobileDevice()) {
                    const desktopHint = document.createElement('div');
                    desktopHint.className = 'desktop-hint';
                    desktopHint.innerHTML = `<div style="margin-top: 10px; font-size: 0.85rem; color: #888;"><i class="fas fa-keyboard"></i> Desktop tip: Press 'S' key anytime</div>`;
                    const hintTextEl = secretHintContainer.querySelector('.secret-hint-text');
                    if (hintTextEl) hintTextEl.appendChild(desktopHint);
                }
            }, 1000);
        });
    }
});