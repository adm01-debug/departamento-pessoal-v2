export const copyText = async (text: string) => { 
  try { 
    await navigator.clipboard.writeText(text); 
    return true; 
  } catch { 
    return false; 
  } 
};

// Alias for copyText
export const copyToClipboard = copyText;

export const pasteText = async () => { 
  try { 
    return await navigator.clipboard.readText(); 
  } catch { 
    return null; 
  } 
};

export const copyImage = async (imageUrl: string) => { 
  const img = await fetch(imageUrl); 
  const blob = await img.blob(); 
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]); 
};
