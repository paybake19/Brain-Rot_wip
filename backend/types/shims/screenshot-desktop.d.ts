declare module "screenshot-desktop" {
  interface Options {
    format?: "png" | "jpg";
    filename?: string;
  }
  function screenshot(options?: Options): Promise<Buffer>;
  export = screenshot;
}
