import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  getPublicIP,
  getLocalIP,
  ping,
  traceroute,
  getCPUUsage,
  getMemoryUsage,
  getGPUUsage,
  getNetworkInterfaces,
  speedTest,
} from "./diagnostics";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  diagnostics: router({
    getPublicIP: publicProcedure.query(async () => {
      const ip = await getPublicIP();
      return { ip };
    }),
    getLocalIP: publicProcedure.query(() => {
      const ip = getLocalIP();
      return { ip };
    }),
    ping: publicProcedure.query(async () => {
      const result = await ping();
      return result;
    }),
    traceroute: publicProcedure.query(async () => {
      const hops = await traceroute();
      return { hops };
    }),
    getCPU: publicProcedure.query(() => {
      const cpu = getCPUUsage();
      return cpu;
    }),
    getMemory: publicProcedure.query(() => {
      const memory = getMemoryUsage();
      return memory;
    }),
    getGPU: publicProcedure.query(async () => {
      const gpu = await getGPUUsage();
      return gpu;
    }),
    getNetworkInterfaces: publicProcedure.query(() => {
      const interfaces = getNetworkInterfaces();
      return { interfaces };
    }),
    speedTest: publicProcedure.query(async () => {
      const speed = await speedTest();
      return speed;
    }),
  }),
});

export type AppRouter = typeof appRouter;
