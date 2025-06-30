'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const fullText = 'Trường Cao đẳng Cao Thắng';
  const loadingMessages = ['Đang khởi tạo hệ thống...', 'Đang tải dữ liệu...', 'Chuẩn bị giao diện...', 'Hoàn tất!'];

  useEffect(() => {
    // Animate typing effect for school name
    let textIndex = 0;
    const textInterval = setInterval(() => {
      if (textIndex <= fullText.length) {
        setLoadingText(fullText.slice(0, textIndex));
        textIndex++;
      } else {
        clearInterval(textInterval);
      }
    }, 100);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsComplete(true), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentMessage = loadingMessages[Math.floor((progress / 100) * (loadingMessages.length - 1))];

  if (isComplete) {
    return (
      <div className='fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center transition-opacity duration-1000 opacity-0'>
        <div className='text-white text-2xl font-bold animate-fade-out'>Chào mừng!</div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center overflow-hidden'>
      {/* Animated background particles */}
      <div className='absolute inset-0'>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-white/20 rounded-full animate-float'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className='relative z-10 text-center space-y-8 px-8'>
        {/* Logo container with animations */}
        <div className='relative'>
          <div className='w-32 h-32 mx-auto mb-6 relative'>
            {/* Spinning ring around logo */}
            <div className='absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin'></div>
            <div className='absolute inset-2 border-2 border-white/20 border-b-white rounded-full animate-spin-reverse'></div>

            {/* Logo placeholder - replace with actual Cao Thang logo */}
            <div className='absolute inset-4 bg-white rounded-full flex items-center justify-center animate-pulse-slow'>
              <Image
                src='/assets/images/logo.svg?height=80&width=80'
                alt='Logo Trường Cao đẳng Cao Thắng'
                width={80}
                height={80}
                className='w-16 h-16 object-contain'
              />
            </div>
          </div>

          {/* Pulsing glow effect */}
          <div className='absolute inset-0 w-32 h-32 mx-auto bg-white/10 rounded-full animate-ping'></div>
        </div>

        {/* School name with typing effect */}
        <div className='space-y-4'>
          <h1 className='text-3xl md:text-4xl font-bold text-white min-h-[3rem]'>
            {loadingText}
            <span className='animate-blink'>|</span>
          </h1>

          {/* Subtitle */}
          <p className='text-blue-200 text-lg font-medium'>Hệ thống Quản lý Sinh viên</p>
        </div>

        {/* Progress bar */}
        <div className='w-full max-w-md mx-auto space-y-3'>
          <div className='w-full bg-white/20 rounded-full h-2 overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-white to-blue-200 rounded-full transition-all duration-300 ease-out relative'
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className='absolute inset-0 bg-white/30 animate-shimmer'></div>
            </div>
          </div>

          {/* Progress percentage */}
          <div className='flex justify-between items-center text-sm text-blue-200'>
            <span>{currentMessage}</span>
            <span className='font-mono'>{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Loading dots */}
        <div className='flex justify-center space-x-2'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='w-3 h-3 bg-white rounded-full animate-bounce'
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center'>
        <p className='text-blue-300 text-sm'>© 2024 Trường Cao đẳng Cao Thắng</p>
      </div>
    </div>
  );
}
