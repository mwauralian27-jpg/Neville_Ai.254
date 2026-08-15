/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║         NEVILLE AI - COPILOT CHATBOT INTERFACE                ║
 * ║    Advanced Chat Functionality with Real-time Animations      ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

// ========================================
// DOM ELEMENTS
// ========================================

const chatInput = document.getElementById('chatInput');
const chatForm = document.getElementById('chatForm');
const btnSend = document.getElementById('btnSend');
const messagesContainer = document.getElementById('messagesContainer');
const messages = document.getElementById('messages');
const welcomeScreen = document.getElementById('welcomeScreen');
const btnNewChat = document.querySelector('.btn-new-chat');
const btnSettings = document.querySelector('.btn-settings');

// ========================================
// STATE & CONFIGURATION
// ========================================

let isWaitingForResponse = false;
let messageCount = 0;
let conversationHistory = [];

const AI_RESPONSES = [
    "That's a fascinating question! Let me break it down for you...",
    "I appreciate your curiosity! Here's what I think about that...",
    "Great inquiry! Let me provide some insights...",
    "That's an excellent point! Here's my perspective...",
    "Interesting! Let me elaborate on that...",
    "That requires some explanation. Here's what I know...",
    "You've touched on something important. Let me explain...",
    "Great question! This is something I can definitely help with...",
];

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    setupEventListeners();
    console.log('✨ Neville AI Initialized Successfully!');
});

function initializeChat() {
    chatInput.focus();
    btnSend.disabled = true;
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Form submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message && !isWaitingForResponse) {
            sendMessage(message);
        }
    });

    // Input field events
    chatInput.addEventListener('input', () => {
        autoResizeTextarea();
        updateSendButtonState();
    });

    // Keyboard shortcuts
    chatInput.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to send
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (chatInput.value.trim() && !isWaitingForResponse) {
                chatForm.dispatchEvent(new Event('submit'));
            }
        }
        // Shift + Enter for new line
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            const start = chatInput.selectionStart;
            const end = chatInput.selectionEnd;
            const value = chatInput.value;
            chatInput.value = value.substring(0, start) + '\n' + value.substring(end);
            chatInput.selectionStart = chatInput.selectionEnd = start + 1;
            autoResizeTextarea();
        }
    });

    // New chat button
    btnNewChat.addEventListener('click', resetChat);

    // Settings button
    btnSettings.addEventListener('click', () => {
        showNotification('⚙️ Settings feature coming soon!', 'info');
    });
}

// ========================================
// AUTO-RESIZE TEXTAREA
// ========================================

function autoResizeTextarea() {
    chatInput.style.height = 'auto';
    const newHeight = Math.min(chatInput.scrollHeight, 120);
    chatInput.style.height = newHeight + 'px';
}

// ========================================
// SEND BUTTON STATE
// ========================================

function updateSendButtonState() {
    const hasText = chatInput.value.trim().length > 0;
    btnSend.disabled = !hasText || isWaitingForResponse;
}

// ========================================
// SEND MESSAGE
// ========================================

function sendMessage(message) {
    if (!message || isWaitingForResponse) return;

    // Hide welcome screen on first message
    if (welcomeScreen && welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
        }, 300);
    }

    isWaitingForResponse = true;
    messageCount++;

    // Add user message
    addMessage(message, 'user');

    // Store in conversation history
    conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
    });

    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    updateSendButtonState();

    // Scroll to bottom
    scrollToBottom();

    // Show typing indicator after a brief delay
    setTimeout(() => {
        showTypingIndicator();
    }, 300);

    // Simulate AI thinking and response
    const thinkingTime = 1500 + Math.random() * 2000;
    setTimeout(() => {
        removeTypingIndicator();
        
        // Generate AI response
        const aiResponse = generateAIResponse(message);
        typeMessage(aiResponse, 'assistant');
        
        // Store in history
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
        });
        
        isWaitingForResponse = false;
        updateSendButtonState();
        chatInput.focus();
    }, thinkingTime);
}

// ========================================
// ADD MESSAGE (User message)
// ========================================

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    bubble.textContent = content;
    
    messageDiv.appendChild(bubble);
    messages.appendChild(messageDiv);
    
    scrollToBottom();
}

