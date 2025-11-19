import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText'



const drawerWidth = 320;
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
const generatorMap = [
  { 
    text: 'Recommendations from Watched', 
    mode: 'Get Recommendations from Watched' 
  },
  { 
    text: 'Recommendations by Search', 
    mode: 'Get Recommendations by Search' 
  },
];

// Group 2: User List Management & Generation (The part you want separate)
const listMap = [
  { 
    text: 'Create List', 
    mode: 'Create List' 
  },
  { 
    text: 'Recommendations by List', 
    mode: 'Get Recommendations by List' 
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

const getListItemStyles = (item, currentMode) => {
  const isActive = item.mode === currentMode;

  return {
      margin: '3px 12px 2px 12px',
      borderRadius: '6px',
      border: `solid, #5f626eff, 1px`,
      backgroundColor: '#101011ff',
      justifyContent: 'center',
      
      // Active State Styles
      ...(isActive && { 
          backgroundColor: '#f1f1f1ff',
          text: '#e0e0e0ff'
      }),
      
      // Hover State Styles
      '&:hover': {
          // backgroundColor: '#4a4b50ff' 
          backgroundColor: '#272727ff',
          text: '#e0e0e0ff'
      },
  };
};

const getTextStyles = (item, currentMode) => {
    const isActive = item.mode === currentMode;
    
    const defaultColor = '#faf9f9ff';
    const activeHoverColor = '#080000ff';
    
    const containerStyles = {
        flex: 'initial',
        
        '& .MuiListItemText-primary': {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600, 
            textAlign: 'center',
            color: defaultColor,

            '&.Mui-selected, &.Mui-selected:hover': { 
                color: activeHoverColor, 
            },
            
            '&:hover': {
                // color: activeHoverColor,
            },
            ...(isActive && { 
                color: activeHoverColor,
            })
        }
    };

    // If you need to change the style of the overall ListItemText wrapper
    // You can add more styles here if necessary, but the primary text is targeted above.
    return containerStyles;
};

  return (
    
    <Box sx={{ display: 'flex'}}>
      
      
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
            // backgroundColor: '#2c2c2eff', 
            backgroundColor: '#28282bff',
            color: '#9ca3af',
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
          <ListItem sx={{ pt: 1, pb: 0 }}>
            <Typography variant="overline" color="white">
              Quick Recommendations
            </Typography>
          </ListItem>
          
          {generatorMap.map((item) => ( 
            <ListItem key={item.mode} disablePadding>
              <ListItemButton onClick={() => changeMode(item.mode)} sx={getListItemStyles(item, currentMode)}>
                <ListItemText primary={item.text} sx={getTextStyles(item, currentMode)}/>
                {/* [Info Icon Button here if you re-add it] */}
              </ListItemButton>
            </ListItem>
          ))}
          
          <Divider sx={{ my: 1 }} />
          
          {/* List Explanation */}
          <ListItem sx={{ pt: 1, pb: 0 }}>
            <Typography variant="overline" color="white">
              Create List for Recommendations
            </Typography>
          </ListItem>
          <ListItem sx={{ pt: 1, pb: 1 }}>
            <Typography variant="body2" color="#9ca3af',
          },">
              How to Use Your List: You must first use "Create List" to build your show list, then click "Get Recommendations by List" to generate recommendations based on the list you created.
            </Typography>
          </ListItem>
          
          {listMap.map((item) => (
            <ListItem key={item.mode} disablePadding>
              <ListItemButton onClick={() => changeMode(item.mode)} sx={getListItemStyles(item, currentMode)} >
                <ListItemText primary={item.text} sx={getTextStyles(item, currentMode)} />
                {/* [Info Icon Button here if you re-add it] */}
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
