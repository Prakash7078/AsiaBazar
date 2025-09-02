export const formatedDate=(date)=>{
    const createdDate = new Date(date);
    const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    };

    const formattedDate = createdDate.toLocaleDateString('en-US', options);
    return formattedDate;
}

export const formatedDateTime=(date)=>{
    const createdDate = new Date(date);
    const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    };

    const formattedDate = createdDate.toLocaleDateString('en-US', options);
    return formattedDate;
}