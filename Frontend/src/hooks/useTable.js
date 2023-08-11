import { useState } from 'react';

// ----------------------------------------------------------------------

export default function useTable(props) {
  const [dense, setDense] = useState(props?.defaultDense || false);

  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

  const [order, setOrder] = useState(props?.defaultOrder || 'asc');

  const [page, setPage] = useState(props?.defaultCurrentPage || 0);

  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 5);

  const [selected, setSelected] = useState(props?.defaultSelected || []);

  const [selectedInventory, setSelectedInventory] = useState(props?.defaultSelected || []);
  const onSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const onSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    console.log('newSelected', newSelected);
    setSelected(newSelected);
  };

  const onSelectRowInventory = (item) => {
    const selectedIndex = selectedInventory.findIndex((item1) => item1._id === item._id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedInventory, item);
    } else {
      newSelected = selectedInventory.filter((item2) => item2._id !== item._id);
    }

    setSelectedInventory(newSelected);
  };

  const onSelectAllRows = (checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const onChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const onChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // filter

  return {
    dense,
    order,
    page,
    setPage,
    orderBy,
    rowsPerPage,
    //
    selected,
    selectedInventory,
    setSelected,
    setSelectedInventory,
    onSelectRow,
    onSelectRowInventory,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeDense,
    onChangeRowsPerPage,
  };
}

// ----------------------------------------------------------------------

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
