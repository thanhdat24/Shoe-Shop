// ----------------------------------------------------------------------

export default function getColorName(hex) {
  let color;

  switch (hex) {
    case '#00AB55':
      color = 'Xanh lá';
      break;
    case '#000000':
      color = 'Đen';
      break;
    case '#FFFFFF':
      color = 'Trắng';
      break;
    case '#FFC0CB':
      color = 'Hồng';
      break;
    case '#FF4842':
      color = 'Đỏ';
      break;
    case '#1890FF':
      color = 'Xanh dương';
      break;
    case '#94D82D':
      color = 'Greenyellow';
      break;
    case '#FFE700':
      color = 'Vàng';
      break;
    case '#FFC107':
      color = 'Cam';
      break;
    default:
      color = hex;
  }

  return color;
}
