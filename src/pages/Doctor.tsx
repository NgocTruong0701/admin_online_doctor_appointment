import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { Gender, HeaderLabel, IDoctor } from '@/models';
import React, { useCallback, useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import Page from '@/components/Page';
import Label from '@/components/Label';
import Scrollbar from '@/components/Scrollbar';
import SearchNotFound from '@/components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '@/components/_dashboard/user';
import axiosClient from '@/api/axiosClient';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import axios from 'axios';
import { useLoading } from '@/context/LoadingContext';

const TABLE_HEAD: HeaderLabel[] = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'gender', label: 'Gender', alignRight: false },
    { id: 'dateOfBirth', label: 'Date Of Birth', alignRight: false },
    { id: 'hospital', label: 'Hospital', alignRight: false },
    { id: 'specializationName', label: 'Specialization Name', alignRight: false },
    { id: 'yearsExperience', label: 'Years Experience', alignRight: false },
    { id: 'schedule', label: 'Schedule', alignRight: false }
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(
            array,
            (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

const Doctor = (): JSX.Element => {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [Doctors, setDoctors] = useState<IDoctor[]>([]);
    const [selected, setSelected] = useState<IDoctor[]>([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getData = useCallback(() => {
        setIsLoading(true);
        axiosClient
            .get('/doctors/findAllAdmin')
            .then((res) => {
                console.log(res.data.data);

                setDoctors(
                    res.data.data.map((s) => ({
                        id: s.id,
                        name: s.name,
                        avatar: s.avatar,
                        dateOfBirth: new Date(s.date_of_birth),
                        gender: s.gender,
                        hospital: s.hospital,
                        specializationName: s.specialization_name,
                        yearsExperience: s.years_experience,
                        schedule: s.schedule
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

    const { setIsLoading } = useLoading();

    const handleRequestSort = (event, property) => {
        if (property !== 'name') return;
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(Doctors);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Doctors.length) : 0;

    const filteredDoctors = applySortFilter(Doctors, getComparator(order, orderBy), filterName);

    const isDoctorNotFound = filteredDoctors.length === 0;

    return (
        <Page title="Doctor">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Doctor
                    </Typography>
                </Stack>

                <Card>
                    <UserListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        placeholder="Search by name..."
                        hideCheckbox
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={Doctors.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                    hideCheckbox
                                />
                                <TableBody>
                                    {filteredDoctors
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const {
                                                id,
                                                name,
                                                avatar,
                                                gender,
                                                dateOfBirth,
                                                hospital,
                                                specializationName,
                                                yearsExperience,
                                                schedule
                                            } = row;
                                            const genderString =
                                                gender === Gender.Male ? 'Male' : 'Female';
                                            const isItemSelected = selected.indexOf(name) !== -1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    {/* <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) =>
                                                                handleClick(event, name)
                                                            }
                                                        />
                                                    </TableCell> */}
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={2}
                                                        >
                                                            <Avatar alt={name} src={avatar} />
                                                            <Typography variant="subtitle2" noWrap>
                                                                {name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Label
                                                            variant="ghost"
                                                            color={
                                                                gender === Gender.Male
                                                                    ? 'error'
                                                                    : 'success'
                                                            }
                                                        >
                                                            {genderString}
                                                        </Label>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {(dateOfBirth as Date).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell align="left">{hospital}</TableCell>
                                                    <TableCell align="left">
                                                        {specializationName}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {yearsExperience}
                                                    </TableCell>
                                                    <TableCell align="left">{schedule}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {isDoctorNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={filterName} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={Doctors.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    );
};

export default Doctor;
