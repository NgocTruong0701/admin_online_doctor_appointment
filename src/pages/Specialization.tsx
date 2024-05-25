import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Modal, Stack, TextField, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import Page from '@/components/Page';
import {
    SpecializationSort,
    SpecializationList,
    SpecializationCartWidget,
    SpecializationFilterSidebar
} from '@/components/_dashboard/Specialization';
import { useLoading } from '@/context/LoadingContext';
import axiosClient from '@/api/axiosClient';

const Specialization = (): JSX.Element => {
    const [specializations, setSpecializations] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const { setIsLoading } = useLoading();
    const getData = useCallback(() => {
        setIsLoading(true);
        axiosClient
            .get('/specializations')
            .then((res) => {
                setSpecializations(
                    res.data.map((s) => ({
                        id: s.id,
                        name: s.name,
                        icon: s.icon
                    }))
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        getData();
    }, []);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);

        axiosClient
            .post('', formData)
            .then((response) => {
                console.log('Data saved:', response.data);
            })
            .catch((error) => {
                console.error('There was a problem saving the data:', error);
            })
            .finally(() => {
                handleClose();
            });
    };

    return (
        <Page title="Dashboard: Specialization">
            <Container>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 5 }}>
                        Specialization
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        <Icon icon="material-symbols-light:add-box" width={24} height={24} />
                        New
                    </Button>
                </div>

                <SpecializationList specializations={specializations} />
                {/* <SpecializationCartWidget /> */}
            </Container>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        borderRadius: '16px',
                        padding: '40px',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <h2 id="modal-title">New Specialization</h2>
                    <div
                        style={{
                            padding: '16px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={handleNameChange}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Button onClick={handleClose} variant="contained">
                            Close Modal
                        </Button>
                        <Button onClick={handleSave} variant="contained">
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>
        </Page>
    );
};

export default Specialization;
