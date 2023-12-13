import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

BestSellerCard.propTypes = {
  index: PropTypes.number,
  product: PropTypes.object,
  onSelected: PropTypes.func,
};

export default function BestSellerCard({ index, product, onSelected }) {
  const [hover, setHover] = useState(false);
  const initialStyle = {
    backgroundColor: (index === 0 && 'darksalmon') || (index === 1 && 'sienna') || 'darkslategray',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '25px',
    border: '1px solid ',
    borderColor: (index === 0 && 'darksalmon') || (index === 1 && 'sienna') || 'darkslategray',
  };

  const hoverStyle = {
    backgroundColor: 'white',
    color: (index === 0 && 'darksalmon') || (index === 1 && 'sienna') || 'darkslategray',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '25px',
    border: '1px solid ',
    borderColor: (index === 0 && 'darksalmon') || (index === 1 && 'sienna') || 'darkslategray',
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: '20px',
        margin: '20px 0',
        position: 'relative',
        overflow: 'inherit !important',
        boxShadow: '0px 1px 11px 2px #8888882e',
      }}
    >
      <Box
        sx={{
          backgroundColor: (index === 0 && 'darksalmon') || (index === 1 && 'sienna') || 'darkslategray',
          height: '235px',
          borderRadius: '20px 20px 0 0',
        }}
      >
        <CardMedia
          sx={{
            position: 'absoulte',
            height: 240,
            top: 0,
            left: 0,
            width: '375px',
            transform: 'translateY(-13%) translateX(-14%) rotate(-40deg)',
          }}
          image={product?.productImages[0].cover || product?.productImages[0].url[0]}
          title="green iguana"
        />
      </Box>
      <CardContent className="text-center">
        <Typography sx={{ color: 'gray', textTransform: 'uppercase' }} gutterBottom variant="body2">
          {product?.idCate.name}
        </Typography>
        <Typography gutterBottom variant="h4" component="div" className="uppercase">
          {product?.name}
        </Typography>
        <Typography
          className="line-clamp-4"
          variant="body2"
          color="text.secondary"
          dangerouslySetInnerHTML={{ __html: product?.desc }}
        />
      </CardContent>
      <CardActions className="justify-center pb-4 mb-4">
        <Button
          onClick={() => onSelected()}
          size="small"
          variant={!hover ? 'contained' : 'outlined'}
          style={hover ? hoverStyle : initialStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Chi tiết sản phẩm
        </Button>
      </CardActions>
    </Card>
  );
}
