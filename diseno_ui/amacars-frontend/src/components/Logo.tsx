import { Box } from '@mui/material';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  variant?: 'default' | 'navbar';
}

const Logo = ({ width = 150, height = 'auto', variant = 'default' }: LogoProps) => {
  const logoUrl = new URL('../assets/logo.png', import.meta.url).href;
  
  return (
    <Box
      component="img"
      src={logoUrl}
      alt="AMACARS Logo"
      sx={{
        width,
        height,
        objectFit: 'contain',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: variant === 'navbar' ? 'scale(1.02)' : 'none'
        }
      }}
    />
  );
};

export default Logo; 