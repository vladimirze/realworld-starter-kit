const date = {
    format: function(isoDate) {
        return new Date(isoDate).toDateString();
    }
};

export {
    date
}