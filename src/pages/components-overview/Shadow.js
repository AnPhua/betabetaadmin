import PropTypes from 'prop-types';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';

function ShadowBox({ shadow }) {
  return (
    <MainCard border={false} sx={{ boxShadow: shadow }}>
      <Stack spacing={1} justifyContent="center" alignItems="center">
        <Typography variant="h6">boxShadow</Typography>
        <Typography variant="subtitle1">{shadow}</Typography>
      </Stack>
    </MainCard>
  );
}

ShadowBox.propTypes = {
  shadow: PropTypes.string.isRequired
};

function CustomShadowBox({ shadow, label, color, bgcolor }) {
  return (
    <MainCard border={false} sx={{ bgcolor: bgcolor || 'inherit', boxShadow: shadow }}>
      <Stack spacing={1} justifyContent="center" alignItems="center">
        <Typography variant="subtitle1" color={color}>
          {label}
        </Typography>
      </Stack>
    </MainCard>
  );
}

CustomShadowBox.propTypes = {
  shadow: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  bgcolor: PropTypes.string
};

// ============================|| COMPONENT - SHADOW ||============================ //

const ComponentShadow = () => {
  return (
    <ComponentSkeleton>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Basic Shadow" codeHighlight>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <ShadowBox shadow="0" />
              </Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <ShadowBox shadow="20" />
              </Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <ShadowBox shadow="21" />
              </Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <ShadowBox shadow="22" />
              </Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <ShadowBox shadow="23" />
              </Grid>
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <ShadowBox shadow="24" />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </ComponentSkeleton>
  );
};

export default ComponentShadow;
