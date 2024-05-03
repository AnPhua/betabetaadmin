// material-ui
import { useMediaQuery, Container, Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'space-between'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
      >
        <Typography variant="subtitle2" color="secondary" component="span">
          &copy; Trang Dành Cho&nbsp;
          <Typography component={Link} variant="subtitle2" target="_blank" underline="hover">
            Admin
          </Typography>
        </Typography>

        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={matchDownSM ? 1 : 3} textAlign={matchDownSM ? 'center' : 'inherit'}>
          <Typography variant="subtitle2" color="secondary" target="_blank" underline="hover">
            Cinema
          </Typography>
          <Typography variant="subtitle2" color="secondary" target="_blank" underline="hover">
            Cinema
          </Typography>
          <Typography variant="subtitle2" color="secondary" target="_blank" underline="hover">
            Cinema
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AuthFooter;
