// make 'import ... from "@/...";' work in Webstorm

module.exports = {
  resolve: {
    alias: {
      "@": require("path").resolve(__dirname, "src")
    }
  }
};