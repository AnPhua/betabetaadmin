// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = ({ showModal }) => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      {!matchesXs && <Profile showModal={showModal} />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
