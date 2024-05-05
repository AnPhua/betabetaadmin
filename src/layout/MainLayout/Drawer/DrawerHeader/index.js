import PropTypes from 'prop-types';
import { Stack, Typography } from '@mui/material';
import MainCard from '../../../../components/MainCard';
import DrawerHeaderStyled from './DrawerHeaderStyled';
import ad from '../../../../assets/images/svg/administrator.svg';

const DrawerHeader = ({ open }) => {
  return (
    <DrawerHeaderStyled open={open}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
        <MainCard border={false}>
          <Stack spacing={0} justifyContent="center" alignItems="center" textAlign="center">
            <img src={ad} alt="adminstrator" />
            <Typography variant="subtitle1">ADMINISTRATOR</Typography>
          </Stack>
        </MainCard>
      </Stack>
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
