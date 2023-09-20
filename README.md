website : [jouleslabs-pdf-editor](https://jouleslabs-pdf-editor.asifulmridul.xyz/)   
source-code : [jouleslabs-pdf-editor](https://github.com/asifulhaque087/jouleslabs-pdf-editor)

# Features

## Upload and Merge Multiple Files

Upload multiples files will be merged into a single PDF file. This simplifies the process of managing and consolidating documents.

## Zoom-In and Zoom-Out with Precision

Zoom-in & zoom-out feature from cursor point. `Scroll down` for zoom-in and ` scroll up` for zoom out.

## Attach Multi-Line Text and Resizeable Images

Add multi-line text elements and image attachments. You can freely position and resize images by dragging their **top-left** corner.

## Efficient File Storage

Uploaded PDF files are securely stored in the public directory using Next.js API routing. For images, they are converted into base64 strings and stored in local storage. Please note that local storage has a limited capacity of 5MB, so be mindful of your image uploads.

# Development Guide

This development guide will tell you, how can you start with the application:

### Hooks for Streamlined Development

1. **useUploader:** This hook handles all file uploading-related tasks, ensuring a smooth and efficient process.
2. **usePdf:** For PDF-related tasks, use this hook to manage file processing and merging.
3. **useAttach:** When dealing with attachments (text and images), the useAttach hook simplifies attachment management.

### Initialization Functions

After uploading a file, two essential functions come into play:

- **initialize function (usePdf):** Sets up the required states and handles PDF-related tasks.
- **initAttach function (useAttach):** Manages attachment data and state. These functions are also called from useEffect to handle cached files inside the public directory and attachment data in local storage.

### Develop

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

# Drawbacks

By the way, it has some limitation also. It's essential to be aware of its limitations:

1. **Attachment Responsiveness:** Zooming in or out affects the PDF content, but attachments (text and images) won't scale accordingly.

2. **Image Upload Limit:** Keep in mind that local storage has a capacity limit of 5MB for image uploads. Be cautious when uploading large image files to avoid exceeding this limit.
