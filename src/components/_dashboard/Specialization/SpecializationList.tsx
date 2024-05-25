import React from 'react';
import { Grid } from '@mui/material';
import ShopSpecializationCard from '@/components/_dashboard/Specialization/SpecializationCard';

interface Props {
    specializations;
    order?;
}

const SpecializationList = (props: Props): JSX.Element => {
    const { specializations, ...other } = props;
    return (
        <Grid container spacing={3} {...other}>
            {specializations.map((specialization) => (
                <Grid key={specialization.id} item xs={12} sm={6} md={3}>
                    <ShopSpecializationCard specialization={specialization} />
                </Grid>
            ))}
        </Grid>
    );
};

export default SpecializationList;
