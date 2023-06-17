// @mui
import { Stack, Button, Typography } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DOCS } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  const { user } = useAuth();

  return (
    <Stack spacing={3} sx={{ px: 5, pb: 5, mt: 2, width: 1, textAlign: 'center', display: 'block' }}>

      <div>
        <Typography gutterBottom variant="subtitle1">
          Hi, {user?.displayName}
        </Typography>
      </div>
    </Stack>
  );
}
