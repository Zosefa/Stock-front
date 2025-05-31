import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Avatar,
  Divider,
  styled,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccountCircle as AccountCircleIcon,
  Category as CategoryIcon,
  Inventory2 as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  PointOfSale as PointOfSaleIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import FactoryIcon from '@mui/icons-material/Factory';
import { blue, indigo } from "@mui/material/colors";
import './dasboard.scss'
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  background: "white",
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));


const GradientAvatar = styled(Avatar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${blue[500]}, ${indigo[500]})`,
  width: 56,
  height: 56,
}));

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const [image,setImage] = useState();
  const [username,setUsername] = useState();

  const IMAGE_URL = `${import.meta.env.VITE_IMAGE_URL}`;

  const getInfoUser = async () => {
    const response = await authService.infoUser(sessionStorage.getItem("id"));
    if(response && response.info.image && response.info.username){
        setImage(response.info.image);
        setUsername(response.info.username);
    }
  }

  const logout = async () => {
    await authService.logout();
    navigate("/login");
  }

  useEffect(() => {
    getInfoUser();
  },[])

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Deconnexion
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {renderMobileMenu}
      {renderMenu}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "none",
            background: "#f8fafc",
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
      >
        <DrawerHeader>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", p: 2 }}>
            {image ? (
                <Avatar
                    src={`${IMAGE_URL}${image}`}
                    sx={{ width: 56, height: 56 }}
                />
                ) : (
                <GradientAvatar>
                    <AccountCircleIcon />
                </GradientAvatar>
            )}
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {username || ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Admin
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: "Tableau de bord", icon: <DashboardIcon />, path: "/admin" },
            { text: "Type Article", icon: <CategoryIcon />, path: "/admin/type-article" },
            { text: "Article", icon: <InventoryIcon />, path: "/admin/article" },
            { text: "Client", icon: <PeopleIcon />, path: "/admin/client" },
            { text: "Fournisseur", icon: <FactoryIcon />, path: "/admin/fournisseur" },
            { text: "Approvisionnement", icon: <LocalShippingIcon />, path: "/admin/approvisionnement" },
            { text: "Vente", icon: <PointOfSaleIcon />, path: "/admin/vente" },
            { text: "Stock", icon: <StoreIcon />, path: "/admin/stock" },
          ].map((item) => (
            <ListItem button key={item.text} sx={{ borderRadius: 2, mx: 1, my: 0.5,backgroundColor: location.pathname === item.path ? "#e3f2fd" : "transparent", cursor: 'pointer' }} onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button sx={{ borderRadius: 2, mx: 1, my: 0.5, cursor: 'pointer' }} onClick={logout}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Deconnexion" />
          </ListItem>
        </List>
      </Drawer>

        <AppBarStyled position="fixed" open={open}>
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                G-STOCK
            </Typography>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                >
                <AccountCircleIcon />
                </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                >
                <NotificationsIcon />
                </IconButton>
            </Box>
            </Toolbar>
        </AppBarStyled>
      
      
      <Main open={open}>
          <DrawerHeader /> 
          <Outlet />
      </Main>
    </Box>
  );
};

export default Dashboard;