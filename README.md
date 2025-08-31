# 🏍️ AMILIE'S BIKE RENTAL - Premium Bike Rental Platform

A modern, feature-rich bike rental application built with React, TypeScript, and Tailwind CSS. Experience seamless bike booking with beautiful UI/UX and integrated payment processing.

![AMILIE'S BIKE RENTAL](https://img.shields.io/badge/AMILIE%27S-BIKE_RENTAL-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-blue?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 **Modern Design & UI/UX**
- **Enhanced Typography**: Beautiful font combinations with Inter, Poppins, and Outfit
- **Vibrant Color Palette**: Modern HSL color system with appealing gradients
- **Smooth Animations**: Custom animations and transitions for better user experience
- **Responsive Design**: Mobile-first approach with excellent cross-device compatibility

### 🚲 **Bike Management**
- **Comprehensive Bike Catalog**: Browse through various bike types and models
- **Advanced Filtering**: Filter by location, type, price range, and availability
- **Search Functionality**: Find bikes by name, model, or features
- **Grid/List Views**: Toggle between different viewing modes

### 📅 **Booking System**
- **Smart Booking**: Easy date and time selection with validation
- **Location Management**: Pickup and drop location handling
- **Special Instructions**: Add custom requirements for your ride
- **Real-time Pricing**: Dynamic pricing calculation based on duration

### 💳 **Payment Integration**
- **Razorpay Gateway**: Secure payment processing with multiple options
- **Test Mode**: Simulate payments for development and testing
- **Multiple Payment Methods**: Cards, UPI, Net Banking, and more
- **Payment Security**: Secure transaction handling with proper validation

### 👤 **User Management**
- **Authentication System**: Secure user login and registration
- **Booking History**: Track all your past and current bookings
- **Profile Management**: Manage personal information and preferences
- **Responsive Dashboard**: Beautiful booking management interface

### 🔧 **Technical Features**
- **TypeScript**: Full type safety and better development experience
- **React Query**: Efficient data fetching and state management
- **Supabase Integration**: Modern database and authentication backend
- **Component Library**: Reusable UI components with shadcn/ui
- **Performance Optimized**: Fast loading and smooth interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ride-lease-pro.git
   cd ride-lease-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_test_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
ride-lease-pro/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Main navigation header
│   │   ├── HeroSection.tsx # Landing page hero
│   │   ├── BikeCard.tsx    # Individual bike display
│   │   ├── BikeGrid.tsx    # Bike listing grid
│   │   ├── BikeFilters.tsx # Search and filter controls
│   │   ├── BookingDialog.tsx # Booking form dialog
│   │   └── PaymentDialog.tsx # Payment processing dialog
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Application pages
│   ├── data/               # Static data and mock content
│   ├── integrations/       # External service integrations
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Typography
- **Inter**: Clean, modern sans-serif for body text
- **Poppins**: Friendly, geometric sans-serif for headings
- **Outfit**: Contemporary display font for special elements

### Color Palette
- **Primary**: Vibrant blue (#0066FF) with gradient variations
- **Secondary**: Complementary teal and purple accents
- **Success**: Fresh green tones for positive actions
- **Warning**: Warm orange for alerts and notifications
- **Error**: Bold red for errors and destructive actions

### Components
- **Cards**: Elevated surfaces with subtle shadows
- **Buttons**: Interactive elements with hover effects
- **Forms**: Clean input fields with focus states
- **Modals**: Smooth overlay dialogs with animations

## 💳 Payment Integration

### Razorpay Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your test API keys from the dashboard
3. Update environment variables with your keys
4. Test with provided test card details

For detailed setup instructions, see [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md)

### Test Mode
- **Test Cards**: Use provided test card numbers
- **Test UPI**: success@razorpay, failure@razorpay
- **Test Net Banking**: HDFC, ICICI

## 🚲 Available Bike Types

- **Scooters**: Honda Activa, Suzuki Access, Ola Electric
- **Motorcycles**: Yamaha FZ-S, Hero Splendor, Bajaj Pulsar
- **Sports Bikes**: TVS Apache, KTM Duke, Bajaj NS200
- **Cruisers**: Royal Enfield Classic 350
- **Electric**: Ola S1 Pro and more

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Friendly**: Responsive layouts for medium screens
- **Desktop Enhanced**: Full-featured experience on large screens
- **Touch Optimized**: Touch-friendly interactions and gestures

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy Options
- **Vercel**: Zero-config deployment
- **Netlify**: Drag and drop deployment
- **GitHub Pages**: Free hosting for open source
- **AWS S3**: Scalable cloud hosting

## 🧪 Testing

### Run Tests
```bash
npm run test
# or
yarn test
```

### Test Coverage
- Component rendering
- User interactions
- Payment flow
- Responsive design
- Cross-browser compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Maintain consistent code formatting
- Add proper error handling
- Write meaningful component documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui**: Beautiful component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Razorpay**: Payment gateway integration
- **Supabase**: Backend as a service

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/yourusername/ride-lease-pro/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ride-lease-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ride-lease-pro/discussions)
- **Email**: support@amiliesbikerental.com

## 🔮 Roadmap

### Upcoming Features
- [ ] **Real-time Tracking**: Live bike location tracking
- [ ] **Multi-language Support**: Internationalization
- [ ] **Advanced Analytics**: Booking insights and reports
- [ ] **Mobile App**: React Native mobile application
- [ ] **AI Recommendations**: Smart bike suggestions
- [ ] **Social Features**: User reviews and ratings

### Performance Improvements
- [ ] **Lazy Loading**: Optimized image and component loading
- [ ] **Service Workers**: Offline functionality
- [ ] **CDN Integration**: Faster content delivery
- [ ] **Database Optimization**: Improved query performance

---

**Made with ❤️ by the AMILIE'S BIKE RENTAL Team**

*Experience the future of bike rentals with AMILIE'S BIKE RENTAL - Where every ride is an adventure!*
