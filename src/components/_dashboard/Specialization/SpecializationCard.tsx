import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fCurrency } from '@/utils/formatNumber';
import Label from '../../Label';
import ColorPreview from '../../ColorPreview';
import { ISpecialization } from '@/models';

const SpecializationImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
});

interface Props {
    specialization: ISpecialization;
}

export const ShopSpecializationCard = (props: Props): JSX.Element => {
    const { name, id, icon } = props.specialization;

    return (
        <Card>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                <SpecializationImgStyle alt={name} src={icon} />
            </Box>

            <Stack spacing={2} sx={{ p: 3 }}>
                <Typography variant="h5" noWrap sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {name}
                </Typography>
            </Stack>
        </Card>
    );
};

export default ShopSpecializationCard;
