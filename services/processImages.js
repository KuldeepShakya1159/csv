const sharp = require('sharp');



const compressImage = async (inputImagePath,outputImagePath)=>{
    try{
        const image = sharp(inputImagePath);
        const metadata = await image.metadata();
        const format = metadata.format;

        switch (format) {
            case 'jpeg':
            case 'jpg':
              await image.jpeg({ quality: 50 }).toFile(outputImagePath);
              break;
            case 'png':
              await image.png({ quality: 50, compressionLevel: 9 }).toFile(outputImagePath);
              break;
            case 'webp':
              await image.webp({ quality: 50 }).toFile(outputImagePath);
              break;
            case 'tiff':
              await image.tiff({ quality: 50 }).toFile(outputImagePath);
              break;
            default:
              throw new Error(`Unsupported image format: ${format}`);
          }
          console.log(`Image successfully compressed and saved as: ${outputImagePath}`);
          return process.env.URL+`/${outputImagePath}`;
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports ={compressImage}