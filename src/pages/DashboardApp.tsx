import React, { useEffect, useState } from 'react';
import { Box, Grid, Container, Typography } from '@mui/material';
import Page from '@/components/Page';
import {
    AppNewUsers,
    AppBugReports,
    AppItemOrders,
    AppWeeklySales,
    AppCurrentVisits,
    AppWebsiteVisits
} from '@/components/_dashboard/app';
import axiosClient from '@/api/axiosClient';
import { useNavigate } from 'react-router-dom';

export interface IDataAdminTotal {
    countPatient: number;
    countDoctor: number;
    countAppointment: number;
    countTodayAppointments: number;
}

const DashboardApp = (): JSX.Element => {
    const [countPatient, setCountPatient] = useState(0);
    const [countDoctor, setCountDoctor] = useState(0);
    const [countAppointment, setCountAppointment] = useState(0);
    const [countTodayAppointments, setCountTodayAppointments] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get('/admin/data-dashboard-total').then((response) => {
            const data = response.data.data as IDataAdminTotal;
            setCountAppointment(data.countAppointment);
            setCountPatient(data.countPatient);
            setCountDoctor(data.countDoctor);
            setCountTodayAppointments(data.countTodayAppointments);
        }).catch((error) => {
            console.error(error);
            navigate('/login');
        });
    }, [])

    return (
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Hi, Welcome back</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWeeklySales countDoctor={countDoctor} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppNewUsers countPatient={countPatient} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppItemOrders countAppointment={countAppointment}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBugReports countTodayAppointments={countTodayAppointments} />
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <AppWebsiteVisits />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <AppCurrentVisits />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default DashboardApp;
