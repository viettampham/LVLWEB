import { Component,Inject,PLATFORM_ID,signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';


@Component({
  imports: [NzButtonModule, NzModalModule,CKEditorModule,FormsModule],
  selector: 'app-news',
  styleUrl: './news.scss',
  templateUrl: './news.html',
})
export class News {
  Editor: any;
  config: any;

  public data = '<p>Hello CKEditor 5!</p>';

  isVisible = signal(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const ck = await import('ckeditor5');
      this.Editor = ck.ClassicEditor;
      this.config = {
        licenseKey: 'GPL',

        plugins: [
          ck.Essentials,
          ck.Paragraph,
          ck.Heading,

          // Font
          ck.FontSize,
          ck.FontFamily,
          ck.FontColor,
          ck.FontBackgroundColor,

          // Text
          ck.Bold,
          ck.Italic,
          ck.Underline,
          ck.Strikethrough,
          ck.Subscript,
          ck.Superscript,

          // Layout
          ck.Alignment,
          ck.Indent,

          // List
          ck.List,
          ck.ListProperties,

          // Link
          ck.Link,

          // Table
          ck.Table,
          ck.TableToolbar,
          ck.TableProperties,
          ck.TableCellProperties,

          // Image
          ck.ImageBlock,
          ck.ImageInline,
          ck.ImageToolbar,
          ck.ImageCaption,
          ck.ImageResize,
          ck.ImageStyle,

          // Upload
          ck.Base64UploadAdapter,

          // Other
          ck.BlockQuote,
          ck.HorizontalLine,
          ck.SpecialCharacters
        ],

        toolbar: [
          'undo',
          'redo',
          '|',

          'heading',
          '|',

          'fontFamily',
          'fontSize',
          'fontColor',
          'fontBackgroundColor',
          '|',

          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',

          'alignment',
          '|',

          'bulletedList',
          'numberedList',
          '|',

          'outdent',
          'indent',
          '|',

          'link',
          'insertTable',
          'blockQuote',
          'horizontalLine',
          '|',

          'insertImage'
        ],

        image: {
          toolbar: [
            'imageTextAlternative',
            '|',
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            '|',
            'resizeImage'
          ]
        }
      };
    }
  }
  
  handleCancel() {
    this.isVisible.set(false);
  }

  showModal(): void {
    this.isVisible.set(true);
  }

  handleOk(){
  }
}
