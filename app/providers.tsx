// 'use client';

// import { ReactNode } from 'react';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from '../contexts/AuthContext';

// export function Providers({ children }: { children: ReactNode }) {
//   return (
//     <AuthProvider>
//       {children}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: '#1A1A1A',
//             color: '#F5F5DC',
//             border: '1px solid #D4AF37',
//           },
//           success: {
//             iconTheme: {
//               primary: '#D4AF37',
//               secondary: '#1A1A1A',
//             },
//           },
//           error: {
//             iconTheme: {
//               primary: '#EF4444',
//               secondary: '#1A1A1A',
//             },
//           },
//         }}
//       />
//     </AuthProvider>
//   );
// }


'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A1A1A',
            color: '#F5F5DC',
            border: '1px solid #D4AF37',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#1A1A1A',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#1A1A1A',
            },
          },
        }}
      />
    </AuthProvider>
  );
}