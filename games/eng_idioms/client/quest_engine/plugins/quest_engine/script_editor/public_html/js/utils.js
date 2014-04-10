function assert(assertion, msg) {
    if (!assertion)
        throw msg || "assertion failure";
}