// ========================================
// TYPE MESSAGE (Character by character animation)
// ========================================

function typeMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    bubble.innerHTML = '';
    
    messageDiv.appendChild(bubble);
    messages.appendChild(messageDiv);
    
    let charIndex = 0;
    const baseSpeed = 25; // milliseconds per character
    
    function typeNextChar() {
        if (charIndex < content.length) {
            const char = content[charIndex];
            bubble.textContent += char;
            charIndex++;
            
            // Vary speed for natural feel
            const randomDelay = baseSpeed + (Math.random() * 15 - 8);
            setTimeout(typeNextChar, randomDelay);
            
            // Scroll on every few characters for long messages
            if (charIndex % 15 === 0) {
                scrollToBottom();
            }
        } else {
            scrollToBottom();
        }
    }
    
    // Start typing with small delay
    setTimeout(typeNextChar, 50);
}

// ========================================
// TYPING INDICATOR
// ========================================

function showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'assistant');
    messageDiv.id = 'typing-indicator';
    
    const container = document.createElement('div');
    container.classList.add('typing-container');
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        container.appendChild(dot);
    }
    
    messageDiv.appendChild(container);
    messages.appendChild(messageDiv);
    
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => indicator.remove(), 300);
    }
}

// ========================================
// GENERATE AI RESPONSE (Smart responses)
// ========================================

function generateAIResponse(userMessage) {
    const keyword = userMessage.toLowerCase();
    
    // Smart responses based on keywords
    if (keyword.includes('hello') || keyword.includes('hi')) {
        return `👋 Hello! Thanks for reaching out. I'm Neville AI, your intelligent conversation partner. How can I assist you today? Whether you need information, brainstorming help, or just someone to chat with, I'm here to help!`;
    }
    
    if (keyword.includes('how are you') || keyword.includes('how do you')) {
        return `I'm functioning at optimal levels, thank you for asking! 😊 As an AI, I don't experience emotions the way humans do, but I'm always ready and eager to help you. What would you like to discuss?`;
    }
    
    if (keyword.includes('name') || keyword.includes('who are you')) {
        return `I'm Neville AI! I'm an advanced conversational AI designed to assist you with a wide range of topics. I can help with explanations, creative writing, problem-solving, coding questions, and much more. What interests you?`;
    }
    
    if (keyword.includes('help')) {
        return `Of course! I'm here to help. I can assist you with:\n\n✓ Answering questions on virtually any topic\n✓ Explaining complex concepts\n✓ Brainstorming ideas\n✓ Writing assistance\n✓ Coding help\n✓ Problem-solving\n✓ And much more!\n\nWhat specifically can I help you with?`;
    }
    
    if (keyword.includes('time') || keyword.includes('date')) {
        const now = new Date();
        return `It's currently ${now.toLocaleString()}. Is there something time-sensitive I can help you with?`;
    }
    
    if (keyword.includes('thank')) {
        return `You're very welcome! 😊 I'm happy to help. Feel free to ask me anything else you're curious about!`;
    }
    
    if (keyword.includes('bye') || keyword.includes('goodbye')) {
        return `Goodbye! It's been great chatting with you. Feel free to come back anytime you need assistance. Take care! 👋`;
    }

    if (keyword.includes('quantum')) {
        return `Quantum computing is a revolutionary technology that uses quantum mechanics principles! 🚀

Here's the simple breakdown:

**Traditional Computers:**
- Use bits (0 or 1)
- Process information sequentially

**Quantum Computers:**
- Use qubits (can be 0, 1, or BOTH simultaneously)
- Process multiple possibilities at once
- Can solve certain problems exponentially faster

**Real-world applications:**
- Drug discovery and molecular simulation
- Financial modeling and optimization
- Cryptography and security
- Weather prediction

The main challenge is that qubits are extremely fragile and require near absolute-zero temperatures to maintain their quantum state!

Would you like to know more about any specific aspect of quantum computing?`;
    }

    if (keyword.includes('road trip')) {
        return `Great idea! Here's a framework for planning an amazing week-long road trip:

**Week 1 Road Trip Planner:**

📍 **Day 1-2: Research & Preparation**
- Choose your route and destinations
- Book accommodations in advance
- Plan daily driving distances (6-8 hours max)
- Create a packing list

🚗 **Day 3-6: The Journey**
- Start early mornings
- Take scenic routes when possible
- Stop at local attractions
- Try regional food
- Document your journey

💰 **Budget Tips:**
- Book hotels early for discounts
- Use apps like GasBuddy for fuel prices
- Pack snacks and drinks
- Look for free attractions

🎯 **Pro Tips:**
- Alternate drivers every 2 hours
- Keep emergency supplies in car
- Share the itinerary with someone
- Stay flexible with your plans

What type of destination interests you? (Beach, Mountains, Cities, etc.)`;
    }

    if (keyword.includes('ai trends')) {
        return `Here are the latest AI trends shaping the industry in 2026:

🔮 **Top AI Trends:**

1️⃣ **Multimodal AI**
- AI that understands text, images, audio, and video
- More natural human-computer interaction

2️⃣ **AI Agents**
- Autonomous systems that take actions independently
- Better at complex problem-solving

3️⃣ **Retrieval-Augmented Generation (RAG)**
- AI accessing real-time information
- More accurate and up-to-date responses

4️⃣ **Efficient AI**
- Smaller, faster models
- Running AI on edge devices and phones

5️⃣ **AI Safety & Ethics**
- Better regulation and standards
- Focus on responsible AI development

6️⃣ **Enterprise AI**
- Widespread business adoption
- Custom AI solutions for industries

7️⃣ **Generative AI Expansion**
- Beyond text (video, audio, code generation)
- More creative applications

8️⃣ **AI-Human Collaboration**
- Augmenting human capabilities
- Not replacing, but enhancing

What aspect of AI trends interests you most?`;
    }
    
    // Default response with context
    const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    
    return `${randomResponse}

Regarding "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}", here are some key points to consider:

• **Understanding the fundamentals** - It's important to grasp the core concepts first
• **Exploring practical applications** - See how this relates to real-world scenarios
• **Building on your knowledge** - Each insight builds toward deeper understanding
• **Applying what you learn** - Theory becomes valuable through application

I'm here to help you dive deeper into this topic! Feel free to ask for more specific information, examples, or clarification on any aspect.`;
}

