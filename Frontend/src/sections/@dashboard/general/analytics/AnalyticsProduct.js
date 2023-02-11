import {
  Box,
  Card,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import merge from 'lodash/merge';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../../../../redux/slices/product';
import { BaseOptionChart } from '../../../../components/chart';
import { getStaticProductDetailMonth, getStaticProductDetailYear } from '../../../../redux/slices/order';

export default function AnalyticsProduct() {
  const dispatch = useDispatch();
  const [seriesData, setSeriesData] = useState(2023);
  const [shoes, setShoes] = useState('63bc27604cf5e118b023c870');
  const { productList } = useSelector((state) => state.product);
  const { allAccountsList } = useSelector((state) => state.admin);
  const { staticProductDetail, staticProductDetailMonth } = useSelector((state) => state.order);
  //   const { orderList, orderByBookYear, orderByBookMonth } = useSelector((state) => state.OrderReducer);

  const handleChangeSeriesData = (event) => {
    console.log('event.target.value', event.target.value);
    // setSeriesData(Number(event.target.value));
    setSeriesData(Number(event.target.value));
  };
  const handleChangeShoes = (event) => {
    console.log('idProduct', event.target.value);
    setShoes(event.target.value);
  };
  useEffect(() => {
    dispatch(getAllProduct());
    if (seriesData === 2023) dispatch(getStaticProductDetailYear(shoes));
    else dispatch(getStaticProductDetailMonth(shoes));
  }, [dispatch, shoes, seriesData]);

  console.log('seriesData', seriesData);
  console.log('staticProductDetail', staticProductDetail);
  console.log('staticProductDetailMonth', staticProductDetailMonth);
  const CHART_DATA = [
    // data year
    {
      // year: 2022,
      data: [
        {
          name: 'Doanh thu bán ra',
          data: seriesData === 2023 ? staticProductDetail?.totalPrice : staticProductDetailMonth?.totalPrice,
        },
        {
          name: 'Số lượng bán ra',
          data: seriesData === 2023 ? staticProductDetail?.totalQuality : staticProductDetailMonth?.totalQuality,
        },
      ],
    },
  ];

  console.log('CHART_DATA', CHART_DATA);
  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      data:"",
      categories: seriesData === 2023 ? staticProductDetail?.arrayMonth : staticProductDetailMonth?.arrayMonth,
    },
    colors: ['#2065D1', '#FF6C40'],
  });

  return (
    <Card>
      <CardHeader
        title="Thống kê sản phẩm"
        action={
          <div className="flex mr-5">
            <Box sx={{ minWidth: 225}}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sản phẩm</InputLabel>
                <Select
                  autoWidth
                  // sx={{}}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={shoes}
                  label="Sản phẩm"
                  onChange={handleChangeShoes}
                >
                  {productList?.map((item, index) => {
                    return <MenuItem value={item.id}>{item.name}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
            <FormControl fullWidth>
              <TextField
                select
                fullWidth
                value={seriesData}
                SelectProps={{ native: true }}
                onChange={handleChangeSeriesData}
                sx={{
                  '& fieldset': { border: '0 !important' },
                  '& select': {
                    typography: 'subtitle2',
                    padding: '18px',
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0.75,
                    width: '100%',
                    marginLeft: '10px',
                    bgcolor: 'background.neutral',
                  },
                  '& .MuiSelect-outlined': {
                    borderRadius: 0.75,
                    width: '100%',
                    marginLeft: '10px',
                    bgcolor: 'background.neutral',
                  },
                  '& .MuiNativeSelect-icon': {
                    top: 4,
                    right: 0,
                    width: 20,
                    height: 20,
                  },
                  '& .MuiFormControl-fullWidth ': {
                    marginTop: '10px !important',
                  },
                  '& .MuiFormControl-root': {
                    alignItems: 'end !important',
                  },
                  '& .MuiTextField-root': {
                    alignItems: 'end !important',
                    marginTop: '10px !important',
                  },

                  'MuiTextField-root css-37zg1r-MuiFormControl-root-MuiTextField-root': {
                    marginTop: '10px !important',
                  },
                }}
              >
                <option className="mt-60 " value="2023">
                  Năm
                </option>
                <option className="mt-60" value="11">
                  Tháng
                </option>
              </TextField>
            </FormControl>
          </div>
        }
      />

      {CHART_DATA.map((item) => (
        <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
          <ReactApexChart type="line" series={item.data} options={chartOptions} height={364} />
        </Box>
      ))}
    </Card>
  );
}
