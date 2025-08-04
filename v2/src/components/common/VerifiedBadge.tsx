import React from 'react';
import { useTranslations } from 'next-intl';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import Gppbad from '@mui/icons-material/GppBad';
interface VerifiedBadgeProps {
  /**
   * If true, shows as "Trusted Service Provider" with green icon
   * If false, shows as "Untrusted Service Provider" with no icon
   */
  trusted?: boolean;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  trusted = false,
  size = 'medium',
}) => {
  const t = useTranslations('common');
  
  const sizeMap = {
    small: 14,
    medium: 19,
    large: 20,
  };

  const iconSize = sizeMap[size] || 19;

  return trusted ? <VerifiedUser sx={{ fontSize: iconSize, color: '#2e7d32' }} /> : <Gppbad sx={{ fontSize: iconSize, color: '#d32f2f' }} />;
};

// const VerifiedIcon: React.FC<{ size: number }> = ({ size }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="#2e7d32"
//     style={{
//       display: 'inline-block',
//       verticalAlign: 'middle',
//       flexShrink: 0,
//     }}
//     aria-hidden="true"
//   >
//     <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z" />
//   </svg>
// );

// const UnverifiedIcon: React.FC<{ size: number }> = ({ size }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="#d32f2f"
//     style={{
//       display: 'inline-block',
//       verticalAlign: 'middle',
//       flexShrink: 0,
//     }}
//     aria-hidden="true"
//   >
//     <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2.12 14.46l-1.42-1.41L10.59 12 8.46 9.88l1.42-1.41L12 10.59l2.12-2.12 1.42 1.41L13.41 12l2.12 2.12-1.42 1.41L12 13.41l-2.12 2.12z" />
//   </svg>
// );

export default VerifiedBadge;
