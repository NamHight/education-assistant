'use client';

import { redirect } from 'next/navigation';
import React from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return redirect('/dang-nhap');
}
