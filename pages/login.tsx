import React from 'react';
import {
  Container, Grid, Typography,
} from '@material-ui/core';
import useAuth from '../client/hooks/useAuth';



const Login: React.FC = ({}) => {
  useAuth();
  return (
    <Container>
      <Grid container justify="center" spacing={4}>
        <Grid item md={6}>
          <div>
            <Typography variant="h4">
              Login
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;