import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { Gender, HeaderLabel, IPatient } from '@/models';
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
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'gender', label: 'Gender', alignRight: false },
    { id: 'dateOfBirth', label: 'Date Of Birth', alignRight: false },
    { id: 'address', label: 'Address', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false }
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

const Patient = (): JSX.Element => {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [patients, setPatients] = useState<IPatient[]>([]);
    const [selected, setSelected] = useState<IPatient[]>([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getData = useCallback(() => {
        setIsLoading(true);
        axiosClient
            .get('/patients')
            .then((res) => {
                setPatients(
                    res.data.data.map((s) => ({
                        id: s.id,
                        name: s.name,
                        avatar: s.avatar,
                        dateOfBirth: s.date_of_birth,
                        gender: s.gender,
                        email: s.account.email,
                        address: s.address
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
            setSelected(patients);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: IPatient[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
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

    const handleRemove = useCallback((id) => {
        setIsLoading(true);
        axiosClient
            .delete(`/patients/${id}`)
            .then((res) => {
                getData();
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patients.length) : 0;

    const filteredPatients = applySortFilter(patients, getComparator(order, orderBy), filterName);

    const isPatientNotFound = filteredPatients.length === 0;

    return (
        <Page title="Patient">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Patient
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
                                    rowCount={patients.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                    hideCheckbox
                                />
                                <TableBody>
                                    {filteredPatients
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const {
                                                id,
                                                name,
                                                avatar,
                                                gender,
                                                dateOfBirth,
                                                email,
                                                address
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
                                                    <TableCell align="left">{email}</TableCell>
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
                                                        {dateOfBirth}
                                                    </TableCell>
                                                    <TableCell align="left">{address}</TableCell>
                                                    <TableCell align="right">
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                cursor: 'pointer',
                                                                backgroundColor: 'red',
                                                                borderRadius: '8px',
                                                                padding: 10,
                                                                color: 'white'
                                                            }}
                                                            onClick={() => {
                                                                handleRemove(id);
                                                            }}
                                                        >
                                                            <Icon
                                                                icon={trash2Outline}
                                                                width={24}
                                                                height={24}
                                                                color="white"
                                                            />
                                                            Delete
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {isPatientNotFound && (
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
                        count={patients.length}
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

export default Patient;
