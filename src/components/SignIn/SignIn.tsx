import React from 'react';
import { useNavigate } from "react-router-dom";

import { Container, Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useFetch } from 'hooks';
import useLocalStorage from 'hooks/useLocalStorage';
import { path } from 'helpers/configs';


const SignIn = (): JSX.Element => {
  const navigate = useNavigate();
  const { signIn } = useFetch();
  const { setLocalStorage } = useLocalStorage();
  const { dashboard, signUp } = path;

  
  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();

    const email = ( document.querySelector('#email') as HTMLInputElement ).value;
    const password = ( document.querySelector('#password') as HTMLInputElement ).value;

    const userData = new URLSearchParams({
        'username': email,
        'password': password,
    });

    const signedInUserData = await signIn(userData)
    // !!signedInUserData?.length

    if(signedInUserData) {
        setLocalStorage(signedInUserData);
        navigate(dashboard);
    }
}

  return (
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={signUp} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}

export default SignIn;