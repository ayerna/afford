import { Alert, Box, Typography } from '@mui/material';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <Alert
      severity="info"
      sx={{
        alignItems: 'flex-start',
        borderRadius: 4,
        border: '1px solid rgba(59, 130, 246, 0.2)',
        bgcolor: 'rgba(239, 246, 255, 0.72)',
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      </Box>
    </Alert>
  );
}
