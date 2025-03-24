document.addEventListener('DOMContentLoaded', function() {
    // Get user data using the correct key from signUp.js
    let userData = localStorage.getItem("user");
    
    // FOR TESTING: Create a test user if none exists
    if (!userData) {
        console.log("No user found, creating test user");
        const testUser = {
            username: "Test User",
            email: "test@example.com"
        };
        localStorage.setItem("user", JSON.stringify(testUser));
        userData = JSON.stringify(testUser);
    }

    const user = JSON.parse(userData);
    
    // Update welcome message with username
    const welcomeMessage = document.getElementById('welcome-user');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome to Kenya Law Chatbot, ${user.username || 'User'}! `;         
    }
    
    // DOM elements
    const botIframe = document.getElementById('bot-iframe');
    const newChatButton = document.getElementById('new-chat');
    const chatHistory = document.getElementById('chat-history');

    // Handle logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem("user");  // Use the same key as in signUp.js
            window.location.href = "login.html";
        });
    }

    // Handle new chat button
    if (newChatButton) {
        newChatButton.addEventListener('click', function() {
            // Refresh the iframe to start a new conversation
            if (botIframe) {
                botIframe.src = botIframe.src;
            }
            
            // Update history display
            document.querySelectorAll('.history-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add a new history item if needed
            if (chatHistory && chatHistory.firstElementChild) {
                chatHistory.firstElementChild.classList.add('active');
            }
        });
    }

    // DOM elements
    const conversationContainer = document.getElementById('conversation');
    const queryInput = document.getElementById('query-input');
    const sendButton = document.getElementById('send-btn');

    // Set up message listener for iframe communication
    window.addEventListener('message', function(event) {
        // Only accept messages from the bot iframe
        if (event.source !== botIframe.contentWindow) {
            return;
        }
        
        // Process messages from the bot
        try {
            const message = event.data;
            if (message.type === 'response') {
                // Add bot response to the conversation
                addMessage('response', message.text);
            }
        } catch (error) {
            console.error('Error processing message from bot:', error);
        }
    });

    // Handle sending messages
    function sendMessage() {
        const query = queryInput.value.trim();
        if (!query) return;
        
        // Add the user query to the conversation
        addMessage('query', query);
        
        // Send message to the iframe
        try {
            botIframe.contentWindow.postMessage({
                type: 'query',
                text: query
            }, '*');
        } catch (error) {
            console.error('Error sending message to bot:', error);
            // Fallback response if iframe communication fails
            setTimeout(() => {
                addMessage('response', 'Sorry, I\'m having trouble connecting to the legal database. Please try again later.');
            }, 1000);
        }
        
        // Clear the input
        queryInput.value = '';
        
        // Add to chat history
        addChatToHistory(query);
    }

    // Create a new message in the conversation
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        if (type === 'query') {
            messageDiv.innerHTML = `<div class="query">${content}</div>`;
        } else {
            messageDiv.innerHTML = `<div class="response">${content}</div>`;
        }
        
        conversationContainer.appendChild(messageDiv);
        
        // Scroll to the bottom
        conversationContainer.scrollTop = conversationContainer.scrollHeight;
    }

    // Add a chat to the history sidebar
    function addChatToHistory(title) {
        if (title.length > 30) {
            title = title.substring(0, 27) + '...';
        }
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = title;
        
        // Make all items inactive
        document.querySelectorAll('.history-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Make this one active
        historyItem.classList.add('active');
        
        // Add to the top of the list
        chatHistory.insertBefore(historyItem, chatHistory.firstChild);
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Adjust textarea height as user types
    queryInput.addEventListener('input', () => {
        queryInput.style.height = 'auto';
        queryInput.style.height = Math.min(queryInput.scrollHeight, 150) + 'px';
    });

    // Import Firebase auth
    // import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
    // import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
  
    // Your Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAoQEyfcaUTYwYsZXcKtaYYYtk7dBapHeA",
      authDomain: "kenya-law-chatbot.firebaseapp.com",
      projectId: "kenya-law-chatbot",
      storageBucket: "kenya-law-chatbot.firebasestorage.app",
      messagingSenderId: "1071459759295",
      appId: "1:1071459759295:web:b2e6c1348dc917865a420a",
      measurementId: "G-ZYSC5K2CKZ"
    };
  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
  
    // Set up logout functionality
    document.addEventListener('DOMContentLoaded', () => {
      const logoutBtn = document.getElementById('logout-btn');
      
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          try {
            // Sign out from Firebase
            await signOut(auth);
            
            // Clear local user data
            localStorage.removeItem('user');
            
            // Redirect to login page
            window.location.href = 'login.html';
          } catch (error) {
            console.error('Error signing out:', error);
            alert('Failed to sign out. Please try again.');
          }
        });
      }
    });
  
    // Check if user is logged in
    document.addEventListener('DOMContentLoaded', () => {
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        // Not logged in, redirect to login page
        window.location.href = 'login.html';
        return;
      }
      
      try {
        const user = JSON.parse(userData);
        
        if (!user.isLoggedIn) {
          // User data exists but not logged in
          window.location.href = 'login.html';
          return;
        }
        
        // User is logged in, update welcome message if needed
        const welcomeUser = document.getElementById('welcome-user');
        if (welcomeUser && user.name) {
          welcomeUser.textContent = `Welcome to Kenyan Law Chatbot, ${user.name}!`;
        } else if (welcomeUser && user.username) {
          welcomeUser.textContent = `Welcome to Kenyan Law Chatbot, ${user.username}!`;
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = 'login.html';
      }
    });

});