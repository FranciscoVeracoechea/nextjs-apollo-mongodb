import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MuiLink from '@material-ui/core/Link';
import ProTip from '../client/components/ProTip';
import Link from '../client/components/Link';
import { gql } from 'apollo-boost';
import { withApollo } from '../lib/withApollo';
import { useQuery } from '@apollo/react-hooks';
import useAuth from '../client/hooks/useAuth';


const Copyright: React.FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" href="https://material-ui.com/">
        Your Website
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

const GET_USERS = gql`
  query {
    getUsers {
      id
      email
      username
    }
  }
`;
const Index: React.FC<{}> = () => {
  useAuth();
  const { data, error } = useQuery(GET_USERS);
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Home
        </Typography>
        <Link href="/about">
          Go to the about page
        </Link>
        <Typography variant="body1" gutterBottom>
          {JSON.stringify(data, undefined, 2)}
        </Typography>
        <Typography variant="body1" color="error">
          {JSON.stringify(error, undefined, 2)}
        </Typography>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}

export default withApollo({ ssr: true })(Index);