# Owner Portal - Setup Guide

This guide will help you set up and run the Owner Portal application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

## Quick Start

### Option 1: Using Start Script (Windows)

```bash
# Double-click start.bat or run in terminal
start.bat
```

### Option 2: Using Start Script (Mac/Linux)

```bash
# Make the script executable (first time only)
chmod +x start.sh

# Run the script
./start.sh
```

### Option 3: Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your favorite editor
   # Replace REPLACE_WITH_GET_ORDERS_URL and REPLACE_WITH_UPDATE_STATUS_URL
   # with your actual API endpoints
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   
   The app will automatically open at `http://localhost:3000`

## Environment Variables

The application requires the following environment variables to be set in `.env`:

```env
# Required
VITE_GET_ORDERS_URL=your_actual_get_orders_endpoint
VITE_UPDATE_STATUS_URL=your_actual_update_status_endpoint

# Optional
VITE_API_BASE_URL=https://your-api-domain.com
VITE_ENV=development
```

### Example Configuration

```env
VITE_GET_ORDERS_URL=https://api.example.com/orders
VITE_UPDATE_STATUS_URL=https://api.example.com/orders/status
VITE_API_BASE_URL=https://api.example.com
```

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure Overview

```
owner-portal/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Route pages
│   ├── store/           # Zustand state management
│   └── config/          # API and app configuration
├── public/              # Static assets
├── .env                 # Environment variables (create from .env.example)
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can:

1. Change the port in `vite.config.js`:
   ```javascript
   server: {
     port: 3001, // Change to any available port
   }
   ```

2. Or kill the process using port 3000

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Working

- Make sure your `.env` file is in the root directory
- Restart the dev server after changing `.env`
- Variable names must start with `VITE_`
- Don't use quotes around values in `.env`

## API Integration

Currently, the app uses mock data. To integrate with your actual API:

1. **Configure endpoints** in `.env`

2. **Update API calls** in `src/pages/`:
   - Uncomment API calls
   - Remove mock data

   Example in `src/pages/Orders.jsx`:
   ```javascript
   // Replace this:
   const mockOrders = [...]
   
   // With this:
   const data = await fetchOrders()
   setOrders(data)
   ```

3. **Adjust response format** in `src/config/api.js` if your API returns data in a different format

## Next Steps

After setup, you should:

1. ✅ Configure environment variables
2. ✅ Test the application locally
3. ✅ Integrate with your actual API
4. ✅ Customize branding and colors in `tailwind.config.js`
5. ✅ Add authentication if needed
6. ✅ Deploy to production

## Support

For issues or questions, refer to:
- Project README.md
- Component documentation in code comments
- TODO comments throughout the codebase

---

**Happy Coding! 🚀**



