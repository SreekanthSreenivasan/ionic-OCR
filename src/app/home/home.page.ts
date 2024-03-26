import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Tesseract from 'tesseract.js';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ocrResult: any;

  constructor() { }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    // Convert image URI to base64
    const imageUrl = await this.getBase64Image(image.webPath);

    // Perform OCR on the image
    const result = await Tesseract.recognize(
      imageUrl
    );

    console.log('OCR Result:', result.data.text);
    this.ocrResult = result.data.text;

  }

  // Convert image URI to base64
  private async getBase64Image(imageUri: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
      img.src = imageUri;
    });
  }

}
