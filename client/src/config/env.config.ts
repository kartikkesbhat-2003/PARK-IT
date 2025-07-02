export const envConfig ={
    SERVER_BASE_URL: import.meta.env.VITE_SERVER_BASE_URL as string,
    VITE_MAP_API_KEY: import.meta.env.VITE_MAP_API_KEY as string,
} as const