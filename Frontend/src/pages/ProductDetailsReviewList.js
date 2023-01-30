import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, List, Button, Rating, Avatar, ListItem, Pagination, Typography } from '@mui/material';
// utils
import { fDate } from '../utils/formatTime';
import { fShortenNumber } from '../utils/formatNumber';
// components
import Iconify from '../components/Iconify';
import Image from '../components/Image';
import { CarouselArrowIndex } from '../components/carousel';

// ----------------------------------------------------------------------

ProductDetailsReviewList.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsReviewList({ product }) {
  // const { reviews } = product;

  return (
    <Box sx={{ pt: 3, px: 2, pb: 5 }}>
      <List disablePadding>
        {product?.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  review: PropTypes.object,
};

function ReviewItem({ review }) {
  const [isHelpful, setHelpfuls] = useState(false);

  const {
    likes,
    rating,
    content,
    helpful,
    createdAt,
    avatarUrl,
    isPurchased,
    imageRating,
    idOrder: {
      idUser: { photoURL, displayName },
    },
  } = review;
  console.log('imageRating', imageRating);

  const handleClickHelpful = () => {
    setHelpfuls((prev) => !prev);
  };
  const THUMB_SIZE = 64;

  const RootStyle = styled('div')(({ theme }) => ({
    '& .slick-slide': {
      float: theme.direction === 'rtl' ? 'right' : 'left',
      '&:focus': { outline: 'none' },
    },
  }));

  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [nav1, setNav1] = useState();

  const [nav2, setNav2] = useState();

  const slider2 = useRef(null);
  const slider1 = useRef(null);

  const imagesLightbox = imageRating.map((_image) => _image);

  const handleOpenLightbox = (url) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  const settings1 = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    draggable: false,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (current, next) => setCurrentIndex(next),
  };

  const settings2 = {
    dots: false,
    arrows: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: imageRating.length > 3 ? 3 : imageRating.length,
  };

  useEffect(() => {
    if (slider1.current) {
      setNav1(slider1.current);
    }
    if (slider2.current) {
      setNav2(slider2.current);
    }
  }, []);

  const handlePrevious = () => {
    slider2.current?.slickPrev();
  };

  const handleNext = () => {
    slider2.current?.slickNext();
  };

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          mb: 5,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 0 },
            minWidth: { xs: 160, md: 240 },
            textAlign: { sm: 'center' },
            flexDirection: { sm: 'column' },
          }}
        >
          <Avatar
            src={photoURL}
            sx={{
              mr: { xs: 2, sm: 0 },
              mb: { sm: 2 },
              width: { md: 64 },
              height: { md: 64 },
            }}
            imgProps={{ referrerPolicy: 'no-referrer' }}
          />
          <div>
            <Typography variant="subtitle2" noWrap>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {fDate(createdAt)}
            </Typography>
          </div>
        </Box>

        <div>
          <Rating size="small" value={rating} precision={0.1} readOnly />

          <Typography
            variant="caption"
            sx={{
              my: 1,
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
            }}
          >
            <Iconify icon={'ic:round-verified'} width={16} height={16} />
            &nbsp;Xác nhận đã mua hàng
          </Typography>

          <Typography variant="body2">{content}</Typography>

          <RootStyle>
            <Box
              sx={{
                my: 3,
                '& .slick-current .isActive': { opacity: 1 },
                ...(imageRating.length === 1 && { maxWidth: THUMB_SIZE * 1 + 16 }),
                ...(imageRating.length === 2 && { maxWidth: THUMB_SIZE * 2 + 32 }),
                ...(imageRating.length === 3 && { maxWidth: THUMB_SIZE * 3 + 48 }),
                ...(imageRating.length === 4 && { maxWidth: THUMB_SIZE * 3 + 48 }),
                ...(imageRating.length >= 5 && { maxWidth: THUMB_SIZE * 6 }),
                ...(imageRating.length > 2 && {
                  position: 'relative',
                  '&:before, &:after': {
                    top: 0,
                    zIndex: 9,
                    content: "''",
                    height: '100%',
                    position: 'absolute',
                  },
                  '&:after': { right: 0, transform: 'scaleX(-1)' },
                }),
              }}
            >
              <Slider {...settings2}>
                {imageRating.map((img, index) => (
                  <Box key={img} sx={{ px: 0.75 }}>
                    <Image
                      disabledEffect
                      alt="thumb image"
                      src={img}
                      sx={{
                        width: THUMB_SIZE,
                        height: THUMB_SIZE,
                        borderRadius: 1.5,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                ))}
              </Slider>
            </Box>
          </RootStyle>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {!likes && (
              <Typography variant="body2" sx={{ mr: 1 }}>
                Nhận xét này có hữu ích cho bạn?
              </Typography>
            )}

            <Button
              size="small"
              color="inherit"
              startIcon={<Iconify icon={!likes ? 'ic:round-thumb-up' : 'eva:checkmark-fill'} />}
              onClick={handleClickHelpful}
            >
              {likes ? 'Helpful' : 'Thích'}({fShortenNumber(!likes ? helpful : helpful + 1)})
            </Button>
          </Box>
        </div>
      </ListItem>
    </>
  );
}
