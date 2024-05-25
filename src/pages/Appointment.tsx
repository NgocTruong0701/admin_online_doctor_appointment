import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { Gender, HeaderLabel, IAppointment } from '@/models';
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
    ListItemText,
    TextField,
    MenuItem
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
import { DatePicker } from '@mui/lab';
import { sentenceCase } from '@/utils/stringHelper';

const TABLE_HEAD: HeaderLabel[] = [
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'description', label: 'Description', alignRight: false },
    { id: 'duration', label: 'Duration', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false }
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

const Appointment = (): JSX.Element => {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [selected, setSelected] = useState<IAppointment[]>([]);
    const [orderBy, setOrderBy] = useState('date');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const getData = useCallback(() => {
        setIsLoading(true);
        axiosClient
            .get('/Appointments')
            .then((res) => {
                setAppointments(
                    res.data.data.map((s) => ({
                        id: s.id,
                        date: new Date(s.date),
                        description: s.description,
                        duration: s.duration,
                        status: sentenceCase(s.status)
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
        if (property !== 'date') return;
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(appointments);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - appointments.length) : 0;

    const filteredAppointments = applySortFilter(
        appointments
            .filter((s) => !selectedStatus || s.status === selectedStatus)
            .filter((s) => !selectedDate || s.date.getDate() === new Date(selectedDate).getDate()),
        getComparator(order, orderBy),
        filterName
    );

    const isAppointmentNotFound = filteredAppointments.length === 0;

    return (
        <Page title="Appointment">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Appointment
                    </Typography>
                </Stack>

                <Card>
                    {/* <UserListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        placeholder="Search by name..."
                        hideCheckbox
                    /> */}
                    <div
                        style={{
                            padding: '10px 0',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TextField
                            type="date"
                            label="Select Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <TextField
                            select
                            label="Filter by status"
                            value={selectedStatus}
                            style={{ width: '150px' }}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="">All</MenuItem>
                            {[...new Set(appointments.map((s) => s.status))].map((s) => (
                                <MenuItem value={sentenceCase(s)}>{sentenceCase(s)}</MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={appointments.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                    hideCheckbox
                                />
                                <TableBody>
                                    {filteredAppointments
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const { id, date, description, duration, status } = row;
                                            // const isItemSelected = selected.indexOf(name) !== -1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    // selected={isItemSelected}
                                                    // aria-checked={isItemSelected}
                                                >
                                                    {/* <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) =>
                                                                handleClick(event, name)
                                                            }
                                                        />
                                                    </TableCell> */}
                                                    <TableCell align="left">
                                                        {(date as Date).toLocaleDateString()}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        {description}
                                                    </TableCell>
                                                    <TableCell align="left">{duration}</TableCell>
                                                    <TableCell align="left">
                                                        <Label
                                                            variant="ghost"
                                                            color={
                                                                status === 'Completed'
                                                                    ? 'success'
                                                                    : status === 'Cancelled'
                                                                    ? 'error'
                                                                    : 'warning'
                                                            }
                                                        >
                                                            {status}
                                                        </Label>
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
                                {isAppointmentNotFound && (
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
                        count={appointments.length}
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

export default Appointment;
