const ERROR_MESSAGES = {
    400: "We couldn't process that request. Please check your input and try again.",
    403: "You don't have permission to access that page.",
    404: "The page or item you're looking for could not be found.",
    413: "The uploaded file is too large.",
    500: "A technical problem occurred. Please try again."
};

module.exports = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    let status = error.status || error.statusCode;
    if (!Number.isInteger(status) || status < 400 || status > 599) {
        status = 500;
    }

    if (error.code === "LIMIT_FILE_SIZE") {
        status = 413;
    } else if (error.message === "Only image files are allowed.") {
        status = 400;
    }

    const message = ERROR_MESSAGES[status] || ERROR_MESSAGES[500];
    if (typeof res.locals.user === "undefined") {
        res.locals.user = (req.session && req.session.user) || null;
    }
    res.locals.flash = {
        type: "error",
        message
    };

    if (status >= 500) {
        console.error(error);
    }

    const acceptsJson = req.originalUrl.startsWith("/api/")
        || req.path === "/listings/api"
        || req.accepts(["html", "json"]) === "json";

    if (acceptsJson) {
        return res.status(status).json({ error: message });
    }

    return res.status(status).render("error", { status }, (renderError, html) => {
        if (renderError) {
            console.error(renderError);
            return res.status(500).type("text/plain").send(ERROR_MESSAGES[500]);
        }

        res.send(html);
    });
};
