# GoDaddy Repository Explorer

## Project Overview
A React application that displays GoDaddy's public GitHub repositories with detailed information about each repository.


## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
   git clone https://github.com/tanishk-agarwal/godaddy-assignment.git
   cd 
```

2. **Install dependencies**
```bash
   npm install
```

3. **Run the development server**
```bash
   npm run dev
```

4. **Run tests**
```bash
   npm run test
```

## Key Libraries & Why They Were Chosen

### Core Libraries

1. **React Router DOM** (`react-router-dom`)
   - **Why**: Provides client-side routing for navigation between repository list and detail views
   - Enables dynamic route parameters for repository details pages
   - Offers programmatic navigation with `useNavigate` hook

2. **TanStack Query (React Query)** (`@tanstack/react-query`)
   - **Why**: Powerful data fetching and caching library
   - Automatic caching reduces unnecessary API calls
   - Built-in loading and error states
   - Automatic refetching and background updates
   - Better performance compared to vanilla `fetch` with manual state management

3. **Material-UI (MUI)** (`@mui/material`)
   - **Why**: Provides professional, accessible UI components
   - `Skeleton` component for elegant loading states
   - `Button` component for consistent, accessible buttons
   - Pre-styled components speed up development

### Testing Libraries

**4. Vitest** (`vitest`)
- Modern, fast test runner optimized for Vite projects
- Jest-compatible API with better performance
- Chosen as the testing framework due to seamless Vite integration

**5. React Testing Library** (`@testing-library/react`)
- Tests components from a user's perspective
- Encourages testing best practices (testing behavior, not implementation)
- Industry standard for React component testing

**6. @testing-library/user-event**
- Simulates real user interactions (clicks, typing, etc.)
- More realistic than basic event firing
- Improves test reliability

## Features Implemented

- **Repository List Page**: Displays all GoDaddy public repositories in a responsive grid layout
- **Repository Details Page**: Shows detailed information including description, languages, forks, issues, and watchers
- **Navigation**: Smooth routing between list and detail views
- **Loading States**: Skeleton loaders for better UX during data fetching
- **Error Handling**: User-friendly error messages when API calls fail
- **External Links**: Direct links to view repositories on GitHub
- **Responsive Design**: Works across different screen sizes
- **Accessibility**: ARIA labels for screen readers
- **Comprehensive Testing**: Unit tests for both components covering all states

## Time Constraints & Simplifications

Due to time limitations, the following features were simplified or not implemented:

### Performance Optimizations

1. **Virtual Scrolling / Windowing**
   - Currently renders all repositories in the DOM simultaneously
   - Could improve performance significantly when displaying 100+ repositories
   - Would reduce initial render time and memory usage

2. **Code Splitting & Lazy Loading**
   - All components are bundled together in a single chunk
   - Would implement `React.lazy()` and `Suspense` for route-based code splitting
   - Would lazy load the RepoDetails component to reduce initial bundle size

3. **Memoization**
   - No use of `React.memo()`, `useMemo()`, or `useCallback()`
   - Would wrap components in `React.memo()` to prevent unnecessary re-renders
   - Would use `useCallback` for event handlers passed to child components

4. **Prefetching & Preloading**
   - No prefetching of repository details on hover
   - Could implement link prefetching with `<link rel="prefetch">`

5. **Keyboard Navigation**
    - Basic browser keyboard support only
    - Would implement full keyboard navigation (Tab, Arrow keys)
    - Would add keyboard shortcuts (e.g., `/` for search, `Esc` to close)

## 🧪 Testing

Tests cover:
- ✅ Loading states (skeleton loaders)
- ✅ Successful data fetching and rendering
- ✅ Error scenarios (network errors, API errors)
- ✅ Empty states (no data available)
- ✅ User interactions (button clicks, navigation)
- ✅ API endpoint calls
- ✅ Conditional rendering logic

## Technical Decisions

- **React Query over fetch**: Chose React Query for simpler data fetching without boilerplate
- **Functional Components**: Used hooks-based approach for cleaner, more maintainable code
- **Component-based CSS**: Kept styles modular and co-located with components
- **Test-Driven Approach**: Wrote comprehensive tests to ensure reliability

## Project Structure
```
src/
├── components/
│   ├── RepoList.jsx          
│   ├── RepoDetails.jsx    
│   └── styles/
│       ├── RepoList.css     
│       └── RepoDetails.css  
└── __tests/
    ├── RepoList.test.jsx     
    └── RepoDetails.test.jsx  
```
