
// This file overwrites the stock UV config.js

self.__uv$config = {
  prefix: "/petezah/petezah/",
  bare: "https://bare.cbgames.org/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/petezah/handler.js",
  client: "/petezah/client.js",
  bundle: "/petezah/bundle.js",
  config: "/petezah/config.js",
  sw: "/petezah/rizz.sw.js",
};
