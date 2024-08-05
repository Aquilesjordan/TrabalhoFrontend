import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Container, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const ScheduleTable = ({ userName }) => {
  const [appointments, setAppointments] = useState({});
  const [newAppointment, setNewAppointment] = useState({ time: '', description: '' });
  const [availableHours, setAvailableHours] = useState(hours);

  useEffect(() => {
    // Fetch existing appointments from JSON Server
    axios.get('http://localhost:5000/appointments')
      .then(response => {
        const fetchedAppointments = response.data.reduce((acc, appointment) => {
          acc[appointment.time] = { description: appointment.description, id: appointment.id };
          return acc;
        }, {});
        setAppointments(fetchedAppointments);
      })
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  useEffect(() => {
    // Update available hours based on current appointments
    const occupiedHours = Object.keys(appointments);
    setAvailableHours(hours.filter(hour => !occupiedHours.includes(hour)));
  }, [appointments]);

  const handleAddAppointment = () => {
    if (newAppointment.time && newAppointment.description) {
      axios.post('http://localhost:5000/appointments', {
        time: newAppointment.time,
        description: `${userName} - ${newAppointment.description}`
      })
      .then(response => {
        setAppointments(prev => ({
          ...prev,
          [newAppointment.time]: { description: `${userName} - ${newAppointment.description}`, id: response.data.id }
        }));
        setNewAppointment({ time: '', description: '' });
      })
      .catch(error => {
        console.error('Error adding appointment:', error);
        alert('Failed to add appointment');
      });
    } else {
      alert("Por favor, preencha ambos os campos de horário e descrição.");
    }
  };

  const handleReleaseAppointment = (time) => {
    const appointmentId = appointments[time]?.id;
    if (appointmentId) {
      axios.delete(`http://localhost:5000/appointments/${appointmentId}`)
        .then(response => {
          setAppointments(prev => {
            const updatedAppointments = { ...prev };
            delete updatedAppointments[time];
            return updatedAppointments;
          });
        })
        .catch(error => {
          console.error('Error releasing appointment:', error);
          alert('Failed to release appointment');
        });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Agenda</Typography>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <TextField
          label="Horário"
          select
          SelectProps={{
            native: true,
          }}
          value={newAppointment.time}
          onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })}
          InputLabelProps={{ shrink: true }}
        >
          <option value=""></option>
          {availableHours.map(hour => (
            <option key={hour} value={hour}>{hour}</option>
          ))}
        </TextField>
        <TextField
          label="Descrição"
          value={newAppointment.description}
          onChange={e => setNewAppointment({ ...newAppointment, description: e.target.value })}
        />
        <Button variant="contained" onClick={handleAddAppointment}>Adicionar</Button>
      </Box>
      <Grid container spacing={3}>
        {hours.map(hour => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={hour}>
            <Paper style={{ padding: '1rem', textAlign: 'center', height: '100%' }}>
              <Typography variant="h6">{hour}</Typography>
              <Typography variant="body1">
                {appointments[hour] ? (
                  <Box>
                    <div>{appointments[hour].description}</div>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      onClick={() => handleReleaseAppointment(hour)}
                      style={{ marginTop: '8px' }}
                    >
                      Liberar
                    </Button>
                  </Box>
                ) : 'Disponível'}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ScheduleTable;
