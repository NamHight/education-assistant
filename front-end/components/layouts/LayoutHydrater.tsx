import React from 'react';
import StoreHydrater from '../stores/StoreHydrater';
import { storeHydration } from '@/lib/storeHydration';
import { CopilotKit } from '@copilotkit/react-core';
const LayoutHydrater = async ({ children }: { children: React.ReactNode }) => {
  const storeHydrater = await storeHydration();
  return (
    <>
      <StoreHydrater auth={storeHydrater.auth} setting={storeHydrater.setting} />
      {children}
    </>
  );
};

export default LayoutHydrater;