// ========================================
// SCROLL TO BOTTOM
// ========================================

function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 0);
}

// ========================================
// RESET CHAT
// ========================================

function resetChat() {
    // Confirmation dialog
    if (messageCount > 0) {
        if (!confirm('Are you sure you want to start a new conversation? Your current chat will be cleared.')) {
            return;
        }
    }

    // Clear all messages
    messages.innerHTML = '';
    messageCount = 0;
    isWaitingForResponse = false;
    conversationHistory = [];
    
    // Show welcome screen
    welcomeScreen.style.display = 'flex';
    welcomeScreen.style.opacity = '1';
    
    // Reset input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    updateSendButtonState();
    chatInput.focus();
    
    showNotification('✨ Chat cleared. Starting fresh! 🎉', 'success');
}

// ========================================
// NOTIFICATIONS
// ========================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        background: ${type === 'success' ? '#51cf66' : type === 'error' ? '#ff6b6b' : '#0066cc'};
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        animation: slideInDown 0.3s ease-out;
        z-index: 9999;
        font-size: 0.95rem;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// EXPORT FUNCTION FOR BUTTON CLICKS
// ========================================

window.sendMessage = sendMessage;

// ========================================
// DEBUG LOG & WELCOME MESSAGE
// ========================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║         🤖 NEVILLE AI - COPILOT CHAT INTERFACE              ║
║              Ready to Assist & Converse!                      ║
╚════════════════════════════════════════════════════════════════╝

✨ Features Enabled:
  ✓ Real-time message typing animation
  ✓ Advanced conversational AI with smart responses
  ✓ Responsive design for all devices
  ✓ Smooth transitions & particle animations
  ✓ Conversation history tracking
  ✓ Intelligent message routing

⌨️  Keyboard Shortcuts:
  • Ctrl/Cmd + Enter: Send message
  • Shift + Enter: Create new line
  • Click 'New Chat': Reset conversation

💡 Tips:
  • Try asking about quantum computing!
  • Get help planning a road trip
  • Ask about latest AI trends
  • Ask anything - I'm here to help!

Version: 1.0.0 | Status: Online 🟢
`);
