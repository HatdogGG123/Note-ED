import React from "react";

const ImageContainer = () => {
  return (
    <section className="w-full h-full overflow-hidden rounded-lg">
      <img
        src="/src/assets/login-image-bg.jpg"
        alt="Doodle illustration for login page side image"
        className="w-full h-full object-cover"
      />
    </section>
  );
};

export default ImageContainer;
