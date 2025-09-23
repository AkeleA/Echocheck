declare module "next-pwa" {
  export interface PWAOptions {
    dest: string;
    disable?: boolean;
  }
  const withPWA: (
    options?: Partial<PWAOptions>
  ) => (nextConfig?: import("next").NextConfig) => import("next").NextConfig;

  export default withPWA;
}
