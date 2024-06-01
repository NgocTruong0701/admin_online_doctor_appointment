import React from 'react';
import { Box } from '@mui/material';

interface Props {
    sx?;
}

const Logo = (props: Props): JSX.Element => {
    const { sx } = props;
    return (
        <Box
            component="img"
            src={
                'https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/admin/icon.png'
            }
            sx={{ width: 40, height: 40, ...sx }}
        />
    );
};

export default Logo;
