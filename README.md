# My Web - Personal Portfolio & Blog

A modern, feature-rich personal website built with Next.js 16, featuring a blog system, favorites showcase, and media archive.

## 🚀 Features

- **Blog System** - Write and publish blog posts with Markdown support
- **Favorites Showcase** - Display your favorite movies, series, and games
- **Media Archive** - Browse and explore your watched movies and TV shows (powered by TMDB)
- **Dark Mode** - Seamless theme switching with system preference detection
- **Responsive Design** - Fully responsive across all devices
- **Animated UI** - Smooth animations powered by Framer Motion and GSAP
- **MongoDB Integration** - Persistent storage for blog posts and comments
- **Now Playing** - Real-time Spotify integration showing currently playing music
- **Search Functionality** - Search across blog posts and archive items

## 📦 Tech Stack

### Core
- **Next.js 16** (Beta) - React framework with App Router
- **React 19** - Latest React features
- **MongoDB** - Database for blog posts
- **Mongoose** - MongoDB ODM

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom CSS Variables** - Theme-based color system
- **Responsive Design** - Mobile-first approach

### Animation
- **Framer Motion** - Declarative animations
- **GSAP** - Advanced animation library
- **@gsap/react** - GSAP React integration

### UI Components
- **Iconify** - Icon system
- **Lucide React** - Modern icon set
- **React Markdown** - Markdown rendering
- **Remark Breaks** - Line break support in Markdown

### Utilities
- **clsx** - Conditional class names
- **classnames** - Class name utility
- **tailwind-merge** - Merge Tailwind classes intelligently

## 📁 Project Structure

```
my-web/
├── app/
│   ├── (views)/                 # Page routes
│   │   ├── archive/             # Media archive pages
│   │   ├── blog/                # Blog pages
│   │   ├── favorites/           # Favorites page
│   │   └── page.js              # Home page
│   ├── api/                     # API routes
│   │   └── posts/               # Blog post API endpoints
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── providers.js             # Context providers wrapper
├── components/
│   ├── archive/                 # Archive-related components
│   ├── blog/                    # Blog components
│   ├── controls/                # Control buttons
│   ├── favorites/               # Favorites components
│   ├── icon/                    # Icon component
│   ├── modal/                   # Modal system
│   ├── nav/                     # Navigation components
│   ├── others/                  # Miscellaneous components
│   └── shared/                  # Shared/reusable components
│       ├── error.js             # Error components
│       ├── loading.js           # Loading components
│       └── index.js             # Shared exports
├── contexts/                    # React Context providers
│   ├── archive-context.js       # Archive state management
│   ├── database-context.js      # Database state
│   ├── favorites-context.js     # Favorites state
│   ├── modal-context.js         # Modal state
│   ├── navigation-context.js    # Navigation state
│   └── settings-context.js      # App settings (theme, etc.)
├── hooks/                       # Custom React hooks
│   ├── use-component-size.js    # Component size tracking
│   ├── use-favorites.js         # Favorites utilities
│   ├── use-nav-item.js          # Navigation item creation
│   ├── use-navigation.js        # Navigation logic
│   └── use-now-playing.js       # Spotify now playing
├── lib/
│   ├── db/                      # Database utilities
│   │   ├── models/              # Mongoose models
│   │   ├── mongodb.js           # MongoDB connection
│   │   └── posts.js             # Post operations
│   └── utils.js                 # Utility functions
├── config/
│   └── constants.js             # Application constants
├── data/
│   ├── archive/                 # Archive data
│   └── favorites/               # Favorites data
├── fonts/                       # Custom fonts
└── public/                      # Static assets

```

## 🛠️ Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- MongoDB database
- TMDB API key (for archive feature)
- Spotify API setup (for now playing feature)

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # TMDB API (for archive feature)
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Theme Configuration

The app uses a CSS variable-based theming system. Customize colors in `app/globals.css`:

```css
:root {
  --color-primary: 210 100% 56%;
  --color-secondary: 220 90% 48%;
  /* ... more colors */
}

.dark {
  --color-primary: 210 100% 60%;
  /* ... dark theme colors */
}
```

