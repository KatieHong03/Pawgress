// Dashboard functionality
const fab = document.getElementById('fab');
const keyboard = document.getElementById('keyboard');
const inputContainer = document.getElementById('inputContainer');
const inputField = document.getElementById('inputField');
const listItems = document.getElementById('listItems');
const emptyStateMessage = document.getElementById('emptyStateMessage');
const emptyStateIcon = document.getElementById('emptyStateIcon');
const dateBadge = document.getElementById('dateBadge');
const dateText = document.getElementById('dateText');
const calendarModal = document.getElementById('calendarModal');
const calendarGrid = document.getElementById('calendarGrid');
const monthYear = document.getElementById('monthYear');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const calendarBackBtn = document.getElementById('calendarBackBtn');
const calendarDateText = document.getElementById('calendarDateText');
const praiseButton = document.getElementById('praiseButton');
const praisePopup = document.getElementById('praisePopup');
const praiseCard = document.getElementById('praiseCard');
const savedPraisesIcon = document.getElementById('savedPraisesIcon');
const profileIcon = document.getElementById('profileIcon');

let isInputActive = false;
let currentDate = new Date(); // Always use actual current date
let selectedDate = new Date(); // Always start with current date
let selectedAnimal = getSelectedAnimal();
let completedTasks = 0;
let hasCompletedTask = false;

// Version control for sample data - increment this to force regenerate samples
const SAMPLE_DATA_VERSION = 2;

// Check authentication
if (!isLoggedIn()) {
    window.location.href = 'login.html';
}

if (!selectedAnimal) {
    window.location.href = 'select-animal.html';
}

// Clear old sample data if version changed
const currentVersion = localStorage.getItem('pawgress_sample_version');
if (currentVersion !== String(SAMPLE_DATA_VERSION)) {
    // Clear all task and praise data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('pawgress_tasks_') || key.startsWith('pawgress_praise_')) {
            localStorage.removeItem(key);
        }
    });
    localStorage.setItem('pawgress_sample_version', String(SAMPLE_DATA_VERSION));
    console.log('Sample data cleared and will be regenerated');
}

// Clear today's done list on page load
const todayKey = getTasksStorageKey(new Date());
localStorage.removeItem(todayKey);
console.log('Today\'s done list cleared');

// Initialize date display
updateDateDisplay();
loadTasksForSelectedDate();

/**
 * DATE-BASED LOGIC OVERVIEW:
 * 
 * 1. TODAY (current date):
 *    - User CAN add new tasks (FAB visible)
 *    - User CAN check/uncheck tasks (interactive checkboxes)
 *    - User CAN delete tasks (delete button visible)
 *    - User CAN claim "Get Praise" reward
 *    - All edits are saved to date-specific localStorage
 * 
 * 2. PAST DATE WITH RECORDS:
 *    - Auto-generates sample tasks if no data exists (for demo)
 *    - User CANNOT add tasks (FAB hidden)
 *    - User CANNOT edit tasks (checkboxes read-only)
 *    - User CANNOT delete tasks (delete button hidden)
 *    - User CANNOT claim rewards (no "Get Praise")
 *    - Shows "Praise Review" button to view past praise
 *    - Read-only view of historical data
 * 
 * 3. PAST DATE WITHOUT RECORDS:
 *    - Shows "No Records" empty state
 *    - FAB hidden (cannot add tasks)
 *    - No "Praise Review" button
 *    - Completely read-only
 * 
 * 4. FUTURE DATES (after today):
 *    - Shows "Add event tomorrow" placeholder
 *    - FAB hidden (cannot add tasks yet)
 *    - No action buttons
 *    - Completely disabled
 */

// Helper function to check if a date is today
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Helper function to check if a date is in the past
function isPastDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
}

// Helper function to check if a date is in the future
function isFutureDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
}

// Helper function to get storage key for a specific date
function getTasksStorageKey(date) {
    const dateStr = formatDate(date);
    return `pawgress_tasks_${dateStr}`;
}

// Helper function to get praise storage key for a specific date
function getPraiseStorageKey(date) {
    const dateStr = formatDate(date);
    return `pawgress_praise_${dateStr}`;
}

