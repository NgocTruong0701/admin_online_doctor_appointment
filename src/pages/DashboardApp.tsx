import React from 'react';
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

const DashboardApp = (): JSX.Element => {
    return (
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Hi, Welcome back</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWeeklySales />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppNewUsers />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppItemOrders />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBugReports />
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