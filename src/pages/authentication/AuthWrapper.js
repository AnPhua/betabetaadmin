import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@mui/material';
import AuthCard from './AuthCard';
import AuthFooter from 'components/cards/AuthFooter';
import image from '../../assets/images/image.jpg';
import AuthBackground from 'assets/images/auth/AuthBackground';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const AuthWrapper = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <Box sx={{ minHeight: '100vh' }}>
        <AuthBackground />
        <Grid container component="main" className={classes.root}>
          <Grid
            container
            direction="column"
            justifyContent="flex-end"
            sx={{
              minHeight: '100vh'
            }}
          >
            <Grid item xs={12} sx={{ ml: 3, mt: 3 }}></Grid>
            <Grid item xs={12}>
              <Grid
                item
                xs={12}
                container
                justifyContent="center"
                alignItems="center"
                sx={{ minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
              >
                <Grid item>
                  <AuthCard>{children}</AuthCard>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
              <AuthFooter />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

AuthWrapper.propTypes = {
  children: PropTypes.node
};

export default AuthWrapper;