// Sample tasks for past dates (for demo purposes)
function generateSampleTasksForPastDate(date) {
    const sampleTaskSets = [
        [
            { text: 'Morning meditation', completed: true },
            { text: 'Finished project report', completed: true },
            { text: 'Gym workout', completed: true },
            { text: 'Read 30 pages', completed: true }
        ],
        [
            { text: 'Cleaned the house', completed: true },
            { text: 'Grocery shopping', completed: true },
            { text: 'Called mom', completed: true }
        ],
        [
            { text: 'Team meeting preparation', completed: true },
            { text: 'Replied to emails', completed: true },
            { text: 'Lunch with Sarah', completed: true },
            { text: 'Evening walk', completed: true }
        ],
        [
            { text: 'Yoga session', completed: true },
            { text: 'Meal prep for the week', completed: true },
            { text: 'Organized workspace', completed: true }
        ],
        [
            { text: 'Finished coding task', completed: true },
            { text: 'Updated documentation', completed: true },
            { text: 'Coffee with friend', completed: true }
        ]
    ];
    
    // Use date to deterministically select a sample set
    const dayOfMonth = date.getDate();
    const setIndex = dayOfMonth % sampleTaskSets.length;
    return sampleTaskSets[setIndex];
}

// Generate sample praise for past dates
function generateSamplePraiseForPastDate(date, tasks) {
    const completedTasks = tasks.filter(t => t.completed);
    const animal = animals[selectedAnimal];
    
    const praiseSamples = [
        "You crushed it that day! Every task you completed shows your dedication. Keep up the amazing momentum! 💛",
        "What a productive day! You handled everything with grace and determination. You're doing wonderfully! 💛",
        "Look at all you accomplished! Each completed task is a step forward. You're making great progress! 💛",
        "That was a fantastic day! You showed up and got things done. Be proud of yourself! 💛",
        "Amazing work! You tackled your tasks with such focus. Keep believing in yourself! 💛"
    ];
    
    const dayOfMonth = date.getDate();
    const praiseIndex = dayOfMonth % praiseSamples.length;
    
    return {
        message: praiseSamples[praiseIndex],
        date: formatDate(date),
        animal: animal.name,
        tasks: completedTasks.map(t => t.text)
    };
}

// Load tasks for the selected date
function loadTasksForSelectedDate() {
    const storageKey = getTasksStorageKey(selectedDate);
    let savedTasks = localStorage.getItem(storageKey);
    
    // Clear current list
    listItems.innerHTML = '';
    
    const isCurrentDay = isToday(selectedDate);
    const isPast = isPastDate(selectedDate);
    const isFuture = isFutureDate(selectedDate);
    
    if (isFuture) {
        // Future date: Show placeholder message with animal icon
        const animal = animals[selectedAnimal];
        if (animal && animal.image) {
            emptyStateIcon.src = animal.image;
            emptyStateIcon.classList.add('visible');
            emptyStateMessage.classList.add('with-icon');
        } else {
            emptyStateIcon.classList.remove('visible');
            emptyStateMessage.classList.remove('with-icon');
        }
        emptyStateMessage.textContent = 'To be added in the future...';
        emptyStateMessage.classList.add('visible');
        updateUIForDateContext();
        return;
    }
    
    if (isPast && !savedTasks) {
        // Generate sample tasks for past dates that don't have records
        const sampleTasks = generateSampleTasksForPastDate(selectedDate);
        localStorage.setItem(storageKey, JSON.stringify(sampleTasks));
        
        // Generate and save sample praise
        const samplePraise = generateSamplePraiseForPastDate(selectedDate, sampleTasks);
        const praiseKey = getPraiseStorageKey(selectedDate);
        localStorage.setItem(praiseKey, JSON.stringify(samplePraise));
        
        savedTasks = JSON.stringify(sampleTasks);
    }
    
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        
        tasks.forEach(task => {
            addListItem(task.text, task.completed, isPast);
        });
    }
    
    updateEmptyState();
    updateUIForDateContext();
}

