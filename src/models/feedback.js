class Feedback {
    constructor({ email, message, createdAt = new Date() }) {
        this.email = email;
        this.message = message;
        this.createdAt = createdAt;
    }
}

module.exports = Feedback;