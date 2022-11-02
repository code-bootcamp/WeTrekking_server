import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ImageService } from '../Images/images.service';

// import { v4 } from 'uuid';

@Injectable()
export class FileService {
  // constructor( private readonly ImageService: ImageService, //
  // ) {}

  async upload({ file, type }) {
    const waitedImages = await Promise.all(file);
    console.log(waitedImages);
    console.log('@@@@@@@@@');

    const storage = new Storage({
      projectId: process.env.STORAGE_PROJECT_ID,
      keyFilename: process.env.STORAGE_KEY_FILE_NAME,
    }).bucket(process.env.STORAGE_BUCKET);

    const result = [];
    await Promise.all(
      waitedImages.map(async (el) => {
        const url = await new Promise((resolve, reject) => {
          // const fname = `${v4()}`;
          el.createReadStream()
            .pipe(storage.file(el.filename).createWriteStream())
            .on('finish', async () => {
              resolve(
                `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/${el.filename}`,
              );
            })
            .on('error', () => reject('실패!!'));
        });
        result.push(url);
        console.log(url);
        console.log('$$$$$$$$$$$$$');
      }),
    );
    console.log(result);

    return result;

    // return this.ImageService.create({ result });
  }
}