// Save tasks for the selected date
function saveTasksForSelectedDate() {
    const storageKey = getTasksStorageKey(selectedDate);
    const tasks = [];
    
    const items = listItems.querySelectorAll('.list-item');
    items.forEach(item => {
        const text = item.querySelector('.list-item-text').textContent;
        const completed = item.querySelector('.checkbox').classList.contains('checked');
        tasks.push({ text, completed });
    });
    
    localStorage.setItem(storageKey, JSON.stringify(tasks));
}

// Update UI based on date context (today vs past vs future)
function updateUIForDateContext() {
    const isCurrentDay = isToday(selectedDate);
    const isPast = isPastDate(selectedDate);
    const isFuture = isFutureDate(selectedDate);
    const hasRecords = listItems.children.length > 0;
    
    // Check if all tasks are completed
    const allTasksCompleted = checkIfAllTasksCompleted();
    
    if (isFuture) {
        // Future date: Hide everything, show placeholder with animal icon
        fab.style.display = 'none';
        praiseButton.style.display = 'none';
        praiseButton.classList.remove('visible');
        const animal = animals[selectedAnimal];
        if (animal && animal.image) {
            emptyStateIcon.src = animal.image;
            emptyStateIcon.classList.add('visible');
            emptyStateMessage.classList.add('with-icon');
        }
        emptyStateMessage.textContent = 'To be added in the future...';
    } else if (isCurrentDay) {
        // Today: Show FAB, hide Get Praise button initially (only shows when ALL tasks are completed)
        fab.style.display = 'flex';
        emptyStateIcon.classList.remove('visible');
        emptyStateMessage.classList.remove('with-icon');
        praiseButton.innerHTML = `
            <img src="ai.jpg" alt="AI" class="praise-icon" style="object-fit: cover; border-radius: 50%;">
            Get Praise
        `;
        praiseButton.onclick = handleGetPraise;
        emptyStateMessage.textContent = 'What did you get done today?';
        
        // Only show praise button if there are tasks AND all are completed
        if (hasRecords && allTasksCompleted) {
            praiseButton.style.display = 'flex';
            praiseButton.classList.add('visible');
        } else {
            praiseButton.style.display = 'none';
            praiseButton.classList.remove('visible');
        }
    } else if (isPast) {
        // Past date
        fab.style.display = 'none'; // Hide FAB (cannot add tasks)
        emptyStateIcon.classList.remove('visible');
        emptyStateMessage.classList.remove('with-icon');
        
        if (hasRecords) {
            // Past date WITH records: Show "Praise Review" button
            praiseButton.style.display = 'flex';
            praiseButton.classList.add('visible');
            praiseButton.innerHTML = `
                <img src="ai.jpg" alt="AI" class="praise-icon" style="object-fit: cover; border-radius: 50%;">
                Praise Review
            `;
            praiseButton.onclick = handlePraiseReview;
        } else {
            // Past date WITHOUT records: Hide button or show "No Records"
            praiseButton.style.display = 'none';
            praiseButton.classList.remove('visible');
        }
        
        emptyStateMessage.textContent = 'No Records';
    }
}

// Helper function to check if all tasks are completed
function checkIfAllTasksCompleted() {
    const allTasks = listItems.querySelectorAll('.list-item');
    if (allTasks.length === 0) return false;
    
    const completedTasks = listItems.querySelectorAll('.checkbox.checked');
    return allTasks.length === completedTasks.length;
}

// Function to update empty state visibility
function updateEmptyState() {
    const isPast = isPastDate(selectedDate);
    const isFuture = isFutureDate(selectedDate);
    const hasRecords = listItems.children.length > 0;
    
    if (!hasRecords) {
        emptyStateMessage.classList.add('visible');
        // Show animal icon only for future dates
        if (isFuture) {
            const animal = animals[selectedAnimal];
            if (animal && animal.image) {
                emptyStateIcon.src = animal.image;
                emptyStateIcon.classList.add('visible');
                emptyStateMessage.classList.add('with-icon');
            }
        }
    } else {
        emptyStateMessage.classList.remove('visible');
        emptyStateIcon.classList.remove('visible');
        emptyStateMessage.classList.remove('with-icon');
    }
}

// Initialize empty state
updateEmptyState();

// Navigation handlers
savedPraisesIcon.addEventListener('click', () => {
    window.location.href = 'praises.html';
});

