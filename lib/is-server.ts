/**
 * Determines if the code is running on the server or client side
 * @returns boolean indicating if the code is running on the server
 */
export const isServer = () => typeof window === "undefined"
