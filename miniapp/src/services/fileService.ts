export async function uploadFile(file : File) : Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`/files/upload/images`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) throw new Error('Ошибка при загрузке файла');
    const path = (await response.json()).path;
    console.log(`file uploaded to ${path}`);
    return path;
}

export async function uploadAvatar(file : File) : Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`/files/upload/avatars`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) throw new Error('Ошибка при загрузке файла');
    const path = (await response.json()).path;
    console.log(`file uploaded to ${path}`);
    return path;
}