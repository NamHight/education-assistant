'use client';
import React from 'react';
import StoreHydrater from '../stores/StoreHydrater';
const LayoutHydrater = ({
  children,
  storeHydrater
}: {
  children: React.ReactNode;
  storeHydrater: { auth: { user: GiangVien | undefined }; setting: { theme: 'light' | 'dark' } };
}) => {
  return (
    <>
      <StoreHydrater auth={storeHydrater.auth} setting={storeHydrater.setting} />
      {children}
    </>
  );
};

export default LayoutHydrater;
