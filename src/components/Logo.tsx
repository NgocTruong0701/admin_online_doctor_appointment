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
                'https://media.discordapp.net/attachments/1164047759041630299/1243921501326151690/icon.png?ex=66533bac&is=6651ea2c&hm=ff0adb1849d0c224890a075be98324d4aab8ce4febefe20045c73e8735e476a9&=&format=webp&quality=lossless&width=671&height=671'
            }
            sx={{ width: 40, height: 40, ...sx }}
        />
    );
};

export default Logo;
