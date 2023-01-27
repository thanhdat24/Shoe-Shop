import React, { useCallback, useEffect, useMemo, useState } from 'react';
// @mui
import { Box, Button, Rating, TextField, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFEditor, RHFUploadMultiFile } from '../components/hook-form';
import { useDispatch, useSelector } from '../redux/store';
import { fCurrency } from '../utils/formatNumber';
import { changeRating } from '../redux/slices/rating';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const labels = {
  1: 'Tệ',
  2: 'Không hài lòng',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Tuyệt vời',
};

export default function RatingItem({ itemReview, idOrder, idProduct }) {
  const [dataRating, setDataRating] = useState({
    idOrder,
    idProduct,
    content: '',
    rating: 3,
    imageRating: [],
  });

  // console.log('dataRating', dataRating);
  // console.log('itemReview', itemReview);

  // const { ratingList, successRating } = useSelector((state) => state.rating);

  // console.log('successRating', successRating);

  const imageTypeRegex = /image\/(png|jpg|jpeg)/gm;

  const defaultValues = useMemo(
    () => ({
      name: '',
      desc: '',
      productImages: [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    getValues,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dispatch = useDispatch();
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles;
      const gallery = [];
      const imageGallery = [];
      file.forEach((item, index) => {
        if (item.type.match(imageTypeRegex)) {
          gallery.push(item);
        }
      });
      if (gallery.length) {
        gallery.forEach((file) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);

          fileReader.onload = (e) => {
            //  const { result } = e.target;
            if (e.target.result) {
              imageGallery.push(e.target.result);
            }
            if (imageGallery.length === gallery.length) {
              setDataRating((data) => ({ ...data, imageRating: imageGallery }));
            }

            setValue('productImages', imageGallery);
          };
        });
      }
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('productImages', []);
    setDataRating((data) => ({ ...data, imageRating: [] }));
  };

  const handleRemove = (file) => {
    const filteredItems = values.productImages?.filter((_file) => _file !== file);
    setValue('productImages', filteredItems);
    setDataRating((data) => ({ ...data, imageRating: filteredItems }));
  };

  const handleChangeRating = (event, newValue) => {
    setDataRating((data) => ({ ...data, rating: parseFloat(newValue) }));
  };

  const handleTyping = (e) => {
    setDataRating((data) => ({ ...data, content: e.target.value }));
  };

  useEffect(() => {
    dispatch(changeRating(dataRating));
  }, [dataRating]);

  const onSubmit = async (rating) => {
    dispatch(changeRating(dataRating));
  };
  return (
    <FormProvider methods={methods}>
      {itemReview.productDetail.length > 1 ? (
        <Box>
          <Box className="flex">
            <Box className="flex">
              <Box>
                <img
                  src={itemReview.productDetail[0].productImage}
                  style={{
                    width: '90px',
                    height: '90px',
                    marginRight: 12,
                  }}
                  alt={itemReview.productDetail[0].name}
                />
              </Box>
              <Box>
                <p className="text-black">{itemReview.productDetail[0].idProduct.name}</p>
                <p className="text-gray-500">
                  Phân loại hàng:{' '}
                  {itemReview?.productDetail?.map((item) => (
                    <>
                      {item.idColor.name}, {item.idSize.name},{' '}
                    </>
                  ))}
                </p>
              </Box>
            </Box>
          </Box>
          <Box className="my-4">
            <Box className="flex ">
              <Typography variant="span" gutterBottom>
                Chất lượng sản phẩm
              </Typography>
              <Typography variant="span" gutterBottom>
                <Rating className="ml-5" value={dataRating.rating} size={'medium'} onChange={handleChangeRating} />
              </Typography>
              <Box sx={{ ml: 2 }}>
                {dataRating.rating >= 4 ? (
                  <Typography className="text-orange-600" variant="span" gutterBottom>
                    {labels[dataRating.rating]}
                  </Typography>
                ) : (
                  <Typography variant="span" gutterBottom>
                    {labels[dataRating.rating]}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              <TextField
                sx={{
                  '& .MuiInputLabel-root': {
                    transform: 'translate(18px, 29px) scale(1)',
                    color: 'gray',
                    right: 18,
                    top: 0,
                  },
                  '& label.Mui-focused': {
                    display: 'none',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: 'purple',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      top: 0,
                      '& legend': {
                        display: 'none',
                      },
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fb4226',
                      boxShadow: 'inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(251 66 38 / 60%)',
                      borderWidth: 1,
                    },
                    '& input': {
                      padding: '30px 20px',
                    },
                  },
                }}
                onChange={handleTyping}
                fullWidth
                //   value={dataRating.content}
                variant="outlined"
                label={dataRating.content ? '' : 'Giờ đã đến lúc ngôn từ lên ngôi ✍️'}
              />
            </Box>
            <RHFUploadMultiFile
              isExistUploadRating
              name="productImages"
              showPreview
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
            />
          </Box>
        </Box>
      ) : (
        itemReview.productDetail.map((item) => (
          <Box>
            <Box className="flex">
              <Box className="flex">
                <Box>
                  <img
                    src={item.productImage}
                    style={{
                      width: '90px',
                      height: '90px',
                      marginRight: 12,
                    }}
                    alt={item.name}
                  />
                </Box>
                <Box>
                  <p className="text-black">{item.idProduct.name}</p>
                  <p className="text-gray-500">
                    Phân loại hàng: {item.idColor.name}, {item.idSize.name},{' '}
                  </p>
                </Box>
              </Box>
            </Box>
            <Box className="my-4">
              <Box className="flex ">
                <Typography variant="span" gutterBottom>
                  Chất lượng sản phẩm
                </Typography>
                <Typography variant="span" gutterBottom>
                  <Rating className="ml-5" value={dataRating.rating} size={'medium'} onChange={handleChangeRating} />
                </Typography>
                <Box sx={{ ml: 2 }}>
                  {dataRating.rating >= 4 ? (
                    <Typography className="text-orange-600" variant="span" gutterBottom>
                      {labels[dataRating.rating]}
                    </Typography>
                  ) : (
                    <Typography variant="span" gutterBottom>
                      {labels[dataRating.rating]}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <TextField
                  sx={{
                    '& .MuiInputLabel-root': {
                      transform: 'translate(18px, 29px) scale(1)',
                      color: 'gray',
                      right: 18,
                      top: 0,
                    },
                    '& label.Mui-focused': {
                      display: 'none',
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: 'purple',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        top: 0,
                        '& legend': {
                          display: 'none',
                        },
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fb4226',
                        boxShadow: 'inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(251 66 38 / 60%)',
                        borderWidth: 1,
                      },
                      '& input': {
                        padding: '30px 20px',
                      },
                    },
                  }}
                  onChange={(event) => handleTyping(event, itemReview._id)}
                  fullWidth
                  //   value={dataRating.content}
                  variant="outlined"
                  label={dataRating.content ? '' : 'Giờ đã đến lúc ngôn từ lên ngôi ✍️'}
                />
              </Box>
              <div>
                <RHFUploadMultiFile
                  isExistUploadRating
                  name="productImages"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
            </Box>
          </Box>
        ))
      )}
    </FormProvider>
  );
}
