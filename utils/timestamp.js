// function that exposts a timestamp in order to create a unique id for tests

function today() {
    const date = new Date();
    const sec = String(date.getSeconds()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear());
    return {sec,min,hour,day,month,year};
}

export default today()