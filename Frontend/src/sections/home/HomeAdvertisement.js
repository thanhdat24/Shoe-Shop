import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Container, Typography } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 456,
  margin: 'auto',
  overflow: 'hidden',
  paddingBottom: theme.spacing(10),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundImage: `linear-gradient(135deg,
    ${theme.palette.primary.main} 0%,
    ${theme.palette.primary.dark} 100%)`,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    maxWidth: '100%',
    paddingBottom: 0,
    alignItems: 'center',
  },
}));

// ----------------------------------------------------------------------

export default function HomeAdvertisement() {
  return (
    <Container component={MotionViewport} sx={{ position: 'relative', textAlign: 'center', marginTop: 10 }}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Sản phẩm độc quyền
        </Typography>
      </m.div>
      <ContentStyle>
        <Box
          component={m.div}
          variants={varFade().inUp}
          sx={{
            mb: { xs: 3, md: 0 },
          }}
        >
          <m.div animate={{ y: [-20, 0, -20] }} transition={{ duration: 4, repeat: Infinity }}>
            <Image
              visibleByDefault
              alt="rocket"
              src="https://res.cloudinary.com/web-app-shoes/image/upload/v1682922011/bjafzeqxahulaqclbvmw.png"
              disabledEffect
              sx={{ maxWidth: 460 }}
            />
          </m.div>
        </Box>

        <Box
          sx={{
            pl: { md: 10 },
            textAlign: { xs: 'center', md: 'left', width: '50% ' },
          }}
        >
          <Box component={m.div} variants={varFade().inDown} sx={{ color: 'common.white', mb: 5 }}>
            <Typography variant="h2">Nike Invincible 3 By You</Typography>
            <Typography
              className="line-clamp-4"
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: `<p>
                    Giày chạy bộ Invincible Run 3 được thiết kế với lớp đệm dày giúp bạn luôn tự tin và thoải mái trong
                    suốt cuộc chạy. Đế giày đàn hồi và bật nhảy tốt, giúp bạn di chuyển dễ dàng trên mọi địa hình và sẵn
                    sàng cho cuộc chạy tiếp theo. Với nhiều lựa chọn về phần trên và đế giày, bạn có thể tự do lựa chọn
                    phong cách và tạo dấu ấn cá nhân cho riêng mình. Bên cạnh đó, với sự kết hợp hoàn hảo giữa thẩm mỹ
                    và chức năng, đôi giày này sẽ khiến bạn trông bất khả chiến bại và cảm thấy tuyệt vời trên mỗi bước
                    chân.
                  </p>`,
              }}
            />
            {/* <Typography variant="body"></Typography> */}
          </Box>
          <m.div variants={varFade().inDown}>
            <Button
              size="large"
              variant="contained"
              target="_blank"
              rel="noopener"
              href="http://localhost:3030/product/nike-invincible-3"
              sx={{
                whiteSpace: 'nowrap',
                boxShadow: (theme) => theme.customShadows.z8,
                color: (theme) => theme.palette.getContrastText(theme.palette.common.white),
                bgcolor: 'common.white',
                '&:hover': { bgcolor: 'grey.300' },
              }}
            >
              Mua ngay
            </Button>
          </m.div>
        </Box>
      </ContentStyle>
    </Container>
  );
}
