export const isOverleafDocument = () =>
  /^https:\/\/www\.overleaf\.com\/project\/[a-f0-9]{24}$/.test(
    window.location.href
  );
