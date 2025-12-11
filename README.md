# Pawgress 🐾

A delightful task tracking app with animal companions that celebrate your daily accomplishments!

## 📁 Project Structure

The original large HTML file has been broken down into multiple pages for better organization and maintainability:

```
Pawgress/
├── css/
│   └── styles.css          # Shared styles across all pages
├── js/
│   ├── app.js             # Common utilities and data management
│   └── dashboard.js       # Dashboard-specific functionality
├── login.html             # User login page
├── select-animal.html     # Animal companion selection
├── dashboard.html         # Main todo list dashboard
├── profile.html           # User profile and settings
├── praises.html          # Saved praises from animal companions
└── README.md             # This file
```

## 🚀 Getting Started

### Opening the App

1. Open `login.html` in your web browser to start
2. Or simply open any page - the app will automatically redirect to login if needed

### User Flow

```
login.html → select-animal.html → dashboard.html
                                       ↓
                            profile.html ⟷ praises.html
```

## 📄 Page Details

### 1. **login.html**
- User authentication page
- Email and password input
- Google login option
- Redirects to animal selection after successful login

### 2. **select-animal.html**
- Choose your companion animal:
  - 🐨 Koko (Koala)
  - 🐰 Bobo (Bunny)
  - 🦒 Gigi (Giraffe)
  - 🐸 Fifi (Frog)
- Each animal has unique colors and personality

### 3. **dashboard.html** (Main Page)
- Daily todo list - "Today's Done List"
- Add tasks with the floating action button (+)
- Mark tasks complete with paw print checkmarks
- Swipe left to delete tasks
- Get praise from your animal companion
- Calendar to view different dates
- Navigation to praises (left icon) and profile (right icon)

### 4. **profile.html**
- User settings and preferences
- Premium membership banner
- Menu options:
  - Profile settings
  - Password management
  - Notifications
  - Your Praises (links to praises.html)
  - Rate & Review
  - Help
- Logout functionality

### 5. **praises.html**
- View all saved praises from your animal companion
- Click any praise card to view full message
- Shows animal name and date for each praise
- Empty state when no praises exist yet

## 🛠 Technical Details

### Shared Components (`css/styles.css`)
- Common styling for all pages
- Container and layout styles
- Reusable button and input styles
- Animation keyframes
- Logo and branding styles

### Utilities (`js/app.js`)
- Animal data definitions
- Local storage management
- Date formatting utilities
- Authentication helpers
- Praise message generation

### Dashboard Logic (`js/dashboard.js`)
- Todo list management
- Task completion tracking
- Calendar functionality
- Praise popup handling
- Swipe-to-delete implementation
- Virtual keyboard for mobile-like experience

## 💾 Data Storage

The app uses browser localStorage to persist:
- User email
- Selected animal companion
- Saved praises
- Current date selection

**Storage Keys:**
- `pawgress_user_email`
- `pawgress_selected_animal`
- `pawgress_saved_praises`
- `pawgress_tasks`
- `pawgress_current_date`

## 🎨 Design Features

- **Warm Color Palette**: Cream backgrounds (#FFFCD8) with purple accents (#B95DFB)
- **Playful Typography**: Pacifico for branding, Crimson Text for content
- **Smooth Animations**: Transitions for page changes and interactions
- **Mobile-First**: Designed for 393x852px viewport (iPhone size)
- **Paw Print Icons**: Custom SVG paw prints throughout

## 🔄 Navigation Flow

### From Dashboard:
- **Left Icon** (Party Popper 🎉) → Praises Page
- **Right Icon** (User Profile 👤) → Profile Page
- **Date Badge** → Calendar Modal
- **FAB (+)** → Add Task Input

### From Profile:
- **Your Praises** → Praises Page
- **Back Button** → Dashboard

### From Praises:
- **Back Button** → Returns to previous page (Dashboard or Profile)

## 🧪 Testing

To test the app:

1. **Start Fresh**: Clear localStorage to test the full flow
```javascript
localStorage.clear();
```

2. **Skip Login**: Set credentials directly
```javascript
localStorage.setItem('pawgress_user_email', 'test@example.com');
localStorage.setItem('pawgress_selected_animal', 'koko');
```

3. **Add Sample Praises**: Use browser console
```javascript
const praise = {
    text: "Great job!",
    date: "2025.12.05",
    animal: "Koko"
};
localStorage.setItem('pawgress_saved_praises', JSON.stringify([praise]));
```

## 🔧 Customization

### Adding New Animals
Edit `js/app.js`:
```javascript
const animals = {
    newanimal: { 
        emoji: '🦊', 
        name: 'NewName', 
        color: '#HEXCOLOR' 
    }
};
```

### Adding New Praise Messages
Edit `js/app.js` `praiseMessages` array

### Changing Colors
Edit `css/styles.css` and individual page styles

## 📱 Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- Best viewed at 393x852px (mobile size)

## 🎯 Features

✅ User authentication  
✅ Animal companion selection  
✅ Daily todo list  
✅ Task completion with paw prints  
✅ Swipe to delete  
✅ Get praise from animals  
✅ Save and view praises  
✅ Calendar date selection  
✅ Profile management  
✅ Logout functionality  
✅ Persistent data storage  

## 🐛 Known Issues

- Calendar doesn't persist tasks between dates (feature not implemented)
- No actual authentication backend (localStorage only)
- Virtual keyboard is decorative (doesn't handle all input cases)

## 🚀 Future Enhancements

- Task persistence per date
- Task categories/tags
- Statistics and progress tracking
- Multiple animal companions
- Cloud sync
- Real authentication
- Mobile app version

## 📝 License

This is a portfolio/demo project. Feel free to use and modify as needed.

## 👋 Credits

Designed as a positive habit tracking application with gamification elements.

---

**Made with ❤️ and 🐾**
