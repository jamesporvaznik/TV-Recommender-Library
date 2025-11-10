import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 310;
const ICON_MARGIN = 20; // Used for spacing the icon from the edge

// Main content area styling remains the same for shifting
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({ 
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    // Add top padding equivalent to the icon's fixed position/margin
    paddingTop: theme.spacing(3) + ICON_MARGIN, 
  }),
);

// Define this inside or above your PersistentDrawerLeft/Drawer component
const navigationMap = [
  { 
    text: 'Create List', 
    mode: 'Create List' 
  },
  { 
    text: 'Get Recommendations by List', 
    mode: 'Get Recommendations by List' 
  },
  { 
    text: 'Get Recommendations by Search', 
    mode: 'Get Recommendations by Search' 
  },
  { 
    text: 'Get Recommendations from Watched', 
    mode: 'Get Recommendations from Watched' 
  },
];

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  justifyContent: 'flex-end',
}));

// Accept the children prop here
export default function PersistentDrawerLeft({ children, changeMode, currentMode }) { 
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Fixed Toggle Button Container */}
      <Box 
        sx={{
          position: 'fixed',
          top: ICON_MARGIN / 2,
          left: open ? drawerWidth : ICON_MARGIN / 2,
          zIndex: 1000, 
          transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          sx={{
              ...(open && { display: 'none' })
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
            {navigationMap.map((item) => ( 

                <ListItem key={item.mode} disablePadding> 
                
                <ListItemButton
                    onClick={() => changeMode(item.mode)}
                    sx={{
                      // Ensure the button spans the full width and handles padding
                      display: 'flex',
                      justifyContent: 'flex-start',
                      
                      // Conditional styling to highlight the active item
                      bgcolor: currentMode === item.mode ? 'action.selected' : 'inherit',
                      
                      // Optional: Add hover effect for better UX
                      '&:hover': {
                        bgcolor: currentMode === item.mode ? 'action.selected' : 'action.hover',
                      },
                    }}
                >
                    <ListItemText primary={item.text} />
                </ListItemButton>
                </ListItem>
            ))}
        </List>
      </Drawer>
      
      {/* Main content area now renders children (your page components) */}
      <Main open={open}>
          {children} 
      </Main>
    </Box>
  );
}
