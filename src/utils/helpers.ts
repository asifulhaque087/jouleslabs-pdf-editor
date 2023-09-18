interface Position {
  top: number;
  left: number;
}

export function ggID(): () => number {
  let id = 0;
  return function genId() {
    // return id++;
    return Math.floor(Math.random() * 10000);
  };
}

export const getMovePosition = (
  x: number,
  y: number,
  dragX: number,
  dragY: number,
  width: number,
  height: number,
  pageWidth: number,
  pageHeight: number
): Position => {
  // console.log("old x is ", dragX);
  // console.log("new x is ", x);

  const newPositionTop = y + dragY;
  const newPositionLeft = x + dragX;
  const newPositionRight = newPositionLeft + width;
  const newPositionBottom = newPositionTop + height;

  const top =
    newPositionTop < 0
      ? 0
      : newPositionBottom > pageHeight
      ? pageHeight - height
      : newPositionTop;
  const left =
    newPositionLeft < 0
      ? 0
      : newPositionRight > pageWidth
      ? pageWidth - width
      : newPositionLeft;

  return {
    top,
    left,
  };
};

export const normalize = (value: number): number =>
  parseFloat((value / 255).toFixed(1));

export const convertToBase64 = (file: File) => {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log(reader.result);
    return reader.result;
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
};

export const getBase64 = (file: File) => {
  return new Promise<string>((resolve) => {
    // Specify the Promise type as string
    let baseURL: string = "";
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load something...
    reader.onload = () => {
      // Make a fileInfo Object
      if (typeof reader.result === "string") {
        // Check if it's a string
        baseURL = reader.result;
        // finally
        resolve(baseURL);
      } else {
        // Handle the case where reader.result is not a string
        resolve(""); // You can choose a default value or handle the error appropriately
      }
    };
  });
};

export const base64StringToFile = (
  dataurl: string,
  filename: string
): File | null => {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    return null; // Invalid data URL
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

// export const base64StringToFile = (dataurl: string, filename: string) => {
//   var arr = dataurl.split(","),
//     // mime = arr[0].match(/:(.*?);/)[1],
//     bstr = atob(arr[arr.length - 1]),
//     n = bstr.length,
//     u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], filename, { type: mime });
// };

// export const base64StringToFile = (base64: string, name: string) => {
//   // Convert the Base64 string back to binary
//   // const binaryString = atob(base64String);

//   // // Create a Uint8Array from the binary string
//   // const bytes = new Uint8Array(binaryString.length);
//   // for (let i = 0; i < binaryString.length; i++) {
//   //   bytes[i] = binaryString.charCodeAt(i);
//   // }

//   // // Create a Blob from the Uint8Array
//   // const blob = new Blob([bytes]);

//   var base64Parts = base64.split(",");
//   var fileFormat = base64Parts[0].split(";")[1];
//   var fileContent = base64Parts[1];

//   console.log("base64 parts is ", base64Parts);
//   console.log("file format is ", fileFormat);
//   console.log("file content is ", fileContent);

//   // Create a File object without changing the name and type
//   // const file = new File([blob], blob.name, { type: blob.type });

//   // const file = new File([fileContent], name, { type: fileFormat });
//   const file = new File([fileContent], name, { type: "image/jpeg" });

//   return file;
// };

// export const convertToBase64 = async (files) => {
//   let new_list = [];
//   for (let file of files) {
//     let result = await getBase64(file);
//     new_list = [...new_list, result];
//   }

//   return new_list;
// };
