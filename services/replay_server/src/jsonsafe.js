function JSONSafeParse(data) {
    try {
        return JSON.parse(data);
    } catch(err) {
        return null;
    }
}
