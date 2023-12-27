import fs from "fs";

export async function upload(files: any) {
  const destination = "./public";

  try {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    for (const file of files) {
      const { filename, filepath } = file;

      const uniqueFileName = generateUniqueFileName(filename);

      await fs.promises.rename(filepath, `${destination}/${uniqueFileName}`);
    }
  } catch (error) {
    throw error;
  }
}

function generateUniqueFileName(filename: string) {
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}_${filename}`;

  const regex = /[^a-zA-Z0-9.-_]/g;
  return uniqueFileName.replace(regex, "");
}
