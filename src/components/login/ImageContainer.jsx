import React from "react";

const ImageContainer = () => {
  return (
    <section className="w-full h-full max-h-200 overflow-hidden rounded-lg hidden md:block">
      <img
        src="/src/assets/login-image-bg.jpg"
        alt="Doodle illustration for login page side image"
        className="size-full object-cover"
      />
    </section>
  );
};

export default ImageContainer;
