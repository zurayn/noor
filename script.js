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
    // Initialize the page
    initPage();
    
    // Event Listeners
    startBtn.addEventListener('click', showQuestionScreen);
    yesBtn.addEventListener('click', handleYesClick);
    noBtn.addEventListener('click', handleNoClick);
    restartBtn.addEventListener('click', restartExperience);

    // === CHAT SYSTEM VARIABLES ===
    let chatHistory = [];
    let currentStep = 0;
    let userChoices = [];
    let originalNoClickCount = 0;
    // ============================

    const chatStory = {
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
        console.log("YES button clicked - Starting chat");
        
        // Store the current noClickCount from main game
        window.originalNoClickCount = noClickCount;
        console.log("noClickCount stored:", noClickCount);
        
        // Create visual effects
        createHeartBurst();
        createConfetti();
        
        // Show stickers
        if (typeof createStickers === 'function') {
            createStickers();
        }
        // Update response text before transition
        const responses = [
            "Yay! I knew it! 😼❤️",
            "Ayo fr?? You're not lying right? 😂",
            "Even White Coat Man approves! (maybe) 😾",
            "bbg energy confirmed! ✌️",
            "Hatt! For real? 😭❤️"
        ];
        responseText.textContent = responses[Math.floor(Math.random() * responses.length)];
        
        // Show chat screen after a short delay
        setTimeout(() => {
            questionScreen.classList.remove('active');
            yesScreen.classList.add('active');
            
            // Start chat story
            setTimeout(initChatStory, 500);
            
            // Auto scroll to show chat
            setTimeout(() => {
                document.querySelector('.chat-story-container').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 800);
        }, 800);
    }

    // Initialize chat story
    function initChatStory() {
        console.log("Initializing chat story...");
        
        // Reset chat state
        chatHistory = [];
        currentStep = 0;
        userChoices = [];
        
        // Get chat elements
        const chatDisplay = document.getElementById('chat-display');
        const optionsContainer = document.getElementById('options-container');
        const chatContainer = document.querySelector('.chat-story-container');
        const ratingOverlay = document.getElementById('rating-overlay');
        
        if (!chatDisplay || !optionsContainer) {
            console.error("Chat elements not found!");
            // Fallback to old YES screen
            showRatingOverlay();
            return;
        }
        
        // Make sure chat container is visible and rating is hidden
        if (chatContainer) {
            chatContainer.style.display = 'flex';
            chatContainer.style.opacity = '1';
            chatContainer.style.transform = 'scale(1)';
        }
        if (ratingOverlay) {
            ratingOverlay.style.display = 'none';
        }
        
        // Clear chat display
        chatDisplay.innerHTML = '';
        optionsContainer.innerHTML = '';
        
        // Start chat sequence directly with first message
        setTimeout(() => {
            processStep(0);
        }, 1000);
        
        // Add back button functionality
        const backButton = document.getElementById('back-to-question');
        if (backButton) {
            backButton.addEventListener('click', function() {
                // Reset chat state
                chatHistory = [];
                currentStep = 0;
                userChoices = [];
                
                // Clear chat display
                const chatDisplay = document.getElementById('chat-display');
                if (chatDisplay) {
                    chatDisplay.innerHTML = '';
                }
                
                // Clear options
                const optionsContainer = document.getElementById('options-container');
                if (optionsContainer) {
                    optionsContainer.innerHTML = '';
                }
                
                // Go back to intro
                restartExperience();
            });
        }
        
        console.log("Chat story initialized");
    }

    // Fallback function if chat fails
    function showRatingOverlay() {
        const chatContainer = document.querySelector('.chat-story-container');
        const ratingOverlay = document.getElementById('rating-overlay');
        
        if (chatContainer && ratingOverlay) {
            chatContainer.style.display = 'none';
            ratingOverlay.style.display = 'flex';
        }
    }

    // Add system message
    function addSystemMessage(text) {
        const chatDisplay = document.getElementById('chat-display');
        if (!chatDisplay) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-bubble system-message';
        messageDiv.innerHTML = `<div class="message-content"><p class="context-text">${text}</p><span class="message-time">now</span></div>`;
        
        chatDisplay.appendChild(messageDiv);
        
        // Auto scroll
        setTimeout(() => {
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }, 100);
    }

    // Process a chat step
    function processStep(stepId) {
        currentStep = stepId;
        const step = chatStory.steps.find(s => s.id === stepId);
        if (!step) {
            // End of chat - show rating
            endChatStory();
            return;
        }
        
        switch(step.type) {
            case "zurayn":
                showTypingIndicator(true);
                
                setTimeout(() => {
                    addMessage("zurayn", step.message, step.typingSpeed);
                    showTypingIndicator(false);
                    
                    // Execute special function if exists
                    if (step.special && typeof step.special === 'function') {
                        step.special();
                    }
                    
                    // Check if there's a reference to noClickCount
                    if (originalNoClickCount > 0 && stepId === 2) {
                        setTimeout(() => {
                            addNoCountReference();
                        }, 1000);
                    }
                    
                    // Continue to next step if specified
                    if (step.nextStep !== undefined) {
                        setTimeout(() => {
                            processStep(step.nextStep);
                        }, step.delay || 500);
                    } else {
                        // No next step - end the chat story
                        setTimeout(() => {
                            endChatStory();
                        }, 1500);
                    }
                }, 1000);
                break;
                
            case "options":
                setTimeout(() => {
                    showOptions(step.options);
                }, 800);
                break;
        }
    }

    // Add message to chat
    function addMessage(sender, text, typingSpeed = 40) {
        const chatDisplay = document.getElementById('chat-display');
        
        // Create message bubble
        const messageDiv = document.createElement('div');
        // FIXED: Zurayn = receiver (left), User = sender (right)
        messageDiv.className = `message-bubble ${sender === 'zurayn' ? 'receiver' : 'sender'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Add message text with typing effect
        contentDiv.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(contentDiv);
        chatDisplay.appendChild(messageDiv);
        
        // Animate message
        messageDiv.style.animation = 'messageSlideIn 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        
        // Add to history
        chatHistory.push({
            sender: sender,
            text: text,
            time: new Date()
        });
        
        // Auto scroll to bottom - SMOOTH SCROLLING
        setTimeout(() => {
            chatDisplay.scrollTo({
                top: chatDisplay.scrollHeight,
                behavior: 'smooth'
            });
            
            // Add "seen just now" for USER messages only
            if (sender === 'user') {
                setTimeout(() => {
                    const seenText = document.createElement('span');
                    seenText.className = 'seen-receipt';
                    seenText.textContent = 'Seen just now';
                    contentDiv.appendChild(seenText);
                    
                    // Mark as seen with animation
                    setTimeout(() => {
                        messageDiv.classList.add('message-seen');
                        // Auto scroll again after "seen" appears
                        chatDisplay.scrollTo({
                            top: chatDisplay.scrollHeight,
                            behavior: 'smooth'
                        });
                    }, 300);
                }, 1000);
            }
        }, 100);
    }

    // Show options to user
    function showOptions(options) {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.innerHTML = option.text;
            
            button.addEventListener('click', function() {
                // Animate selection
                button.classList.add('selected');
                
                // Record choice
                userChoices.push({
                    step: currentStep,
                    choice: option.value,
                    text: option.text
                });
                
                // Show user's choice as message
                setTimeout(() => {
                    addMessage("user", option.text, 20);
                    
                    // Clear options
                    optionsContainer.innerHTML = '';
                    
                    // Process next step
                    setTimeout(() => {
                        processStep(option.nextStep);
                    }, 800);
                }, 300);
            });
            
            optionsContainer.appendChild(button);
        });
        
        // Add subtle animation to options
        optionsContainer.style.opacity = '0';
        setTimeout(() => {
            optionsContainer.style.opacity = '1';
            optionsContainer.style.transform = 'translateY(0)';
        }, 10);
    }

    // Show typing indicator
    function showTypingIndicator(show) {
        const chatDisplay = document.getElementById('chat-display');
        
        if (show) {
            // Create Instagram-style typing bubble
            const typingBubble = document.createElement('div');
            typingBubble.className = 'message-bubble receiver typing-bubble';
            typingBubble.id = 'typing-bubble-indicator';
            
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'typing-dots';
            dotsContainer.innerHTML = '<span></span><span></span><span></span>';
            
            typingBubble.appendChild(dotsContainer);
            chatDisplay.appendChild(typingBubble);
            
            // Auto scroll
            setTimeout(() => {
                chatDisplay.scrollTop = chatDisplay.scrollHeight;
            }, 10);
        } else {
            // Remove typing bubble
            const typingBubble = document.getElementById('typing-bubble-indicator');
            if (typingBubble) {
                typingBubble.remove();
            }
        }
    }

    // Add reference to noClickCount if user clicked NO multiple times
    function addNoCountReference() {
        if (originalNoClickCount > 3) {
            const chatDisplay = document.getElementById('chat-display');
            
            const referenceDiv = document.createElement('div');
            referenceDiv.className = 'message-bubble system-message no-count-reference';
            referenceDiv.innerHTML = `(After ${originalNoClickCount} NOs, finally got that YES! 😂)`;
            
            chatDisplay.appendChild(referenceDiv);
            
            // Auto scroll
            setTimeout(() => {
                chatDisplay.scrollTop = chatDisplay.scrollHeight;
            }, 100);
        }
    }

    // Add sticker message
    function addStickerMessage(stickerPath) {
        const chatDisplay = document.getElementById('chat-display');
        
        const stickerDiv = document.createElement('div');
        stickerDiv.className = 'message-bubble sender sticker-message';
        
        const img = document.createElement('img');
        img.src = stickerPath;
        img.alt = 'Sticker';
        img.onerror = function() {
            this.src = 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/svg/1f496.svg';
        };
        
        stickerDiv.appendChild(img);
        chatDisplay.appendChild(stickerDiv);
        
        // Auto scroll
        setTimeout(() => {
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }, 100);
    }

    // End chat story and show rating
    function endChatStory() {
        // Wait 5 seconds before transitioning
        setTimeout(() => {
            // Hide chat interface
            document.querySelector('.chat-story-container').style.opacity = '0';
            document.querySelector('.chat-story-container').style.transform = 'scale(0.95)';
            
            // Show rating overlay after fade
            setTimeout(() => {
                document.querySelector('.chat-story-container').style.display = 'none';
                document.getElementById('rating-overlay').style.display = 'flex';
                
                // Add personalized message based on chat choices
                personalizeRatingMessage();
                
                // Show secret hint after a delay
                setTimeout(() => {
                    const secretHint = document.getElementById('secret-hint-container');
                    if (secretHint) {
                        secretHint.classList.add('show');
                    }
                }, 2000);
            }, 500);
        }, 5000); // Wait 5 seconds before showing rating
    }

    // Personalize rating message based on chat choices
    function personalizeRatingMessage() {
        const finalMessage = document.querySelector('.final-message h4');
        const note = document.querySelector('.rating-note');
        
        // Check user's choices for personalized message
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

    // Get current time for messages
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Auto-scroll to bottom function
    function setupAutoScroll() {
        const chatDisplay = document.getElementById('chat-display');
        if (!chatDisplay) return;
        
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '↓';
        scrollIndicator.title = 'Scroll to latest messages';
        
        chatDisplay.parentElement.appendChild(scrollIndicator);
        
        // Show indicator when not at bottom
        chatDisplay.addEventListener('scroll', function() {
            const isAtBottom = chatDisplay.scrollHeight - chatDisplay.scrollTop <= chatDisplay.clientHeight + 50;
            
            if (isAtBottom) {
                scrollIndicator.classList.remove('show');
            } else {
                scrollIndicator.classList.add('show');
            }
        });
        
        // Scroll to bottom on click
        scrollIndicator.addEventListener('click', function() {
            chatDisplay.scrollTo({
                top: chatDisplay.scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    // Initialize auto-scroll when page loads
    setupAutoScroll();
    
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
        if (!heartBurst) return;
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
        // Show chat container again if it was hidden
        const chatContainer = document.querySelector('.chat-story-container');
        const ratingOverlay = document.getElementById('rating-overlay');
        if (chatContainer) {
            chatContainer.style.display = 'flex';
            chatContainer.style.opacity = '1';
            chatContainer.style.transform = 'scale(1)';
        }
        if (ratingOverlay) {
            ratingOverlay.style.display = 'none';
        }
        
        // Clear any remaining stickers
        const stickersContainer = document.querySelector('.stickers-container');
        if (stickersContainer) {
            stickersContainer.innerHTML = '';
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
                const teaserEl = document.querySelector('.tease-text');
                if (teaserEl) {
                    teaserEl.textContent = randomTeaser;
                }
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
        if (!stickersContainer) return;
        
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

    // ============ ENHANCED SECRET MODE ============
    const secretScreen = document.getElementById('secret-screen');
    const okayBtn = document.getElementById('okay-btn');
    const typedText = document.getElementById('typed-text');
    
    if (secretScreen && okayBtn && typedText) {
        let isSecretModeActive = false;
        let typingTimeout = null;
        let lastShakeTime = 0;
        
        const secretMessage = `I joke a lot, but genuinely talking to you feels easy, hazyyy.
Our chats are never planned, never serious on purpose, but somehow they fit into my day naturally.
You're the first notification I see and the last one before the day ends, and yeah, that quietly makes a difference.

This site, the jokes, the chaos... it's just a small, coded way of saying you matter to me as a friend, more than you probably realize. ❤️

Okay, stopping here before this gets awkward. 😂✌️`;

        // Create romantic background effects
        function createSecretBackground() {
            const heartsContainer = document.querySelector('.secret-hearts-container');
            const particlesContainer = document.querySelector('.secret-particles-container');
            
            if (!heartsContainer || !particlesContainer) return;
            
            // Clear existing
            heartsContainer.innerHTML = '';
            particlesContainer.innerHTML = '';
            
            // Create floating hearts
            const heartEmojis = ['❤️', '💖', '💗', '💓', '💞', '💕', '💌', '🌹', '🌸', '💐'];
            
            for (let i = 0; i < 15; i++) {
                const heart = document.createElement('div');
                heart.classList.add('secret-heart');
                heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                
                // Random position and size
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.fontSize = `${15 + Math.random() * 20}px`;
                heart.style.animationDelay = `${Math.random() * 5}s`;
                heart.style.animationDuration = `${10 + Math.random() * 15}s`;
                
                heartsContainer.appendChild(heart);
            }
            
            // Create floating particles
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.classList.add('secret-particle');
                
                // Random properties
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
        
        // Type message with enhanced animation
        function typeMessage() {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            typedText.innerHTML = '';
            let charIndex = 0;
            let lineIndex = 0;
            
            // Show typing indicator
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.style.display = 'flex';
            }
            
            function typeNextChar() {
                if (charIndex < secretMessage.length) {
                    const currentChar = secretMessage[charIndex];
                    
                    // Handle special formatting
                    if (currentChar === '\n') {
                        typedText.innerHTML += '<br>';
                        lineIndex++;
                        
                        // Add slight delay after line breaks
                        charIndex++;
                        typingTimeout = setTimeout(typeNextChar, 100);
                        return;
                    }
                    
                    // Add character with possible styling
                    let charHtml = currentChar;
                    
                    // Style emojis differently
                    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
                    if (emojiRegex.test(currentChar)) {
                        charHtml = `<span class="secret-emoji">${currentChar}</span>`;
                    }
                    
                    // Style hearts specially
                    if (currentChar === '❤️') {
                        charHtml = `<span class="secret-heart-char" style="color:#ff6b8b">${currentChar}</span>`;
                    }
                    
                    typedText.innerHTML += charHtml;
                    charIndex++;
                    
                    // Auto-scroll only the message box (not the container!)
                    typedText.scrollTo({
                        top: typedText.scrollHeight,
                        behavior: 'smooth'
                    });
                    
                    // Dynamic typing speed for natural feel
                    let speed = 30;
                    
                    // Slower for punctuation and line breaks
                    if (/[.,;!?\n]/.test(currentChar)) {
                        speed = 70;
                    }
                    // Faster for spaces
                    else if (currentChar === ' ') {
                        speed = 20;
                    }
                    // Medium for regular characters
                    else {
                        speed = 40 + Math.random() * 20;
                    }
                    
                    typingTimeout = setTimeout(typeNextChar, speed);
                } else {
                    // Typing complete - hide typing indicator
                    if (typingIndicator) {
                        setTimeout(() => {
                            typingIndicator.style.opacity = '0';
                            setTimeout(() => {
                                typingIndicator.style.display = 'none';
                            }, 300);
                        }, 500);
                    }
                    
                    // Add completion effect
                    typedText.innerHTML += `<span class="typing-complete"> 💫</span>`;
                    
                    // Final scroll to show completion (only scroll the text box)
                    setTimeout(() => {
                        typedText.scrollTo({
                            top: typedText.scrollHeight,
                            behavior: 'smooth'
                        });
                    }, 200);
                    
                    // Show button after 3 seconds
                    setTimeout(() => {
                        const okayBtn = document.getElementById('okay-btn');
                        if (okayBtn) {
                            okayBtn.classList.add('show');
                        }
                    }, 3000);
                }
            }
            
            typeNextChar();
        }
        
        // OK button event
        okayBtn.addEventListener('click', function() {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            // Add button click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Fade out secret screen
            secretScreen.style.opacity = '0';
            secretScreen.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                secretScreen.classList.remove('active');
                document.getElementById('intro-screen').classList.add('active');
                isSecretModeActive = false;
                
                // Reset styles
                secretScreen.style.opacity = '';
                secretScreen.style.transform = '';
            }, 300);
        });
        
        // Enhanced shake detection
        function handleShake(event) {
            if (isSecretModeActive) return;
            
            const acceleration = event.accelerationIncludingGravity;
            if (!acceleration) return;
            
            // Calculate movement intensity
            const movement = Math.abs(acceleration.x || 0) + 
                           Math.abs(acceleration.y || 0) + 
                           Math.abs(acceleration.z || 0);
            
            const now = Date.now();
            
            // More sensitive shake detection
            if (movement > 20 && (now - lastShakeTime) > 2500) {
                lastShakeTime = now;
                
                // Add shake confirmation effect
                document.body.style.transform = 'translateX(5px)';
                setTimeout(() => {
                    document.body.style.transform = 'translateX(-5px)';
                    setTimeout(() => {
                        document.body.style.transform = '';
                    }, 50);
                }, 50);
                
                setTimeout(activateSecretMode, 200);
            }
        }
        
        // Enhanced activate secret mode
        function activateSecretMode() {
            if (isSecretModeActive) return;
            
            isSecretModeActive = true;
            
            // Create romantic background
            createSecretBackground();
            
            // Hide current screen with transition
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
            
            // Show secret screen with effects
            secretScreen.style.opacity = '0';
            secretScreen.style.transform = 'scale(0.9)';
            secretScreen.classList.add('active');
            
            // Animate in
            setTimeout(() => {
                secretScreen.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                secretScreen.style.opacity = '1';
                secretScreen.style.transform = 'scale(1)';
            }, 10);
            
            // Start typing animation with delay
            setTimeout(typeMessage, 800);
        }
        
        // Add shake listener
        if (window.DeviceMotionEvent) {
            // Request permission for iOS 13+
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                document.addEventListener('click', function requestPermissionOnce() {
                    DeviceMotionEvent.requestPermission()
                        .then(permissionState => {
                            if (permissionState === 'granted') {
                                window.addEventListener('devicemotion', handleShake);
                            }
                        })
                        .catch(console.error);
                    
                    document.removeEventListener('click', requestPermissionOnce);
                });
            } else {
                window.addEventListener('devicemotion', handleShake);
            }
        }
        
        // Desktop testing - press 'S' key
        document.addEventListener('keydown', function(e) {
            if ((e.key === 's' || e.key === 'S') && !isSecretModeActive) {
                e.preventDefault();
                
                // Add keypress feedback
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
        
        // Add CSS for emoji styling
        const style = document.createElement('style');
        style.textContent = `
            .secret-emoji {
                display: inline-block;
                animation: gentleFloat 2s ease-in-out infinite;
                margin: 0 2px;
            }
            
            .secret-heart-char {
                display: inline-block;
                animation: gentleHeartbeat 1.5s infinite;
                margin: 0 2px;
            }
            
            .typing-complete {
                opacity: 0;
                animation: fadeIn 0.5s ease 0.3s forwards;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
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

                if (!isMobileDevice()) {
                    const desktopHint = document.createElement('div');
                    desktopHint.className = 'desktop-hint';
                    desktopHint.innerHTML = `<div style="margin-top: 10px; font-size: 0.85rem; color: #888;"><i class="fas fa-keyboard"></i> Desktop tip: Press 'S' key anytime</div>`;
                    const hintTextEl = secretHintContainer.querySelector('.secret-hint-text');
                    if (hintTextEl) {
                        hintTextEl.appendChild(desktopHint);
                    }
                }
            }, 1000);
        });
    }
});