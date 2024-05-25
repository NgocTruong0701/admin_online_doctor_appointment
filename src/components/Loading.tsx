import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = ({ isLoading }: { isLoading: boolean }) => {
    if (!isLoading) return null;
    return (
        <div
            style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100%',
                backgroundColor: '#ffffffaa',
                zIndex: 10000
            }}
        >
            <CircularProgress />
        </div>
    );
};

export default Loading;
