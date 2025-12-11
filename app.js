// Pawgress - Shared JavaScript Utilities

// Animal data
const animals = {
    koko: { emoji: '🐨', name: 'Koko', color: '#D0E7E8', image: 'koko.jpg' },
    bobo: { emoji: '🐰', name: 'Bobo', color: '#D6D0E8', image: 'bobo.jpg' },
    gigi: { emoji: '🦒', name: 'Gigi', color: '#E8D0DC', image: 'gigi.jpg' },
    fifi: { emoji: '🐸', name: 'Fifi', color: '#D0E8DA', image: 'fifi.jpg' }
};

// Praise icons for random assignment
const praiseIcons = [
    '<svg viewBox="0 0 24 24" fill="#E0CAEF" stroke="#B8A0D4" stroke-width="1.5" style="width: 24px; height: 24px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    '<svg viewBox="0 0 24 24" fill="#E0CAEF" stroke="#B8A0D4" stroke-width="1.5" style="width: 24px; height: 24px;"><path d="M12 2l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z"></path><path d="M12 8l-2 4-4 1 3 3-1 4 4-2 4 2-1-4 3-3-4-1z"></path></svg>',
    '<svg viewBox="0 0 24 24" fill="#E0CAEF" stroke="#B8A0D4" stroke-width="1.5" style="width: 24px; height: 24px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    '<svg viewBox="0 0 24 24" fill="#E0CAEF" stroke="#B8A0D4" stroke-width="1.5" style="width: 24px; height: 24px;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>'
];

// Local storage keys
const STORAGE_KEYS = {
    SELECTED_ANIMAL: 'pawgress_selected_animal',
    USER_EMAIL: 'pawgress_user_email',
    SAVED_PRAISES: 'pawgress_saved_praises',
    TASKS: 'pawgress_tasks',
    CURRENT_DATE: 'pawgress_current_date'
};

// Get selected animal from localStorage
function getSelectedAnimal() {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_ANIMAL);
}

// Set selected animal to localStorage
function setSelectedAnimal(animal) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_ANIMAL, animal);
}

// Get user email from localStorage
function getUserEmail() {
    return localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
}

// Set user email to localStorage
function setUserEmail(email) {
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
}

// Get saved praises from localStorage
function getSavedPraises() {
    const praises = localStorage.getItem(STORAGE_KEYS.SAVED_PRAISES);
    const userPraises = praises ? JSON.parse(praises) : [];
    
    // Get user's selected animal
    const selectedAnimal = getSelectedAnimal();
    const animalName = selectedAnimal ? animals[selectedAnimal].name : 'Koko';
    
    // Sample praises that always display with user's selected animal
    const samplePraises = [
        {
            message: "You've been doing amazing work this week! Your consistency in completing tasks shows real dedication. Every small step you take is building toward something great. Keep up the fantastic momentum!",
            animal: animalName,
            date: "2025.12.05"
        },
        {
            message: "I'm so proud of how you're tackling your goals! Remember, progress isn't always about big leaps—it's about showing up every day. You're creating positive habits that will last a lifetime!",
            animal: animalName,
            date: "2025.12.03"
        },
        {
            message: "Your determination is truly inspiring! Each task you complete is proof that you're committed to becoming the best version of yourself. Keep believing in your journey—you're doing wonderfully!",
            animal: animalName,
            date: "2025.12.01"
        }
    ];
    
    // Always include sample praises at the end
    return [...userPraises, ...samplePraises];
}

// Save praise to localStorage
function savePraise(praise) {
    const praises = getSavedPraises();
    praises.unshift(praise);
    localStorage.setItem(STORAGE_KEYS.SAVED_PRAISES, JSON.stringify(praises));
}

// Format date as YYYY.MM.DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// Get current date
function getCurrentDate() {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_DATE);
    return stored ? new Date(stored) : new Date();
}

// Set current date
function setCurrentDate(date) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DATE, date.toISOString());
}

// Check if user is logged in
function isLoggedIn() {
    return !!getUserEmail();
}

// Clear all user data (logout)
function clearUserData() {
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_ANIMAL);
}

// Generate praise messages (can be expanded)
const praiseMessages = [
    "Great job on completing your task! Every small step counts toward building better habits. Keep up the amazing work!",
    "You're making excellent progress! Remember, consistency is key to success. I'm so proud of you!",
    "Amazing dedication! Your commitment to self-improvement is truly inspiring. Keep moving forward!",
    "Fantastic work today! Every accomplishment, no matter how small, is a victory worth celebrating. You're doing great!",
    "Well done! Your persistence and hard work are paying off. Continue to believe in yourself!",
    "You're on fire! Each task completed is a step closer to your goals. Keep pushing forward!",
    "Incredible effort! Your dedication is truly admirable. You should be proud of yourself!",
    "Outstanding work! You're building momentum and creating positive habits. Keep it up!",
    "Excellent progress! Every action you take is moving you in the right direction. Stay motivated!",
    "Wonderful achievement! Your commitment to growth and improvement is inspiring. Keep going!"
];

// Get random praise message
function getRandomPraiseMessage() {
    return praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
}

// Get random praise icon
function getRandomPraiseIcon() {
    return praiseIcons[Math.floor(Math.random() * praiseIcons.length)];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        animals,
        praiseIcons,
        STORAGE_KEYS,
        getSelectedAnimal,
        setSelectedAnimal,
        getUserEmail,
        setUserEmail,
        getSavedPraises,
        savePraise,
        formatDate,
        getCurrentDate,
        setCurrentDate,
        isLoggedIn,
        clearUserData,
        getRandomPraiseMessage,
        getRandomPraiseIcon
    };
}
