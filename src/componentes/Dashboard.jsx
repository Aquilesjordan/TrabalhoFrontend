import React from 'react';
import { Container, Typography, Box, Avatar } from '@mui/material';
import ScheduleTable from './ScheduleTable';

const Dashboard = ({ user }) => {
  return (
    <Container>
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar src={user.photo} alt={user.name} sx={{ width: 56, height: 56, marginRight: 2 }} />
        <Typography variant="h4">Bem-vindo, {user.name}!</Typography>
      </Box>
      <ScheduleTable userName={user.name} />
    </Container>
  );
};

export default Dashboard;