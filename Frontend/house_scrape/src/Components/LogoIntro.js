import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import './LogoIntro.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';


const theme = createTheme({
    palette: {
        primary: {
            main: '#007bff',
        },
        secondary: {
            main: '#6c757d',
        },
        customColor: {
            main: '#ffffff',
        },
    },
});

function LogoIntro() {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Grid className='LogoIntroGrid' alignItems='center' textAlign={'center'} sx={{alignItems: 'center', paddingTop: '4%', paddingBottom: '4%'}}>    
            {!isMobile && (
                <FormLabel sx={{fontSize: '2.5rem', color: 'black', paddingRight: '2.5%', borderRight: 1}}>LOGO</FormLabel>
            )}  
            <FormLabel sx={{fontSize: '1.75rem', color: 'primary.main', paddingLeft: '2.5%'}}>Deals </FormLabel>      
            <FormLabel sx={{fontSize: '1.75rem', color: 'black'}}>from your favourite marketplaces</FormLabel>
        </Grid>
    );
}

export default LogoIntro;