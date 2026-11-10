import React from "react";
import image from "../../assets/login-image-bg.jpg";

const ImageContainer = () => {
  return (
    <section className="relative hidden h-full w-full overflow-hidden rounded-lg md:block">
      <img
        src={image}
        alt="Doodle illustration for login page side image"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </section>
  );
};

export default ImageContainer;