### Tailwind Configuration

Customize Tailwind in `tailwind.config.js`. The project uses a "skin" naming convention for theme-aware utilities:

- `text-skin-base` - Base text color
- `bg-skin-primary` - Primary background
- `border-skin-accent` - Accent border
- etc.

### Constants

Application-wide constants are centralized in `config/constants.js`:

- API endpoints
- Media types
- Storage keys
- Error messages
- Form limits
- Animation durations
- And more...

## 📝 Usage

### Creating a Blog Post

1. Navigate to `/blog/new`
2. Fill in the form:
   - Title (required)
   - Content in Markdown (required)
   - Category (required)
   - Author name (required)
   - Tags (optional, comma-separated)
   - Background images (optional)
3. Click "Create Post"

### Adding to Favorites

Edit the data files in `data/favorites/`:
- `movies.js` - Favorite movies
- `series.js` - Favorite TV series
- `games.js` - Favorite games

### Archive Configuration

Add titles to `data/archive/`:
- `movies.js` - Movie titles to fetch from TMDB
- `series.js` - TV series titles to fetch from TMDB

## 🎨 Customization

### Adding New Shared Components

Create components in `components/shared/` for reusability:

```javascript
// Example: components/shared/button.js
export default function Button({ children, variant = "primary", ...props }) {
  // Your button component
}
```

Export from `components/shared/index.js` for easy imports:

```javascript
export { default as Button } from './button';
```

### Creating Custom Hooks

Add custom hooks in `hooks/`:

```javascript
// hooks/use-your-hook.js
export function useYourHook() {
  // Your hook logic
  return { /* return values */ };
}
```

### Adding Context Providers

1. Create context in `contexts/your-context.js`
2. Add to providers array in `app/providers.js`
3. The app uses `reduceRight` to nest providers automatically

## 🔍 Key Features Explained

### Navigation System

The navigation system uses a card-based stack UI that dynamically updates based on the current route:
- Expands on click to show all routes
- Collapses to show only active route
- Supports dynamic nav items for blog posts and archive details
- Smooth animations with Framer Motion

### Theme System

Three theme options:
- **Light** - Light color scheme
- **Dark** - Dark color scheme  
- **System** - Follows OS preference

Theme preference is persisted in localStorage and syncs across tabs.

### Search Functionality

Context-based search that works across:
- Blog posts (title and content)
- Archive items (title)

Search state is managed in `navigation-context.js`.

### Modal System

Centralized modal management:
- Multiple modal types (settings, comments, images)
- Position-aware (center, bottom, custom)
- Context-based API for opening/closing modals

## 🚨 Error Handling

The project uses a comprehensive error handling system:

- **Shared Error Components** - Reusable error UI
- **Error Messages** - Centralized in constants
- **Try-Catch Blocks** - Proper error catching in async operations
- **User-Friendly Messages** - Clear error communication

## 🧪 Development

### Code Style

- **ESLint** - Configured via Next.js
- **Consistent Naming** - camelCase for variables/functions, PascalCase for components
- **JSDoc Comments** - Documentation for complex functions
- **Organized Imports** - Group by category

### Best Practices

1. **Use Constants** - Don't hardcode values
2. **Memoize Context Values** - Use `useMemo` in contexts
3. **Proper Cleanup** - Clean up effects, intervals, and listeners
4. **Loading States** - Show loading UI for async operations
5. **Error Boundaries** - Handle errors gracefully
6. **Accessibility** - Use semantic HTML and ARIA attributes

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Start Production Server

```bash
npm start
# or
yarn start
# or
pnpm start
```

### Environment Variables for Production

Make sure to set all required environment variables in your hosting platform:
- `MONGODB_URI`
- `NEXT_PUBLIC_TMDB_API_KEY`

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👤 Author

**Ömer Deliavcı**

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [TMDB API Documentation](https://developers.themoviedb.org/3)

---

**Note**: This project uses Next.js 16 beta and React 19, which may have breaking changes. Always check the official documentation for the latest updates.