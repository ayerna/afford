import { Box, Paper, Skeleton, Stack } from '@mui/material';

interface FeedSkeletonProps {
  rows?: number;
}

export function FeedSkeleton({ rows = 6 }: FeedSkeletonProps) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: rows }).map((_, index) => (
        <Paper key={index} elevation={0} sx={{ p: 2.25 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={90} height={28} />
              <Skeleton variant="rounded" width={72} height={28} />
            </Stack>
            <Box>
              <Skeleton variant="text" width="85%" height={34} />
              <Skeleton variant="text" width="60%" height={28} />
            </Box>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={110} />
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
