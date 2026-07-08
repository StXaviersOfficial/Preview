const { chromium } = require("playwright");
(async () => {
  try {
    const browser = await chromium.launch({ args: ["--no-sandbox"] });
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => { localStorage.setItem("xavier-lang", "hi"); });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText);
    const words = text.match(/[A-Za-z]{4,}/g) || [];
    const skip = ["CBSE","Xavier","AISSCE","Muzaffarpur","Bihar","Ramna","Goshala","India","Hindi","English","Sanskrit","Commerce","Science","Maths","whatsapp","gmail","instagram","facebook","March","April","Nursery","Krishna","Saraf","Priya","Aditya","Sneha","Rohit","Ananya","Vikram","Shreya","Arnav","Puja","Riya","Anshika","Amitabh","Chandra","Dutta","Sinha","class","Class","smart","Smart","labs","Labs"];
    const unique = [...new Set(words)].filter(w => !skip.includes(w) && !w.match(/^[A-Z]+$/) && w.length > 4);
    console.log("Untranslated (" + unique.length + "):");
    console.log(unique.slice(0, 50).join(", "));
    await browser.close();
  } catch(e) {
    console.error("Error:", e.message);
  }
})();
