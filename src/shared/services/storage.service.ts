import {inject, Injectable} from '@angular/core';
import {deleteObject, getDownloadURL, ref, Storage, uploadString} from '@angular/fire/storage';

export enum StorageFolder {
  POST = 'post-images',
}


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage: Storage = inject(Storage);

  constructor() {
  }

  async uploadImage( base64: string, fileName: string = "",
                      folder: StorageFolder = StorageFolder.POST, oldUrl: string = '') {

    if (oldUrl === base64) {
      return base64;
    }
    //detecte si l'ancienne images est une base64
    oldUrl = oldUrl.includes('data:images') ? '' : oldUrl;
    if (oldUrl && oldUrl != '' && oldUrl != base64) {
      const storageRef = ref(this.storage, oldUrl);
      deleteObject(storageRef).catch((e) => {
        console.error(e)
      });
    }

    if (fileName == '') {
      fileName = new Date().getTime().toString();
    }
    const extension = base64.split(';')[0].split('/')[1];
    const storageRef = ref(this.storage, `${folder}/${fileName}.${extension}`);
    const res = await uploadString(storageRef, base64, 'data_url');
    return await getDownloadURL(storageRef);
  }

  // Supprime une images dans le storage firebase
  async deleteImage(url: string) {
    const storageRef = ref(this.storage, url);
    return await deleteObject(storageRef);
  }

  async resizeBase64(base64: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create an Image object
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        // Calculate the new dimensions
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height *= maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width *= maxHeight / height));
            height = maxHeight;
          }
        }

        // Create a canvas with the new dimensions
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // @ts-ignore
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to a base64 string
        resolve(canvas.toDataURL('images/jpeg', 1));
      };
      img.onerror = reject;
    });
  }
}
