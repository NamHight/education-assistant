import { createContext, ReactNode, useContext, useState } from 'react';

interface PopoverLockContextType {
  isLocked: boolean;
  setIsLocked: (value: boolean) => void;
  toggleLock: () => void;
}
export const PopoverLockContext = createContext<PopoverLockContextType | null>(null);

export const PopoverLockProvider = ({ children }: { children: ReactNode }) => {
  const [isLocked, setIsLocked] = useState(false);
  // Function to toggle the lock state
  const toggleLock = () => {
    setIsLocked((prev) => !prev);
  };

  return (
    <PopoverLockContext.Provider value={{ isLocked, setIsLocked, toggleLock }}>{children}</PopoverLockContext.Provider>
  );
};

export const usePopoverLock = () => {
  const context = useContext(PopoverLockContext);
  if (!context) {
    throw new Error('usePopoverLock must be used within a PopoverLockProvider');
  }
  return context;
};
