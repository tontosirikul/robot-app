import { Image } from "react-konva";
import useImage from "use-image";

const MyImage = ({ url, x, y }) => {
  const [image] = useImage(url);
  return <Image image={image} x={x} y={y} />;
};

export default MyImage;
