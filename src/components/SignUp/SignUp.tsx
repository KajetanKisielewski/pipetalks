import React from "react";
import { useNavigate } from "react-router-dom";

import { Container, Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


import { useFetch } from 'hooks';
import { path } from 'helpers/configs';


const SignUp = (): JSX.Element => {
    const navigate = useNavigate();
    const { signUp } = useFetch();
    const { signIn } = path;

    const handleSubmit = async (e:any): Promise<void> => {
        e.preventDefault();

        const email = (document.querySelector('#email') as HTMLInputElement).value;
        const name = (document.querySelector('#name') as HTMLInputElement).value;
        const password = (document.querySelector('#password') as HTMLInputElement).value;

        const userData = {
            'email': email,
            'name': name,
            'password': password,
        };

        const signedUpUserData = await signUp(userData);


        signedUpUserData && navigate(signIn);
    }

    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {'Sign Up'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="User Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
                  <Link onClick={() => navigate(signIn)} variant="body2">
                    {"Already have an account? Sign in"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
    );
}

export default SignUp;