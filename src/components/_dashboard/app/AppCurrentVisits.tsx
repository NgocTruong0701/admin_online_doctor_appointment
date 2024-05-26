import React, { useEffect } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import { fNumber } from '@/utils/formatNumber';
import { BaseOptionChart } from '@/components/charts';
import { ApexOptions } from 'apexcharts';
import axiosClient from '@/api/axiosClient';

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
    height: CHART_HEIGHT,
    marginTop: theme.spacing(5),
    '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
    '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
        overflow: 'visible'
    },
    '& .apexcharts-legend': {
        height: LEGEND_HEIGHT,
        alignContent: 'center',
        position: 'relative !important',
        borderTop: `solid 1px ${theme.palette.divider}`,
        top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
    }
}));

// ----------------------------------------------------------------------

const CHART_DATA = [12, 55, 5];

const AppCurrentVisits = (): JSX.Element => {
    const theme = useTheme();

    // useEffect(() => {
    //     axiosClient
    //     .get('/')
    // }, [])
    const chartOptions: ApexOptions = merge(BaseOptionChart(), {
        colors: [
            theme.palette.primary.main,
            theme.palette.info.main,
            // theme.palette.warning.main,
            theme.palette.error.main
        ],
        labels: ['UpComming', 'Completed', 'Cancelled'],
        stroke: { colors: [theme.palette.background.paper] },
        legend: { floating: true, horizontalAlign: 'center' },
        dataLabels: { enabled: true, dropShadow: { enabled: false } },
        tooltip: {
            fillSeriesColor: false,
            y: {
                formatter: (seriesName) => fNumber(seriesName),
                title: {
                    formatter: (seriesName) => `#${seriesName}`
                }
            }
        },
        plotOptions: {
            pie: { donut: { labels: { show: false } } }
        }
    });

    return (
        <Card>
            <CardHeader title="Appointment Status" />
            <ChartWrapperStyle dir="ltr">
                <ReactApexChart
                    type="pie"
                    series={CHART_DATA}
                    options={chartOptions}
                    height={280}
                />
            </ChartWrapperStyle>
        </Card>
    );
};

export default AppCurrentVisits;