profileIcon.addEventListener('click', () => {
    window.location.href = 'profile.html';
});

// Calendar functions
let tempSelectedDate = null;

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const existingDays = calendarGrid.querySelectorAll('.calendar-day');
    existingDays.forEach(day => day.remove());

    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(day);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;

        // Check if this is the currently selected date (either temp or actual)
        const dateToCheck = tempSelectedDate || selectedDate;
        if (year === dateToCheck.getFullYear() && 
            month === dateToCheck.getMonth() && 
            i === dateToCheck.getDate()) {
            day.classList.add('selected');
        }

        const today = new Date();
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            i === today.getDate()) {
            day.classList.add('today');
        }

        day.addEventListener('click', () => {
            // Remove selected class from all days
            const allDays = calendarGrid.querySelectorAll('.calendar-day');
            allDays.forEach(d => d.classList.remove('selected'));
            
            // Add selected class to clicked day
            day.classList.add('selected');
            
            // Store temporarily selected date
            tempSelectedDate = new Date(year, month, i);
            
            // Update the calendar date text display
            calendarDateText.textContent = formatDate(tempSelectedDate);
        });

        calendarGrid.appendChild(day);
    }

    const totalCells = firstDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calendarGrid.appendChild(day);
    }
}

function updateDateDisplay() {
    dateText.textContent = formatDate(selectedDate);
    calendarDateText.textContent = formatDate(selectedDate);
}

// Calendar event listeners
dateBadge.addEventListener('click', () => {
    calendarModal.classList.add('active');
    tempSelectedDate = null; // Reset temp selection when opening calendar
    renderCalendar();
});

calendarModal.addEventListener('click', (e) => {
    if (e.target === calendarModal) {
        tempSelectedDate = null; // Reset temp selection if clicking outside
        calendarModal.classList.remove('active');
    }
});

calendarBackBtn.addEventListener('click', () => {
    // Only update the actual selected date if user clicked a date
    if (tempSelectedDate) {
        selectedDate = tempSelectedDate;
        currentDate = new Date(tempSelectedDate);
        setCurrentDate(selectedDate);
        updateDateDisplay();
        loadTasksForSelectedDate(); // Load tasks for the newly selected date
    }
    tempSelectedDate = null; // Reset temp selection
    calendarModal.classList.remove('active');
});

prevMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// FAB and keyboard functionality
fab.addEventListener('click', () => {
    isInputActive = !isInputActive;
    if (isInputActive) {
        inputContainer.classList.add('active');
        keyboard.classList.add('active');
        fab.classList.add('hidden');
        inputField.focus();
    } else {
        closeInput();
    }
});

function closeInput() {
    inputContainer.classList.remove('active');
    keyboard.classList.remove('active');
    fab.classList.remove('hidden');
    isInputActive = false;
}

// Keyboard functionality
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        const keyText = key.textContent;
        if (keyText === '⌫') {
            inputField.value = inputField.value.slice(0, -1);
        } else if (keyText === 'return') {
            if (inputField.value.trim()) {
                addListItem(inputField.value);
                inputField.value = '';
                closeInput();
                saveTasksForSelectedDate(); // Save after adding
            }
        } else if (keyText === 'space') {
            inputField.value += ' ';
        } else if (keyText !== '⇧' && keyText !== '123') {
            inputField.value += keyText.toLowerCase();
        }
    });
});

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && inputField.value.trim()) {
        addListItem(inputField.value);
        inputField.value = '';
        closeInput();
        saveTasksForSelectedDate(); // Save after adding
    }
});

