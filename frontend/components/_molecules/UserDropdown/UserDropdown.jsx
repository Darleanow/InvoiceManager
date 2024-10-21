'use client';

import { useState } from 'react';
import DropdownButton from '../../_atoms/DropdownButton/DropdownButton';
import DropdownContent from '../../_atoms/DropdownContent/DropdownContent';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function UserDropdown() {
  return (
    <SignedIn>
      <UserButton />
    </SignedIn>
  );
}
