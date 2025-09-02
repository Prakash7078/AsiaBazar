import { Carousel } from "react-carousel-minimal";

const slideNumberStyle = {
  fontSize: "20px",
  fontWeight: "bold",
};

const ImageSlider = ({ data }) => {
  const images = data.map((url) => ({ image: url }));

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto" }}>
      <Carousel
        data={images}
        time={3000}
        width="100%"
        height="500px"
        radius="10px"
        slideNumber={true}
        slideNumberStyle={slideNumberStyle}
        automatic={false}
        dots={true}
        slideBackgroundColor="darkgrey"
        slideImageFit="cover"
        thumbnails={true}
        thumbnailWidth="100px"
        style={{
          maxHeight: "500px",
        }}
      />
    </div>
  );
};

export default ImageSlider;