// Add list item
function addListItem(text, isCompleted = false, isReadOnly = false) {
    const item = document.createElement('div');
    item.className = 'list-item';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'list-item-wrapper';
    
    const content = document.createElement('div');
    content.className = 'list-item-content';
    
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    if (isCompleted) {
        taskCard.classList.add('completed');
    }
    
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    if (isCompleted) {
        checkbox.classList.add('checked');
    }
    checkbox.innerHTML = `
        <img src="paw.jpg" alt="Paw" class="paw-check-icon" style="width: 100%; height: 100%; object-fit: cover;">
    `;
    
    // Only allow checkbox toggle if NOT read-only (i.e., if it's today)
    if (!isReadOnly) {
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            const isCurrentlyCompleted = checkbox.classList.contains('checked');
            
            if (!isCurrentlyCompleted) {
                checkbox.classList.add('checked');
                taskCard.classList.add('completed');
                hasCompletedTask = true;
                
                // Save tasks after completion
                saveTasksForSelectedDate();
                
                // Update UI to show/hide Get Praise button
                updateUIForDateContext();
                
                // Show celebration animation
                showCelebrationAnimation(item);
            } else {
                checkbox.classList.remove('checked');
                taskCard.classList.remove('completed');
                
                // Save tasks after un-completion
                saveTasksForSelectedDate();
                
                // Update UI to show/hide Get Praise button
                updateUIForDateContext();
            }
        });
    } else {
        // Read-only: Add visual indicator that it's not interactive
        checkbox.style.cursor = 'default';
        checkbox.style.opacity = '0.7';
    }
    
    const itemText = document.createElement('div');
    itemText.className = 'list-item-text';
    itemText.textContent = text;
    
    taskCard.appendChild(checkbox);
    taskCard.appendChild(itemText);
    content.appendChild(taskCard);
    
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-button';
    deleteBtn.innerHTML = `
        <svg class="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    `;
    
    // Only allow delete if NOT read-only
    if (!isReadOnly) {
        deleteBtn.addEventListener('click', () => {
            item.remove();
            saveTasksForSelectedDate();
            updateEmptyState();
            updateUIForDateContext(); // Update Get Praise button visibility
        });
    } else {
        // Hide delete button for read-only items
        deleteBtn.style.display = 'none';
    }
    
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(content);
    item.appendChild(wrapper);
    listItems.appendChild(item);
    
    completedTasks++;
    updateEmptyState();
    
    // Swipe functionality
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;
    
    content.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    });
    
    content.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        if (diff > 0 && diff <= 80) {
            content.style.transform = `translateX(-${diff}px)`;
        } else if (diff < 0) {
            content.style.transform = '';
        }
    });
    
    content.addEventListener('touchend', () => {
        isSwiping = false;
        const diff = startX - currentX;
        
        if (diff > 40) {
            item.classList.add('swiped');
        } else {
            item.classList.remove('swiped');
            content.style.transform = '';
        }
    });
    
    content.addEventListener('mousedown', (e) => {
        if (e.target.closest('.checkbox')) return;
        
        startX = e.clientX;
        isSwiping = true;
        e.preventDefault();
        
        const onMouseMove = (e) => {
            if (!isSwiping) return;
            currentX = e.clientX;
            const diff = startX - currentX;
            
            if (diff > 0 && diff <= 80) {
                content.style.transform = `translateX(-${diff}px)`;
            } else if (diff < 0) {
                content.style.transform = '';
            }
        };
        
        const onMouseUp = () => {
            isSwiping = false;
            const diff = startX - currentX;
            
            if (diff > 40) {
                item.classList.add('swiped');
            } else {
                item.classList.remove('swiped');
                content.style.transform = '';
            }
            
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    
    deleteBtn.addEventListener('click', () => {
        item.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            item.remove();
            completedTasks--;
            updateEmptyState();
            
            const remainingCompleted = document.querySelectorAll('.checkbox.checked');
            if (remainingCompleted.length === 0) {
                hasCompletedTask = false;
                updatePraiseButton();
            }
        }, 300);
    });
    
    document.addEventListener('click', (e) => {
        if (!item.contains(e.target)) {
            item.classList.remove('swiped');
            content.style.transform = '';
        }
    });
}

// Praise functionality
function updatePraiseButton() {
    if (hasCompletedTask) {
        praiseButton.classList.add('visible');
    } else {
        praiseButton.classList.remove('visible');
    }
}

