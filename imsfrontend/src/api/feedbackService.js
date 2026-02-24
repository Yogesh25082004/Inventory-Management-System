import api from "./axios";

export const submitFeedback = (data) =>
    api.post("/feedback", data);