module.exports = {
    app: {
        apiPath: '/api',
        secret: 'SomeSecr3t'
    },
    mongo: {
        host: process.env.MONGO_HOST || "localhost",
        db: "scholar",
        user: "scholar",
        pass: "kernel"
    },
    comparison: {
        threshold: '0.1'
    }
};
