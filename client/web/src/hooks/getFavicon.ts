import axios from "axios";
import cheerio from "cheerio";

const getFavicon = async (url: string) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");
    if (!favicon) {
      console.log("Favicon not found in the HTML. Trying /favicon.ico");
      favicon = "/favicon.ico";
    }
    // Resolve the favicon URL relative to the base URL
    const faviconUrl = new URL(favicon, url);
    return faviconUrl.toString();
  } catch (error) {
    console.error(error);
  }
};

getFavicon("https://lucide.dev/");

export default getFavicon;