import React from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box } from '@mui/material';
import { BaseOptionChart } from '../../charts';
import { ApexOptions } from 'apexcharts';

const CHART_DATA = [
    {
        name: 'User',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
    },
    {
        name: 'Doctor',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    },
    {
        name: 'Appointment',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
    }
];

export const AppWebsiteVisits = (): JSX.Element => {
    const chartOptions: ApexOptions = merge(BaseOptionChart(), {
        stroke: { width: [0, 2, 3] },
        plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
        fill: { type: ['solid', 'gradient', 'solid'] },
        labels: [
            '01/05/2024',
            '02/05/2024',
            '03/05/2024',
            '04/05/2024',
            '05/05/2024',
            '06/05/2024',
            '07/05/2024',
            '08/05/2024',
            '09/05/2024',
            '10/05/2024',
            '11/05/2024'
        ],
        xaxis: { type: 'datetime' },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => {
                    if (typeof y !== 'undefined') {
                        return `${y.toFixed(0)} visits`;
                    }
                    return y;
                }
            }
        }
    });

    return (
        <Card>
            <CardHeader title="Summary" subheader="(+43%) than last year" />
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <ReactApexChart
                    type="line"
                    series={CHART_DATA}
                    options={chartOptions}
                    height={364}
                />
            </Box>
        </Card>
    );
};

export default AppWebsiteVisits;
