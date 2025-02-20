export  function trxId() {
    const timeStamp = Date.now().toString(36).substring(4, 8).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  
    return `trx${timeStamp}-${randomPart}`;
  }

  export function formatDateTime(date) {
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });
  }
  