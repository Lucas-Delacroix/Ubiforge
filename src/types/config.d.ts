export type UbiforgeSource =
  | { kind: "download-official" }
  | { kind: "local-iso"; path: string };

export interface UbiforgeConfig {
  mode: "interactive" | "flags";
  flavor: "desktop" | "server";
  release: string;
  arch: string;
  source: UbiforgeSource | null;
  outputDir: string;
  packages: string[];
  debug: boolean;
}

