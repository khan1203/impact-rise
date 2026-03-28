'use client';

import Link from 'next/link';
import { Heart, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [userType, setUserType] = useState('');
  const [dashboardPath, setDashboardPath] = useState('/dashboard/user');
  const [activeIndicatorStyle, setActiveIndicatorStyle] = useState({ left: '0px', width: '0px' });
  const navContainerRef = useRef(null);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/campaigns', label: 'Campaigns' },
    { href: '/seminars', label: 'Seminars' },
    { href: '/workshops', label: 'Workshops' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    // Calculate active indicator position and width dynamically
    const updateIndicator = () => {
      if (navContainerRef.current) {
        const activeLink = navLinks.findIndex(link => isActive(link.href));
        if (activeLink !== -1) {
          const links = navContainerRef.current.querySelectorAll('a[data-nav-link]');
          if (links[activeLink]) {
            const activeElement = links[activeLink];
            const left = activeElement.offsetLeft;
            const width = activeElement.offsetWidth;
            setActiveIndicatorStyle({ left: `${left}px`, width: `${width}px` });
          }
        }
      }
    };

    // Update on pathname change
    updateIndicator();

    // Also update on window resize to keep indicator in sync
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [pathname]);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkLoginStatus = () => {
      const user = localStorage.getItem('currentUser');
      if (user) {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        setFirstName(userData.firstName || 'User');
        setUserType(userData.userType || 'donor');
        
        // Set dashboard path based on userType
        const path = userData.userType?.toLowerCase() === 'organizer' 
          ? '/dashboard/organizer' 
          : '/dashboard/user';
        setDashboardPath(path);
      } else {
        setIsLoggedIn(false);
        setFirstName('');
        setUserType('');
        setDashboardPath('/dashboard/user');
      }
    };

    // Check on initial mount
    checkLoginStatus();

    // Listen for storage changes (from other tabs/windows)
    window.addEventListener('storage', checkLoginStatus);

    // Listen for custom event when user logs in
    window.addEventListener('userLoggedIn', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('userLoggedIn', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setFirstName('');
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-sky-600 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            {/* <Heart className="h-8 w-8 text-white" fill="white" /> */}
            <span className="text-2xl font-bold text-white">ImpactRise</span>
          </Link>

          <div className="hidden items-center space-x-1 md:flex relative" ref={navContainerRef}>
            {/* Animated background indicator */}
            <div 
              className="absolute bottom-0 h-1 bg-white rounded-full transition-all duration-500 ease-out"
              style={{
                left: activeIndicatorStyle.left,
                width: activeIndicatorStyle.width
              }}
            />
            
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-nav-link
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-sky-100 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <div className="flex items-center gap-3 ml-6 pl-6 border-l-2 border-white border-opacity-30">
                <div className="flex flex-col items-end">
                  <span className="text-white font-bold text-sm">{firstName}</span>
                  <span className="text-sky-100 text-xs capitalize">{userType}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-lg">
                  <span className="text-sky-900 font-bold text-lg">{firstName.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={dashboardPath}
                    className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white hover:bg-opacity-30 transition border border-white border-opacity-30"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500 bg-opacity-80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-opacity-100 transition flex items-center gap-1"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-white px-4 py-2 font-medium text-sky-600 hover:bg-sky-50 transition"
              >
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white md:hidden" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-1 pb-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-white bg-opacity-20 text-white border-l-4 border-white'
                    : 'text-sky-100 hover:bg-sky-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <div className="px-4 py-3 border-t border-white border-opacity-20 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-sky-900 font-bold text-xl">{firstName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{firstName}</span>
                    <span className="text-sky-100 text-xs capitalize">{userType}</span>
                  </div>
                </div>
                <Link href={dashboardPath} className="block px-4 py-3 text-white hover:bg-sky-800 font-semibold rounded-lg mx-2 hover:bg-opacity-30 transition">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="mx-2 w-fit rounded-lg bg-red-500 bg-opacity-80 px-4 py-2 text-white hover:bg-opacity-100 font-semibold flex items-center gap-2 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block rounded px-4 py-2 text-white hover:bg-sky-800 font-semibold">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
