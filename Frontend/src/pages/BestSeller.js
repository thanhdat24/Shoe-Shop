import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBestSeller } from '../redux/slices/product';
import BestSellerList from '../sections/@dashboard/e-commerce/bestSeller/BestSellerList';

export default function BestSeller() {
  const dispatch = useDispatch();
  const { bestSeller } = useSelector((item) => item.product);

  useEffect(() => {
    if (bestSeller === null) dispatch(getBestSeller());
  }, [dispatch]);

  console.log('bestSeller', bestSeller);
  return (
    <Container>
      <Typography variant="h2" sx={{ textAlign: 'center' }}>
        Sản phẩm bán chạy
      </Typography>
      <div>
        <BestSellerList bestSellerProd={bestSeller} loading={!bestSeller?.length}>
          ""
        </BestSellerList>
        {/* <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="/static/images/cards/contemplative-reptile.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Lizard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all
                continents except Antarctica
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
          </CardActions>
        </Card> */}
      </div>
    </Container>
  );
}
