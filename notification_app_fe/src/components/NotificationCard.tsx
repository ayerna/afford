import { Box, Chip, IconButton, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded';
import { PriorityNotification, SortableNotification } from '../types';
import { prettyTimestamp, typeAccent, typeTone } from '../utils/notifications';

interface NotificationCardProps {
  item: SortableNotification | PriorityNotification;
  onToggleViewed: (id: string) => void;
}

export function NotificationCard({ item, onToggleViewed }: NotificationCardProps) {
  const accent = typeAccent(item.Type);
  const tone = typeTone(item.Type);
  const isViewed = item.viewed;

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `6px solid ${accent}`,
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${alpha(accent, 0.08)}, transparent 52%)`,
          pointerEvents: 'none',
        }}
      />
      <Stack spacing={1.5} sx={{ p: 2.25, position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip size="small" color={tone} label={item.Type} />
            <Chip
              size="small"
              label={isViewed ? 'Viewed' : 'New'}
              sx={{
                fontWeight: 700,
                bgcolor: isViewed ? alpha('#475569', 0.12) : alpha('#dc2626', 0.12),
                color: isViewed ? '#475569' : '#dc2626',
              }}
            />
          </Stack>
          <IconButton
            onClick={() => onToggleViewed(item.ID)}
            aria-label={isViewed ? 'Mark as new' : 'Mark as viewed'}
            size="small"
            sx={{
              color: isViewed ? '#0f766e' : '#64748b',
              bgcolor: alpha(accent, 0.08),
              '&:hover': {
                bgcolor: alpha(accent, 0.16),
              },
            }}
          >
            <DoneOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
            {item.Message}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
            {prettyTimestamp(item.Timestamp)}
          </Typography>
        </Box>

        <Stack direction="row" justifyContent="space-between" spacing={1} flexWrap="wrap" useFlexGap>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
            ID: {item.ID}
          </Typography>
          {'rank' in item ? (
            <Typography variant="caption" sx={{ color: accent, fontWeight: 800 }}>
              Priority score: {item.rank}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}
