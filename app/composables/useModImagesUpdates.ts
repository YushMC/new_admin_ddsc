const fetchUpdateLogo = async (modId: number, logo: File) =>
  await saveImagesToBD<{ resource: ImagesInterface }>(
    "IMAGES",
    `logo/${modId}`,
    "PUT",
    logo,
  );
const fetchUpdateMainImage = async (modId: number, main: File) =>
  await saveImagesToBD<{ resource: ImagesInterface }>(
    "IMAGES",
    `main/${modId}`,
    "PUT",
    main,
  );
const fetchUpdateScreenshot = async (imageID: number, screenshot: File) =>
  await saveImagesToBD<{ resource: ImagesInterface }>(
    "IMAGES",
    `screenshots/${imageID}`,
    "PUT",
    screenshot,
  );

const fetchCreateLogo = async (modId: number, logo: File) =>
  await saveImagesToBD<{ resource: ImagesInterface }>(
    "IMAGES",
    `logo/${modId}`,
    "POST",
    logo,
  );
const fetchCreateMainImage = async (modId: number, main: File) =>
  await saveImagesToBD<{ resource: ImagesInterface }>(
    "IMAGES",
    `main/${modId}`,
    "POST",
    main,
  );
const fetchCreateScreenshot = async (modId: number, screenshot: File) =>
  await saveImagesToBD<{ resource: ImagesInterface }>(
    "IMAGES",
    `screenshots/${modId}`,
    "POST",
    screenshot,
  );

export const useModsImagesUpdates = () => {
  return {
    fetchUpdateLogo,
    fetchUpdateMainImage,
    fetchUpdateScreenshot,

    fetchCreateLogo,
    fetchCreateMainImage,
    fetchCreateScreenshot,
  };
};