// Generate tailored praise based on completed tasks
function generateTailoredPraise(tasks) {
    if (!tasks || tasks.length === 0) {
        return getRandomPraiseMessage();
    }
    
    // Analyze task content for keywords
    const taskText = tasks.join(' ').toLowerCase();
    
    // Detection patterns
    const patterns = {
        morning: /morning|breakfast|wake|coffee|exercise|workout|gym|run|jog/,
        cleaning: /clean|laundry|dishes|vacuum|organize|tidy|wash/,
        work: /work|meeting|email|project|presentation|deadline|report|call/,
        health: /exercise|workout|gym|meditation|yoga|walk|health|vitamin/,
        personal: /read|study|learn|practice|hobby|journal|creative/,
        selfcare: /shower|skincare|relax|rest|sleep|nap|bath/,
        social: /friend|family|call|text|message|chat|visit/,
        errands: /shopping|grocery|mail|bank|appointment|errand|pick up/,
        cooking: /cook|meal|prep|dinner|lunch|recipe|food/
    };
    
    // Build personalized opening
    let opening = '';
    
    if (patterns.morning.test(taskText)) {
        opening = tasks.length === 1 
            ? `Starting your day with ${tasks[0]} — that's how winners do it! `
            : `You crushed your morning with ${tasks[0]} and more! `;
    } else if (patterns.cleaning.test(taskText)) {
        opening = `Taking care of ${tasks[0]} might seem small, but it shows real self-respect. `;
    } else if (patterns.work.test(taskText)) {
        opening = tasks.length > 2
            ? `Wow, you tackled ${tasks.length} work tasks including ${tasks[0]}! That's productivity at its finest. `
            : `Completing ${tasks[0]} takes focus and dedication. `;
    } else if (patterns.health.test(taskText)) {
        opening = `Prioritizing ${tasks[0]} means you're investing in yourself. That's powerful! `;
    } else if (patterns.personal.test(taskText)) {
        opening = `Making time for ${tasks[0]} shows you value your growth. I love that for you! `;
    } else if (patterns.selfcare.test(taskText)) {
        opening = `You deserve to feel good, and ${tasks[0]} is you honoring that. `;
    } else if (patterns.social.test(taskText)) {
        opening = `Connection matters, and you made it happen with ${tasks[0]}. `;
    } else if (patterns.errands.test(taskText)) {
        opening = `Getting ${tasks[0]} done takes energy most people ignore. But not you! `;
    } else if (patterns.cooking.test(taskText)) {
        opening = `Nourishing yourself with ${tasks[0]} — that's an act of self-love! `;
    } else {
        // Generic but still personalized opening
        const verb = ['completed', 'finished', 'crushed', 'tackled', 'accomplished'][Math.floor(Math.random() * 5)];
        opening = tasks.length === 1
            ? `You ${verb} "${tasks[0]}" today. `
            : `You ${verb} ${tasks.length} things including "${tasks[0]}"! `;
    }
    
    // Context-aware encouraging messages
    const encouragements = [
        "These small victories? They're building the life you want, one day at a time.",
        "You're not just checking boxes — you're proving to yourself what you're capable of.",
        "Most people plan. You actually did it. That's the difference between dreaming and living.",
        "Every time you follow through, you're rewiring your brain for success. Science backs this up!",
        "You chose action over excuses today. That's character in motion.",
        "Tomorrow-you is going to be so grateful for what today-you just accomplished.",
        "You're building momentum, and momentum is everything. Keep this energy!",
        "The hardest part was starting. You did that. Everything else flows from here.",
        "Your future self just sent a thank you note. You're taking care of them!",
        "This is how transformation happens — not all at once, but one real action at a time."
    ];
    
    // Add task count emphasis for multiple tasks
    let middle = '';
    if (tasks.length > 1) {
        if (tasks.length === 2) {
            middle = `And you didn't just do one thing — you handled both ${tasks[0]} AND ${tasks[1]}. `;
        } else if (tasks.length >= 3) {
            middle = `Plus ${tasks.length - 1} other things! That's ${tasks.length} wins in one day. `;
        }
    }
    
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    return opening + middle + encouragement + ' 💛';
}

// Handler for Get Praise (today only)
function handleGetPraise() {
    // Collect completed tasks
    const completedTaskElements = document.querySelectorAll('.checkbox.checked');
    const completedTasks = Array.from(completedTaskElements).map(checkbox => {
        const taskCard = checkbox.closest('.task-card');
        const taskText = taskCard.querySelector('.list-item-text').textContent;
        return taskText;
    });
    
    // Check if there are any completed tasks
    if (!selectedAnimal || completedTasks.length === 0) {
        alert('Please complete at least one task before getting praise!');
        return;
    }
    
    showPraiseCard(completedTasks);
}

