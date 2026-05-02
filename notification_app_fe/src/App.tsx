import { useEffect, useMemo, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { EmptyState } from './components/EmptyState';
import { FeedSkeleton } from './components/FeedSkeleton';
import { NotificationCard } from './components/NotificationCard';
import { fetchAllNotifications, fetchNotificationPage } from './api/notifications';
import { FilterChoice, NotificationRecord, NotificationType, SortableNotification, ViewMode } from './types';
import { decorateNotifications, sliceTopNotifications } from './utils/notifications';

const filterOptions: FilterChoice[] = ['All', 'Placement', 'Result', 'Event'];
const pageSizes = [5, 8, 10, 15];
const topCountChoices = [5, 10, 15, 20];
const storageKey = 'campus-notifications:viewed';

function loadViewedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return new Set();
    }

    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function persistViewedIds(viewedIds: Set<string>): void {
  localStorage.setItem(storageKey, JSON.stringify([...viewedIds]));
}

export default function App() {
  const [mode, setMode] = useState<ViewMode>('all');
  const [filterChoice, setFilterChoice] = useState<FilterChoice>('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [topCount, setTopCount] = useState(10);
  const [pageRows, setPageRows] = useState<NotificationRecord[]>([]);
  const [priorityRows, setPriorityRows] = useState<NotificationRecord[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingPriority, setLoadingPriority] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [priorityError, setPriorityError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => loadViewedIds());

  useEffect(() => {
    persistViewedIds(viewedIds);
  }, [viewedIds]);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingPage(true);
    setPageError(null);

    fetchNotificationPage({
      page,
      limit: pageSize,
      notificationType: filterChoice,
      signal: controller.signal,
    })
      .then((rows) => {
        setPageRows(rows);
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name === 'AbortError') {
          return;
        }

        setPageError(error instanceof Error ? error.message : 'Unable to load notifications right now.');
        setPageRows([]);
      })
      .finally(() => {
        setLoadingPage(false);
      });

    return () => controller.abort();
  }, [filterChoice, page, pageSize, refreshToken]);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingPriority(true);
    setPriorityError(null);

    fetchAllNotifications(filterChoice === 'All' ? undefined : (filterChoice as NotificationType))
      .then((rows) => {
        if (!controller.signal.aborted) {
          setPriorityRows(rows);
        }
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name === 'AbortError') {
          return;
        }

        setPriorityError(error instanceof Error ? error.message : 'Priority feed failed to load.');
        setPriorityRows([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingPriority(false);
        }
      });

    return () => controller.abort();
  }, [filterChoice, refreshToken]);

  useEffect(() => {
    setPage(1);
  }, [filterChoice, pageSize]);

  const currentPageDecorated = useMemo(
    () => decorateNotifications(pageRows, viewedIds),
    [pageRows, viewedIds],
  );

  const priorityDecorated = useMemo(
    () => decorateNotifications(priorityRows, viewedIds),
    [priorityRows, viewedIds],
  );

  const prioritySlice = useMemo(
    () => sliceTopNotifications(priorityDecorated, topCount),
    [priorityDecorated, topCount],
  );

  const pagePageish = useMemo(() => currentPageDecorated, [currentPageDecorated]);

  const handleViewedToggle = (id: string) => {
    setViewedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterChoice(event.target.value as FilterChoice);
  };

  const handlePageSizeChange = (event: SelectChangeEvent) => {
    setPageSize(Number(event.target.value));
  };

  const handleTopCountChange = (event: SelectChangeEvent) => {
    setTopCount(Number(event.target.value));
  };

  const pageHasPrevious = page > 1;
  const pageHasNext = pageRows.length === pageSize;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(15, 118, 110, 0.12), transparent 28%), radial-gradient(circle at top right, rgba(16, 42, 67, 0.12), transparent 34%), linear-gradient(180deg, #f8fbff 0%, #edf3fa 100%)',
      }}
    >
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(16px)' }}>
        <Toolbar sx={{ borderBottom: '1px solid rgba(16, 42, 67, 0.08)', bgcolor: 'rgba(248, 250, 252, 0.8)' }}>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '14px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: '#102a43',
                color: '#fff',
              }}
            >
              <NotificationsRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1 }}>
                Campus Notifications
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Priority inbox for placements, results, and events
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            startIcon={<RefreshRoundedIcon />}
            onClick={() => setRefreshToken((value) => value + 1)}
          >
            Refresh
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            overflow: 'hidden',
            mb: 3,
            position: 'relative',
            border: '1px solid rgba(16, 42, 67, 0.08)',
            background:
              'linear-gradient(135deg, rgba(16,42,67,0.97), rgba(15,118,110,0.94) 56%, rgba(8,47,73,0.98))',
            color: '#f8fafc',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at top right, rgba(255,255,255,0.14), transparent 28%), radial-gradient(circle at bottom left, rgba(255,255,255,0.1), transparent 30%)',
              pointerEvents: 'none',
            }}
          />
          <Stack spacing={2} sx={{ p: { xs: 2.5, md: 4 }, position: 'relative' }}>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 2.2, opacity: 0.86 }}>
                Real-time notice board
              </Typography>
              <Typography variant="h3" sx={{ mt: 0.5, maxWidth: 820 }}>
                Fast, readable notifications with priority ranking and local viewed-state tracking.
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {[
                { label: 'Active filter', value: filterChoice },
                { label: 'Current page size', value: `${pageSize}` },
                { label: 'Top N window', value: `${topCount}` },
                { label: 'Viewed items', value: `${viewedIds.size}` },
              ].map((item) => (
                <Grid item xs={12} sm={6} lg={3} key={item.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.14)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Typography variant="caption" sx={{ opacity: 0.82 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {item.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ mb: 3, p: 2.25 }}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Tabs value={mode} onChange={(_, nextValue) => setMode(nextValue as ViewMode)}>
                <Tab label="All Notifications" value="all" />
                <Tab label="Priority Notifications" value="priority" />
              </Tabs>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel id="filter-label">Type</InputLabel>
                  <Select labelId="filter-label" label="Type" value={filterChoice} onChange={handleFilterChange}>
                    {filterOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel id="page-size-label">Page size</InputLabel>
                  <Select
                    labelId="page-size-label"
                    label="Page size"
                    value={String(pageSize)}
                    onChange={handlePageSizeChange}
                  >
                    {pageSizes.map((size) => (
                      <MenuItem key={size} value={String(size)}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel id="top-count-label">Top N</InputLabel>
                  <Select
                    labelId="top-count-label"
                    label="Top N"
                    value={String(topCount)}
                    onChange={handleTopCountChange}
                  >
                    {topCountChoices.map((size) => (
                      <MenuItem key={size} value={String(size)}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
              <TextField
                fullWidth
                size="small"
                value={filterChoice}
                label="Current filter"
                helperText="The backend query uses notification_type, limit, and page."
                InputProps={{ readOnly: true }}
              />
              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setViewedIds((current) => new Set(current));
                }}
              >
                Keep viewed markers
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {mode === 'all' ? (
          <Stack spacing={2.5}>
            {pageError ? <Alert severity="error">{pageError}</Alert> : null}
            {loadingPage ? <FeedSkeleton rows={pageSize} /> : null}
            {!loadingPage && !pageError && pagePageish.length === 0 ? (
              <EmptyState
                title="No notifications on this page"
                subtitle="Try moving to another page or clearing the current filter."
              />
            ) : null}
            {!loadingPage && !pageError && pagePageish.length > 0 ? (
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  {pagePageish.map((item) => (
                    <Grid item xs={12} md={6} xl={4} key={item.ID}>
                      <NotificationCard item={item} onToggleViewed={handleViewedToggle} />
                    </Grid>
                  ))}
                </Grid>
                <Paper elevation={0} sx={{ p: 2 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    spacing={2}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Page {page} with {pagePageish.length} notifications loaded from the API.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" disabled={!pageHasPrevious} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                        Previous
                      </Button>
                      <Button variant="outlined" disabled={!pageHasNext} onClick={() => setPage((value) => value + 1)}>
                        Next
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            ) : null}
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            {priorityError ? <Alert severity="error">{priorityError}</Alert> : null}
            {loadingPriority ? <FeedSkeleton rows={topCount} /> : null}
            {!loadingPriority && !priorityError && prioritySlice.length === 0 ? (
              <EmptyState
                title="No priority notifications found"
                subtitle="This feed becomes useful once the API returns rows for the chosen filter."
              />
            ) : null}
            {!loadingPriority && !priorityError && prioritySlice.length > 0 ? (
              <Grid container spacing={2}>
                {prioritySlice.map((item) => (
                  <Grid item xs={12} md={6} xl={4} key={item.ID}>
                    <NotificationCard item={item} onToggleViewed={handleViewedToggle} />
                  </Grid>
                ))}
              </Grid>
            ) : null}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
