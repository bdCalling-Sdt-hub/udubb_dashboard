// export const url = `${import.meta.env.VITE_URL}`;
// export const url = `http://52.45.173.22:5000`;
export const url = `http://10.0.60.137:5050`;
export const imageUrl = (image) => {
  return image
    ? image?.startsWith(`http`)
      ? image
      : image?.startsWith('/')
      ? `${url}${image}`
      : `${url}/${image}`
    : `https://placehold.co/400`;
};
