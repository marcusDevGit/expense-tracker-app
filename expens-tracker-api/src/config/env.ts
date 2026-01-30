function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} não definida`);
  }
  return value;
}

export const env = {
  jwtSecret: required("JWT_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
};
