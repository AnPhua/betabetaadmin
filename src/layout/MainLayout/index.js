import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { Modal } from 'antd';
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { notification } from 'antd';
import { openDrawer } from 'store/reducers/menu';
import { signout } from 'store/reducers/authSlice';

const MainLayout = () => {
  const accessToken = localStorage.getItem('accesstoken');
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);

  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };
  const [openmodal, setOpenmodal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('accesstoken');
    dispatch(signout());
    setOpenmodal(false);
    setConfirmLoading(false);

    notification.success({
      message: 'Thành Công',
      description: 'Đăng Xuất Thành Công!'
    });
  };
  const showModal = () => {
    setOpenmodal(true);
  };
  const handleCancel = () => {
    setOpenmodal(false);
  };
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));
  }, [matchDownLG]);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
  }, [drawerOpen]);

  return accessToken ? (
    <>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Header open={open} handleDrawerToggle={handleDrawerToggle} showModal={showModal} />
        <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Toolbar />
          <Breadcrumbs navigation={navigation} title />
          <Outlet />
        </Box>
      </Box>
      <Modal
        title="Thông Báo !"
        open={openmodal}
        confirmLoading={confirmLoading}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Có"
        cancelText="Không"
        zIndex={2000}
      >
        <p>Bạn Có Chắc Chắn Muốn Đăng Xuất Không ?</p>
      </Modal>
    </>
  ) : null;
};

export default MainLayout;
