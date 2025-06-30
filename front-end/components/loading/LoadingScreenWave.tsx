'use client';

import Image from 'next/image';

export function WaveAnimationLoading() {
  return (
    <div className='fixed inset-0 bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center'>
      <div className='text-center space-y-8'>
        <div className='w-32 h-32 mx-auto relative'>
          <div className='absolute inset-0 bg-white rounded-full flex items-center justify-center shadow-2xl'>
            <Image
              src='/assets/images/logo.svg?height=80&width=80'
              alt='Logo'
              width={80}
              height={80}
              className='w-20 h-20 object-contain'
            />
          </div>

          {/* Wave rings */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='!absolute !inset-0 border-4 border-white/30 rounded-full animate-ping'
              style={{
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-white'>Hỗ trợ phòng đào tạo Cao Thắng</h2>

          {/* Wave bars */}
          <div className='flex justify-center space-x-1'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='w-1 bg-white rounded-full animate-wave'
                style={{
                  height: '20px',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
