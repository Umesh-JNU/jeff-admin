export const getDateTime = (dt) => {
  const dT = dt.split(".")[0].split("T");
  return `${dT[0]} ${dT[1]}`;
};

export const getLocaleTime = (dt) => {
  if(!dt) return [null, null];
  
  const dateObj = new Date(dt);
  const hour = parseInt(dateObj.getHours().toLocaleString());

  const hr = String(hour % 12 || 12).padStart(2, '0');
  const min = dateObj.getMinutes().toLocaleString().padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';

  return [dateObj.toLocaleDateString(), `${hr}:${min} ${ampm}`]
};