// Handler for Praise Review (past dates with records)
function handlePraiseReview() {
    const storageKey = getPraiseStorageKey(selectedDate);
    const savedPraise = localStorage.getItem(storageKey);
    
    if (savedPraise) {
        const praiseData = JSON.parse(savedPraise);
        showPraiseReview(praiseData);
    } else {
        // No praise saved for this date
        alert('No praise record found for this date.');
    }
}

function showPraiseReview(praiseData) {
    const animal = animals[selectedAnimal];
    
    praiseCard.innerHTML = `
        <div class="praise-header">
            <img src="${animal.image}" alt="${animal.name}" class="praise-animal-icon">
            <div class="praise-animal-name">${animal.name} said:</div>
        </div>
        <div class="praise-body-text">${praiseData.message}</div>
        <div class="praise-checkmark-button" id="praiseCheckmark">
            <svg class="praise-checkmark-icon" viewBox="0 0 24 24" fill="none" stroke="#AF42FF" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
    `;
    
    praisePopup.classList.add('active');
    
    const checkmarkBtn = document.getElementById('praiseCheckmark');
    checkmarkBtn.addEventListener('click', () => {
        praisePopup.classList.remove('active');
    });
}

function showPraiseCard(completedTasks) {
    const animal = animals[selectedAnimal];
    const praiseMessage = generateTailoredPraise(completedTasks);
    
    praiseCard.innerHTML = `
        <div class="praise-header">
            <img src="${animal.image}" alt="${animal.name}" class="praise-animal-icon">
            <div class="praise-animal-name">${animal.name} says:</div>
        </div>
        <div class="praise-body-text">${praiseMessage}</div>
        <div class="praise-checkmark-button" id="praiseCheckmark">
            <svg class="praise-checkmark-icon" viewBox="0 0 24 24" fill="none" stroke="#AF42FF" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
    `;
    
    praisePopup.classList.add('active');
    
    const checkmarkBtn = document.getElementById('praiseCheckmark');
    checkmarkBtn.addEventListener('click', () => {
        // Save praise with date
        const praise = {
            message: praiseMessage,
            date: formatDate(selectedDate),
            animal: animal.name,
            tasks: completedTasks
        };
        
        // Save to date-specific storage
        const storageKey = getPraiseStorageKey(selectedDate);
        localStorage.setItem(storageKey, JSON.stringify(praise));
        
        // Also save to the general praises list for the praises page
        savePraise(praise);
        
        // Show success message with gentle celebration animation
        praiseCard.innerHTML = `
            <div class="success-message">
                <div class="success-title">Well done! 🎉</div>
                <div class="success-subtitle">Your praise has been saved!</div>
            </div>
        `;
        
        // Add pulsing glow to card
        praiseCard.style.animation = 'pulseGlow 2s ease-in-out';
        
        // Create gentle sparkle animation
        const colors = ['#9B87F5', '#E0CAEF', '#FAF3FF', '#D5BFEC'];
        const successMessage = praiseCard.querySelector('.success-message');
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                
                const angle = (Math.PI * 2 * i) / 20;
                const distance = 80 + Math.random() * 40;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
                sparkle.style.left = '50%';
                sparkle.style.top = '30%';
                sparkle.style.setProperty('--tx', `${tx}px`);
                sparkle.style.setProperty('--ty', `${ty}px`);
                sparkle.style.animation = `sparkleRise ${1 + Math.random() * 0.5}s ease-out forwards`;
                
                successMessage.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1500);
            }, i * 40);
        }
        
        setTimeout(() => {
            praisePopup.classList.remove('active');
            praiseCard.style.animation = '';
        }, 2000);
    });
}

// Close praise popup when clicking outside
praisePopup.addEventListener('click', (e) => {
    if (e.target === praisePopup) {
        praisePopup.classList.remove('active');
    }
});

// Initialize
renderCalendar();
